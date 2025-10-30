"""from fastapi import APIRouter, HTTPException, status, Request, Depends
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from fastapi.responses import JSONResponse, HTMLResponse, RedirectResponse
from fastapi.logger import logger
from fastapi.security import OAuth2PasswordBearer
from asgiref.sync import sync_to_async
from jose import JWTError, jwt
from django.core.exceptions import ObjectDoesNotExist

from fastapi_app.config import SECRET_KEY, ALGORITHM

from fastapi_app.django_setup import django_setup
django_setup()

from fastapi_app.pricing_page import create_subscription_for_user # pricing
from django.utils import timezone
from dateutil.relativedelta import relativedelta
from django.db import transaction
from datetime import datetime
from django.contrib.auth.hashers import make_password, check_password

from starlette.concurrency import run_in_threadpool
import os
import django
import requests
from urllib.parse import urlencode
from dotenv import load_dotenv

load_dotenv()

AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN")
AUTH0_CLIENT_ID = os.getenv("AUTH0_CLIENT_ID")
AUTH0_CLIENT_SECRET = os.getenv("AUTH0_CLIENT_SECRET")
AUTH0_CALLBACK_URL = os.getenv("AUTH0_CALLBACK_URL")

# Setup Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "my_project.settings")
django.setup() 

from appln.models import UserData, UserSubscription
from social_django.models import UserSocialAuth
from django.contrib.auth.hashers import check_password

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(BaseModel):
    email: EmailStr
    password: str

def hash_password(password: str) -> str:
    return make_password(password)

def verify_password(plain: str, hashed: str) -> bool:
    return check_password(plain, hashed)

# Helper function to create user and subscription asynchronously
@sync_to_async
def create_subscription_for_user(user: UserData):
    # Extract optional fields safely
    email = user.email if user.email else None
    userid = getattr(user, 'userid', None)
    first_name = getattr(user, 'first_name', None)

    # Check if subscription already exists
    subscription, created = UserSubscription.objects.get_or_create(user=user)

    if created:
        subscription.email = email
        subscription.userid = userid
        subscription.first_name = first_name

        subscription.current_plan = 'basic'
        subscription.pricing = 0.00
        subscription.plan_expiring_date = timezone.now() + relativedelta(months=1)
        subscription.renews_on = timezone.now().date() + relativedelta(months=1)
        subscription.total_credits = 10
        subscription.used_credits = 0
        subscription.total_credits_used_all_time = 0
        subscription.save()

    return subscription



@sync_to_async
def user_exists(email: str):
    return UserData.objects.filter(email=email).exists()

@router.post("/signup")
async def signup(user_data: User):
    try:
        if await user_exists(user_data.email):
            raise HTTPException(status_code=400, detail="Email already registered")

        hashed_pwd = hash_password(user_data.password)

        user = await sync_to_async(UserData.objects.create)(
            email=user_data.email,
            password=hashed_pwd,
            provider="email"
        )

        await create_subscription_for_user(user)

        return JSONResponse(status_code=status.HTTP_201_CREATED, content={"message": "User created successfully"})

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
async def login(user_data: User):
    try:
        # Try fetching user from database
        user = await sync_to_async(UserData.objects.get)(email=user_data.email)

        try:
            # Verify the password
            if not verify_password(user_data.password, user.password):
                raise HTTPException(status_code=401, detail="Invalid password")
        except ValueError as e:
            # Hash-related issues (e.g., malformed hash)
            raise HTTPException(status_code=401, detail="Invalid password format")

        return {"message": "Login successful"}

    except UserData.DoesNotExist:
        raise HTTPException(status_code=404, detail="User not found")
    except HTTPException as e:
        raise e
    except Exception as e:
        print("Login Error:", e)
        raise HTTPException(status_code=500, detail="Something went wrong")



@router.get("/callback")
async def auth_callback(request: Request):
    code = request.query_params.get("code")
    if not code:
        raise HTTPException(status_code=400, detail="Authorization code not found")

    # Step 1: Exchange code for access token
    token_url = f"https://{AUTH0_DOMAIN}/oauth/token"
    data = {
        'grant_type': 'authorization_code',
        'client_id': AUTH0_CLIENT_ID,
        'client_secret': AUTH0_CLIENT_SECRET,
        'code': code,
        'redirect_uri': AUTH0_CALLBACK_URL,
    }

    response = requests.post(
        token_url,
        data=urlencode(data),
        headers={'Content-Type': 'application/x-www-form-urlencoded'}
    )
    token_info = response.json()
    access_token = token_info.get('access_token')
    if not access_token:
        raise HTTPException(status_code=400, detail="Token exchange failed")

    # Step 2: Get user info using access token
    user_info_url = f"https://{AUTH0_DOMAIN}/userinfo"
    user_info_response = requests.get(
        user_info_url,
        headers={'Authorization': f'Bearer {access_token}'}
    )
    user_info = user_info_response.json()

    # Extract data from Auth0 response
    email = user_info.get('email')  # Google will give email
    sub = user_info.get('sub')      # e.g. google-oauth2|12345
    provider = sub.split("|")[0]    # google-oauth2 / facebook / apple
    user_id = sub                   # full unique ID for fb/apple
    first_name = user_info.get('given_name') or user_info.get('name') or "User"

    # Email is only required for Google
    if provider == "google-oauth2" and not email:
        raise HTTPException(status_code=400, detail="User email not found")

    # Step 3: Route to provider-specific handler
    if provider == "google-oauth2":
        return await handle_google_signup_login(email, first_name)
    elif provider == "facebook":
        return await handle_facebook_signup_login(user_id, first_name)
    elif provider == "apple":
        return await handle_apple_signup_login(user_id)
    else:
        raise HTTPException(status_code=400, detail="Unsupported provider")


async def create_user_and_subscription(user_data):
    # Common logic to create a user and subscription
    user = await sync_to_async(UserData.objects.create)(**user_data)
    subscription_response = create_subscription_for_user(user_data['email'])  # Or use user_data['userid'] for social logins
    return user, subscription_response


async def handle_provider_signup_login(email: str, first_name: str, provider: str, user_id: str = None):
    try:
        # Use atomic transaction for safety
        @sync_to_async
        def process_user():
            with transaction.atomic():
                # Find or create user
                user, created = UserData.objects.get_or_create(
                    email=email if email else f"{user_id}@{provider}.com",  # Fallback email for social providers
                    defaults={
                        "first_name": first_name or "User",
                        "password": hash_password(str(user_id)),  # Social users get a hashed user_id as password
                        "userid": user_id, # Store social provider's user ID
                        "provider": provider.capitalize()
                    }
                )
                
                # Create subscription ONLY for new users
                if created:
                    UserSubscription.objects.create(
                        user=user,
                        current_plan='basic',
                        pricing=0.00,
                        plan_expiring_date=timezone.now() + relativedelta(months=1),
                        renews_on=timezone.now().date() + relativedelta(months=1),
                        total_credits=10,
                        used_credits=0
                    )
                    logger.info(f"New {provider} user and subscription created: {email or user_id}")
                
                return user, created

        user, created = await process_user()
        token = jwt.encode({"sub": user.email}, SECRET_KEY, algorithm=ALGORITHM)
        
        response = JSONResponse({
            "message": "Login successful" if not created else "Signup successful",
            "access_token": token
        })
        response.set_cookie(key="access_token", value=token, httponly=True, secure=True)
        return response

    except Exception as e:
        logger.error(f"{provider} auth error: {str(e)}")
        raise HTTPException(status_code=400, detail=f"{provider} authentication failed")

@router.post("/google_signup_login")
async def handle_google_signup_login(email: str, first_name: str):
    return await handle_provider_signup_login(email, first_name, "google")

@router.post("/facebook_signup_login")
async def handle_facebook_signup_login(userid: str, first_name: str):
    return await handle_provider_signup_login(email=None, first_name=first_name, provider="facebook", user_id=userid)

@router.post("/apple_signup_login")
async def handle_apple_signup_login(userid: str):
    return await handle_provider_signup_login(email=None, first_name=None, provider="apple", user_id=userid)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload  # Return decoded user data (email or user_id)
    except JWTError:
        raise HTTPException
"""

