# fastapi_app/main.py

"""import os
import sys
from fastapi import FastAPI

# Setup Django
sys.path.append(os.path.dirname(os.path.dirname(__file__)))  # add project to path
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'my_project.settings')  # replace with your actual Django project name

import django
django.setup()

# Now import your FastAPI routes AFTER django.setup()

from fastapi_app.auth import router as auth_router

app = FastAPI()

# Include routes
#app.include_router(auth.router)
app.include_router(auth_router, prefix="/auth", tags=["auth"])"""

# fastapi_app/main.py its work correctly in singup and login page 
"""from fastapi import FastAPI
from fastapi_app.auth import router as auth_router

app = FastAPI()

# Include your auth routes
app.include_router(auth_router)"""

#its used for icons
"""from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

from fastapi_app.auth import router as auth_router, image_processing

app = FastAPI()
app.include_router(auth_router)

app.include_router(image_processing.router)#image processing

# Serve static HTML page
@app.get("/")
async def serve_index():
    return FileResponse(os.path.join("fastapi_app", "frontend", "index.html"))"""

#image processing 
"""from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

from fastapi_app.auth import router as auth_router
from fastapi_app import image_processing  # Import separately for clarity

app = FastAPI()

# Auth routes (login/signup)
app.include_router(auth_router)

# Image processing routes (upload/generate)
app.include_router(image_processing.router)

# Serve index.html for frontend
@app.get("/")
async def serve_index():
    return FileResponse(os.path.join("fastapi_app", "frontend", "index.html"))

# 🗂️ Serve uploaded and generated image folders as static files
app.mount("/uploads", StaticFiles(directory="fastapi_app/uploads"), name="uploads")
app.mount("/generated", StaticFiles(directory="fastapi_app/generated"), name="generated")
"""

#auth0
"""import os
import sys
from fastapi import FastAPI, HTTPException, Query
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, RedirectResponse, JSONResponse

# Add this to ensure Django settings are properly configured
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Now import the setup function and set up Django
from fastapi_app.django_setup import django_setup
from appln.models import UserData
from fastapi_app.auth import router as auth_router
from fastapi_app import image_processing, auth
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

django_setup()

# Auth routes (login/signup)
app.include_router(auth_router, prefix="/auth")
app.include_router(auth.router)

# Image processing routes (upload/generate)
app.include_router(image_processing.router)

# Serve index.html for frontend
@app.get("/")
async def serve_index():
    index_path = os.path.join("fastapi_app", "frontend", "index.html")
    print(f"Serving index from: {index_path}")  # Print to check file path
    return FileResponse(index_path)

#use it for login.html 
@app.get("/login")
async def serve_login():
    login_path = os.path.join("fastapi_app", "frontend", "login.html")
    print(f"Serving login page from: {login_path}")  # Check the file path
    return FileResponse(login_path)

@app.get("/profile")
async def serve_profile():
    profile_path = os.path.join("fastapi_app", "frontend", "profile.html")
    return FileResponse(profile_path)



# Mount static files for frontend assets (e.g., CSS, JS, images)
app.mount("/static", StaticFiles(directory="fastapi_app/frontend"), name="static")
#for loading profie_pis
app.mount("/media", StaticFiles(directory="fastapi_app/media"), name="media")

# Mount image folders to serve uploaded and generated images
app.mount("/uploads", StaticFiles(directory="fastapi_app/uploads"), name="uploads")
app.mount("/generated", StaticFiles(directory="fastapi_app/generated"), name="generated")

AUTH0_DOMAIN = "dev-58msavvh172405v3.us.auth0.com"
CLIENT_ID = "fJT5VMzB7Puv4bmVvCFuEBCmRa5HZf5F"
REDIRECT_URI = "http://localhost:8000/callback"

@app.get("/login/google")
def login_google():
    return RedirectResponse(
        url=f"https://{AUTH0_DOMAIN}/authorize"
            f"?client_id={CLIENT_ID}"
            f"&redirect_uri={REDIRECT_URI}"
            f"&response_type=code"
            f"&scope=openid profile email"
            f"&connection=google-oauth2"
    )

@app.get("/login/facebook")
def login_facebook():
    return RedirectResponse(
        url=f"https://{AUTH0_DOMAIN}/authorize"
            f"?client_id={CLIENT_ID}"
            f"&redirect_uri={REDIRECT_URI}"
            f"&response_type=code"
            f"&scope=openid profile email"
            f"&connection=facebook"
    )

@app.get("/login/apple")
def login_apple():
    return RedirectResponse(
        url=f"https://{AUTH0_DOMAIN}/authorize"
            f"?client_id={CLIENT_ID}"
            f"&redirect_uri={REDIRECT_URI}"
            f"&response_type=code"
            f"&scope=openid profile email"
            f"&connection=apple"
    )


@app.get("/get_profile")
async def get_profile(email: str = Query(...)):
    try:
        user = UserData.objects.get(email=email)  # Query for the user by email
    except UserData.DoesNotExist:
        raise HTTPException(status_code=404, detail="User not found")

    # Return the profile data
    return JSONResponse(content={
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "phone_number": user.phone_number,
        "location": user.location,
        "provider": user.provider
    })
"""

#main.py
import os
import sys
from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, RedirectResponse, JSONResponse
from fastapi_app.django_setup import django_setup
from fastapi_app.auth import router as auth_router
from fastapi_app import image_processing, auth, api
from fastapi_app.update_profile import router as profile_router
from asgiref.sync import sync_to_async
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from jose import jwt
from datetime import datetime, timedelta
from fastapi_app.contact import router as contact_router
from fastapi_app import help_center
from fastapi_app.pricing_page import update_subscription, router as pricing_router
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from appln.models import UserData
from asgiref.sync import sync_to_async
from fastapi_app.forget_password import router as forgot_password_router
from fastapi_app.notifications import router as notifications_router
from pathlib import Path