#auth.py
from fastapi import APIRouter, HTTPException, status, Request, Depends,Response
from pydantic import BaseModel, EmailStr, validator
from passlib.context import CryptContext
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials, OAuth2PasswordBearer
from asgiref.sync import sync_to_async
from jose import JWTError, jwt
from datetime import datetime, timedelta
from django.core.exceptions import ObjectDoesNotExist
# from fastapi_app.config import SECRET_KEY, ALGORITHM
from fastapi_app.django_setup import django_setup
from django.utils import timezone
from dateutil.relativedelta import relativedelta
from django.db import transaction
from datetime import datetime
from django.contrib.auth.hashers import make_password, check_password
import os, requests
from urllib.parse import urlencode
from dotenv import load_dotenv
from fastapi.logger import logger
import random, string, time
import smtplib, secrets
from email.message import EmailMessage
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List
from datetime import datetime
from fastapi import Query
from urllib.parse import quote


from asgiref.sync import sync_to_async


# Setup
load_dotenv()
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "my_project.settings")
django_setup()

from appln.models import UserData, UserSubscription, APIKeyManager, UserDesignHistory

# Auth0 config
AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN")
AUTH0_CLIENT_ID = os.getenv("AUTH0_CLIENT_ID")
AUTH0_CLIENT_SECRET = os.getenv("AUTH0_CLIENT_SECRET")
AUTH0_CALLBACK_URL = os.getenv("AUTH0_CALLBACK_URL")
FRONTEND_HOME_URL = os.getenv("FRONTEND_HOME_URL")
SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = os.getenv("SMTP_PORT")
SMTP_USER = os.getenv("SMTP_USER")  # Add to .env
SMTP_PASS = os.getenv("SMTP_PASS")  # Add to .env
EMAIL_FROM = os.getenv("EMAIL_FROM")    # Add to .env
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")


router = APIRouter()
auth_scheme = HTTPBearer()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


    
class LoginUser(BaseModel):
    email: EmailStr
    password: str

def hash_password(password: str) -> str:
    return make_password(password)


def verify_password(plain: str, hashed: str) -> bool:
    return check_password(plain, hashed)


@sync_to_async
def user_exists(email: str):
    return UserData.objects.filter(email=email).exists()

def generate_api_key():
    """Generate a random 32-character API key."""
    return ''.join(random.choices(string.ascii_letters + string.digits, k=32))

def create_unique_api_key():
    """Generate a truly unique API key that doesn't exist in the database."""
    while True:
        api_key = generate_api_key()
        if not APIKeyManager.objects.filter(active_keys=api_key).exists():
            return api_key
        

@sync_to_async
def create_subscription_for_user(user: UserData):
    with transaction.atomic():
        subscription, created = UserSubscription.objects.get_or_create(user=user)
        if created:
            subscription.email = user.email or None
            subscription.userid = user.userid or None
            subscription.first_name = user.first_name or None
            subscription.last_name = user.last_name or None
            subscription.current_plan = 'basic'
            subscription.duration = None
            subscription.original_price = 0.00
            subscription.discount_price = 0.00
            subscription.plan_expiring_date = None
            subscription.renews_on = None
            subscription.total_credits = 10
            subscription.used_credits = 0
            subscription.total_credits_used_all_time = 0
            subscription.save()

            unique_api_key = create_unique_api_key()
            APIKeyManager.objects.create(
                user=user,
                plan='basic',
                active_keys=unique_api_key, 
                revoked_keys=[],
                credits_remaining=10,
                monthly_credits=10,
                created_at=timezone.now(),
                updated_at=None,
                is_active=True,
                usage_count=0
            )
        return subscription

class VerifyOTP(BaseModel):
    email: EmailStr
    otp: str

class ResendOTPRequest(BaseModel):
    email: EmailStr

class SignupUser(BaseModel):
    email: EmailStr
    password: str
    confirm_password: str

    @validator("confirm_password")
    def passwords_match(cls, v, values, **kwargs):
        if "password" in values and v != values["password"]:
            raise ValueError("Passwords do not match")
        return v

temp_otp_storage = {}