# Setup paths and environment
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fastapi_app'))
django_setup()
load_dotenv()

AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN")
AUTH0_CLIENT_ID = os.getenv("AUTH0_CLIENT_ID")
AUTH0_CLIENT_SECRET = os.getenv("AUTH0_CLIENT_SECRET")
AUTH0_CALLBACK_URL = os.getenv("AUTH0_CALLBACK_URL")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

# FastAPI app init
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://www.stacklycloud.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth_router, prefix="/auth")
app.include_router(auth.router)
app.include_router(image_processing.router, prefix="/api", tags=["Image Generation"])
app.include_router(pricing_router, prefix="/pricing", tags=["pricing"])
app.include_router(profile_router)
app.include_router(contact_router)
app.include_router(help_center.router)
app.include_router(notifications_router)
app.include_router(forgot_password_router)
app.include_router(api.router)

BASE_DIR = Path(__file__).parent.parent  # Goes up one level from fastapi_app/
uploads_path = BASE_DIR / "fastapi_app" / "uploads"
generated_path = BASE_DIR / "fastapi_app" / "generated"
# Absolute paths
GENERATED_PATH = BASE_DIR / "fastapi_app" / "generated"
UPLOADS_PATH = BASE_DIR / "fastapi_app" / "uploads"
MEDIA_PATH = BASE_DIR / "fastapi_app" / "media"
STATIC_PATH = BASE_DIR / "fastapi_app" / "static"
INVOICE_PATH = BASE_DIR / "fastapi_app" / "generated_invoices"
INVOICE_PATH.mkdir(parents=True, exist_ok=True)
uploads_path.mkdir(parents=True, exist_ok=True)
generated_path.mkdir(parents=True, exist_ok=True)
# Ensure folders exist
GENERATED_PATH.mkdir(parents=True, exist_ok=True)
UPLOADS_PATH.mkdir(parents=True, exist_ok=True)
MEDIA_PATH.mkdir(parents=True, exist_ok=True)
STATIC_PATH.mkdir(parents=True, exist_ok=True)

# Mount static files
app.mount("/static", StaticFiles(directory=STATIC_PATH), name="static")
app.mount("/media/generated", StaticFiles(directory=GENERATED_PATH), name="generated")
app.mount("/media/uploads", StaticFiles(directory=UPLOADS_PATH), name="uploads")
app.mount("/static_uploads", StaticFiles(directory=uploads_path), name="static_uploads")
app.mount("/static_generated", StaticFiles(directory=generated_path), name="static_generated")
app.mount("/media", StaticFiles(directory=MEDIA_PATH), name="media") 
app.mount("/generated_invoices", StaticFiles(directory=INVOICE_PATH), name="generated_invoices")

# Routes
@app.get("/")
async def serve_index():
    return FileResponse(os.path.join("fastapi_app", "frontend", "index.html"))

@app.get("/login")
async def serve_login():
    return FileResponse(os.path.join("fastapi_app", "frontend", "login.html"))

@app.get("/profile")
async def serve_profile(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    return FileResponse(os.path.join("fastapi_app", "frontend", "profile.html"))

@app.get("/login/google")
def login_google():
    return RedirectResponse(
        url=f"https://{AUTH0_DOMAIN}/authorize"
            f"?client_id={AUTH0_CLIENT_ID}"
            f"&redirect_uri={AUTH0_CALLBACK_URL}"
            f"&response_type=code"
            f"&scope=openid profile email"
            f"&connection=google-oauth2"
            f"&prompt=login"
    )

@app.get("/login/facebook")
def login_facebook():
    return RedirectResponse(
        url=f"https://{AUTH0_DOMAIN}/authorize"
            f"?client_id={AUTH0_CLIENT_ID}"
            f"&redirect_uri={AUTH0_CALLBACK_URL}"
            f"&response_type=code"
            f"&scope=openid profile email"
            f"&connection=facebook"
            f"&prompt=login"
    )

@app.get("/login/apple")
def login_apple():
    return RedirectResponse(
        url=f"https://{AUTH0_DOMAIN}/authorize"
            f"?client_id={AUTH0_CLIENT_ID}"
            f"&redirect_uri={AUTH0_CALLBACK_URL}"
            f"&response_type=code"
            f"&scope=openid profile email"
            f"&connection=apple"
            f"&prompt=login"
    )

@sync_to_async
def get_user_by_email(email: str):
    try:
        return UserData.objects.get(email=email)
    except ObjectDoesNotExist:
        return None

@sync_to_async
def get_user_by_userid(userid: str):
    try:
        return UserData.objects.get(userid=userid)
    except ObjectDoesNotExist:
        return None

@app.get("/get_profile")
async def get_profile(email: str = Query(...)):
    user = await get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    profile_pic_url = f"{settings.MEDIA_URL}{user.profile_pic.name}" if user.profile_pic else None
    return JSONResponse(content={
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "phone_number": user.phone_number,
        "location": user.location,
        "provider": user.provider,
        "profile_pic": profile_pic_url,
    })

@app.get("/get_profile_by_userid")
async def get_profile_by_userid(userid: str = Query(...)):
    user = await get_user_by_userid(userid)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    profile_pic_url = f"{settings.MEDIA_URL}{user.profile_pic.name}" if user.profile_pic else None
    return JSONResponse(content={
        "first_name": user.first_name,
        "last_name": user.last_name,
        "userid": user.userid,
        "email": user.email,
        "phone_number": user.phone_number,
        "location": user.location,
        "provider": user.provider,
        "profile_pic": profile_pic_url,
    })

@app.get("/")
async def root():
    return {"message": "Welcome to the Image Generation API!"}