def send_otp_email(receiver_email: str) -> str:
    otp_str = str(secrets.randbelow(1_000_000)).zfill(6)

    # Store OTP with timestamp (don't overwrite elsewhere!)
    if receiver_email in temp_otp_storage:
        temp_otp_storage[receiver_email].update({
            "otp": otp_str,
            "created_at": time.time()
        })
    else:
        temp_otp_storage[receiver_email] = {
            "otp": otp_str,
            "created_at": time.time()
        }

    msg = EmailMessage()
    msg["Subject"] = "Verify your email"
    msg["From"] = EMAIL_FROM
    msg["To"] = receiver_email
    msg.set_content(f"""
Hi,

Your verification code is: {otp_str}

This code is valid for 10 minutes. Please don't share it with anyone.

Best regards,
Your Team
""")

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASS)
        server.send_message(msg)

    return otp_str  # Return it for logging if needed


# Update the signup endpoint
@router.post("/signup")
async def signup(user_data: SignupUser):
    try:
        if await user_exists(user_data.email):
            raise HTTPException(400, "Email already registered")

        # Hash password
        hashed_pwd = hash_password(user_data.password)

        # Store OTP and hashed password
        otp = send_otp_email(user_data.email)
        temp_otp_storage[user_data.email]["hashed_password"] = hashed_pwd  # Add to the existing dict

        return {"message": "OTP sent to email", "email": user_data.email}

    except Exception as e:
        raise HTTPException(400, detail=str(e))
    
@router.post("/signup-resend-otp")
async def resend_otp(request: ResendOTPRequest):
    try:
        if await user_exists(request.email):
            raise HTTPException(status_code=409, detail="User already registered")

        if request.email not in temp_otp_storage:
            raise HTTPException(status_code=400, detail="No signup attempt found for this email")

        existing = temp_otp_storage[request.email]
        if time.time() - existing["created_at"] < 60:
            raise HTTPException(status_code=429, detail="Wait 60 seconds before requesting OTP again")

        send_otp_email(request.email)

        return {"message": "OTP resent successfully"}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# Add this new endpoint for OTP verification
@router.post("/verify-otp")
async def verify_otp(otp_data: VerifyOTP):
    try:
        email = otp_data.email

        if email not in temp_otp_storage:
            raise HTTPException(status_code=400, detail="No signup attempt found for this email")

        data = temp_otp_storage[email]

        if data["otp"] != otp_data.otp:
            raise HTTPException(status_code=400, detail="Invalid OTP")

        if (time.time() - data["created_at"]) > 600:
            del temp_otp_storage[email]
            raise HTTPException(status_code=400, detail="OTP expired")

        @sync_to_async
        def create_user_and_subscription():
            with transaction.atomic():
                user = UserData.objects.create(
                    email=email,
                    password=data["hashed_password"],
                    provider="email"
                )
                UserSubscription.objects.create(
                    user=user,
                    email=user.email,
                    current_plan='basic',
                    total_credits=10,
                    used_credits=0
                )
                api_key = create_unique_api_key()
                APIKeyManager.objects.create(
                    user=user,
                    plan='basic',
                    active_keys=api_key,
                    monthly_credits=10,
                    usage_count=0,
                    is_active=True
                )
                return user

        user = await create_user_and_subscription()

        # Clean up OTP
        del temp_otp_storage[email]

        # Create token
        token = jwt.encode({"sub": user.email}, SECRET_KEY, algorithm=ALGORITHM)
        response = JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"message": "User created successfully", "access_token": token}
        )
        response.set_cookie(key="access_token", value=token, httponly=True, secure=True)
        return response

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))



@router.post("/login")
async def login(user_data: LoginUser):
    try:
        @sync_to_async
        def verify_user():
            user = UserData.objects.get(email=user_data.email)
            if not verify_password(user_data.password, user.password):
                raise HTTPException(status_code=401, detail="Invalid password")
            return user

        user = await verify_user()

        # Generate JWT token
        token = jwt.encode({"user_id": user.id, "sub": user.email}, SECRET_KEY, algorithm=ALGORITHM)

        response = JSONResponse(
            content={
                "message": "Login successful",
                "access_token": token,
                "userId": user.id,
                "email": user.email
            }
        )
        #Once deployed with HTTPS, set secure=True again
        response.set_cookie(key="access_token", value=token, httponly=True, secure=False)
        return response

    except UserData.DoesNotExist:
        raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/callback")
async def auth_callback(request: Request):
    code = request.query_params.get("code")
    if not code:
        logger.error("Authorization code not found")
        raise HTTPException(status_code=400, detail="Authorization code not found")

    token_url = f"https://{AUTH0_DOMAIN}/oauth/token"
    data = {
        'grant_type': 'authorization_code',
        'client_id': AUTH0_CLIENT_ID,
        'client_secret': AUTH0_CLIENT_SECRET,
        'code': code,
        'redirect_uri': AUTH0_CALLBACK_URL,
    }

    response = requests.post(token_url, data=urlencode(data), headers={'Content-Type': 'application/x-www-form-urlencoded'})
    token_info = response.json()
    access_token = token_info.get('access_token')
    if not access_token:
        logger.error("Token exchange failed")
        raise HTTPException(status_code=400, detail="Token exchange failed")

    user_info_url = f"https://{AUTH0_DOMAIN}/userinfo"
    user_info_response = requests.get(user_info_url, headers={'Authorization': f'Bearer {access_token}'})
    user_info = user_info_response.json()

    sub = user_info.get('sub')
    if not sub:
        logger.error("Auth0 user info missing 'sub'")
        raise HTTPException(status_code=400, detail="Auth0 user info missing 'sub'")

    provider = sub.split('|')[0]
    user_id = sub.split('|')[1] if '|' in sub else sub
    email = user_info.get('email')
    first_name = user_info.get('given_name') or user_info.get('name') or ""
    last_name = user_info.get('family_name') or ""

    logger.info(f"Auth0 callback: provider={provider}, user_id={user_id}, email={email}")

    if provider == "google-oauth2":
        if not email:
            logger.error("Google login failed: email not provided")
            raise HTTPException(status_code=400, detail="Google login failed: email not provided")
        return await handle_provider_signup_login(email=email, first_name=first_name, last_name=last_name, provider="google", user_id=None)
    elif provider == "facebook":
        if not user_id or not first_name:
            logger.error("Facebook login missing required info")
            raise HTTPException(status_code=400, detail="Facebook login missing required info")
        return await handle_provider_signup_login(email=None, first_name=first_name, last_name=last_name, provider="facebook", user_id=user_id)
    elif provider == "apple":
        if not user_id:
            logger.error("Apple login missing user ID")
            raise HTTPException(status_code=400, detail="Apple login missing user ID")
        return await handle_provider_signup_login(email=None, first_name=None, last_name=None, provider="apple", user_id=user_id)
    else:
        logger.error(f"Unsupported provider: {provider}")
        raise HTTPException(status_code=400, detail="Unsupported provider")

async def handle_provider_signup_login(email: str, first_name: str, last_name: str, provider: str, user_id: str = None):
    try:
        logger.info(f"Processing {provider} login: email={email}, user_id={user_id}")
        
        @sync_to_async
        def process_user():
            with transaction.atomic():
                if provider == "google":
                    if not email:
                        raise ValueError("Email required for Google login")
                    user, created = UserData.objects.get_or_create(
                        email=email,
                        defaults={
                            "first_name": first_name or "",
                            "last_name": last_name or "",
                            "password": hash_password(email),
                            "userid": None,
                            "provider": provider,
                        }
                    )
                else:
                    user, created = UserData.objects.get_or_create(
                        userid=user_id,
                        provider=provider,
                        defaults={
                            "first_name": first_name or "",
                            "last_name": last_name or "",
                            "password": hash_password(user_id),
                            "email": None,
                        }
                    )

                if created:
                    UserSubscription.objects.create(
                        user=user,
                        email=user.email or "",
                        userid=user.userid,
                        name=" ".join(filter(None, [user.first_name, user.last_name])).strip(),
                        current_plan='basic',
                        total_credits=10,
                        used_credits=0,
                        total_credits_used_all_time=0
                    )
                    unique_api_key = create_unique_api_key()
                    APIKeyManager.objects.create(
                        user=user,
                        plan='basic',
                        active_keys=unique_api_key,
                        revoked_keys=[],
                        credits_remaining=10,
                        monthly_credits=10,
                        created_at=datetime.utcnow(),
                        updated_at=None,
                        is_active=True,
                        usage_count=0
                    )
                return user, created

        user, created = await process_user()
        token = create_access_token(data={"sub": user.email or user.userid, "user_id": user.id})
        refresh_token = create_refresh_token(data={"sub": user.email or user.userid, "user_id": user.id})
        logger.info(f"User processed: id={user.id}, email={user.email}, token={token}")

        redirect_url = (
            f"{FRONTEND_HOME_URL}"
            f"?authSuccess=true"
            f"&userId={user.id}"
            f"&email={quote(user.email or '')}"
            f"&token={quote(token)}"
            f"&refreshToken={quote(refresh_token)}"
        )
        logger.info(f"Redirecting to: {redirect_url}")
        return RedirectResponse(url=redirect_url, status_code=302)

    except Exception as e:
        logger.error(f"{provider} login error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"{provider} authentication failed")


@router.post("/google_signup_login")
async def google_signup(email: str, first_name: str, last_name: str):
    return await handle_provider_signup_login(email, first_name, last_name, provider="google")


@router.post("/facebook_signup_login")
async def facebook_signup(userid: str, first_name: str, last_name: str):
    return await handle_provider_signup_login(None, first_name, last_name, provider="facebook", user_id=userid)


@router.post("/apple_signup_login")
async def apple_signup(userid: str):
    return await handle_provider_signup_login(None, None, None, provider="apple", user_id=userid)


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")
auth_scheme = HTTPBearer()
ACCESS_TOKEN_EXPIRE_MINUTES = 8640 # 6 days
REFRESH_TOKEN_EXPIRE_DAYS = 7

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_email: str = payload.get("sub")
        if user_email is None:
            raise HTTPException(status_code=401, detail="Invalid token payload")
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Your token expired, Kindly login again")


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user = await sync_to_async(UserData.objects.get)(id=user_id)
        print(f"Authenticated user: {user.id}, email: {user.email}")
        return user
    except (JWTError, UserData.DoesNotExist) as e:
        print(f"Authentication error: {str(e)}")
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
@router.post("/refresh")
async def refresh_token(credentials: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid refresh token")

        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid refresh token payload")

        # Issue new access token
        new_access_token = create_access_token({"user_id": user_id, "sub": payload.get("sub")})
        return {"access_token": new_access_token, "token_type": "bearer"}
    
    except JWTError:
        raise HTTPException(status_code=401, detail="Refresh token expired or invalid")

@router.get("/me")
async def get_me(user=Depends(get_current_user)):
    print(f"Fetching user info for user: {user.id}")
    return {
        "userId": user.id,
        "email": user.email,
    }


class DesignResponse(BaseModel):
    id: int
    uploaded_image: str
    generated_image: str
    created_at: datetime
    is_favorite: bool
    category: str

    # class Config:
    #     orm_mode = True
    model_config = {
        "from_attributes": True
    }

def serialize_design(design: UserDesignHistory):
    return {
        "id": design.id,
        "uploaded_image": f"/media/{design.uploaded_image.name}" if design.uploaded_image else "",
        "generated_image": f"/media/{design.generated_image.name}" if design.generated_image else "",
        "created_at": design.created_at,
        "is_favorite": design.is_favorite,
        "category": design.category
    }


@router.get("/designs", response_model=List[DesignResponse])
async def get_user_designs(
    user=Depends(get_current_user),
    category: str | None = Query(None, enum=["interiors", "exteriors", "outdoors"]),
    is_favorite: bool | None = Query(None)
):
    print(f"Fetching designs for user: {user.id}")
    query = UserDesignHistory.objects.filter(user=user)
    if category:
        query = query.filter(category=category)
    if is_favorite is not None:
        query = query.filter(is_favorite=is_favorite)
    designs_qs = await sync_to_async(list)(query.order_by("-created_at")[:10])
    print(f"Found {len(designs_qs)} designs")
    return [serialize_design(d) for d in designs_qs]

@router.patch("/designs/{design_id}/favorite", response_model=dict)
async def toggle_favorite_design(design_id: int, user=Depends(get_current_user)):
    print(f"PATCH /designs/{design_id}/favorite for user: {user.id}")
    try:
        design = await sync_to_async(UserDesignHistory.objects.get)(id=design_id, user=user)
        design.is_favorite = not design.is_favorite
        await sync_to_async(design.save)()
        print(f"✅ Updated design {design_id} to is_favorite: {design.is_favorite}")
        return {"id": design.id, "is_favorite": design.is_favorite}
    except ObjectDoesNotExist:
        print(f"❌ Design {design_id} not found for user {user.id}")
        raise HTTPException(status_code=404, detail="Design not found")