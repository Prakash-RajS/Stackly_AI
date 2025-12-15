# Update_profile.py
from fastapi import APIRouter, Form, Query, UploadFile, File, HTTPException, Depends, FastAPI
from fastapi.responses import FileResponse, StreamingResponse, JSONResponse
from appln.models import UserData, UserSubscription, UserDesignHistory, BillingHistory
from asgiref.sync import sync_to_async
from django.contrib.auth.hashers import make_password, check_password
from typing import Optional, List
import io, os, traceback
import traceback
from pydantic import BaseModel
from fastapi_app.auth import get_current_user
from asgiref.sync import sync_to_async
from django.core.exceptions import ObjectDoesNotExist
from django.conf import settings
from PIL import Image
from fastapi.staticfiles import StaticFiles
from fastapi_app.storage import (
    save_file,
    remove_file,
    get_profile_pic_path,
    get_file_url,
    read_file_bytes,
    USE_S3
)
import os
import uuid

router = APIRouter()
app = FastAPI()

invoices_path = os.path.join("fastapi_app", "generated_invoices")
app.mount("/generated_invoices", StaticFiles(directory=invoices_path), name="invoices")

class BillingHistoryItem(BaseModel):
    date: str
    amount: str
    payment_method: str
    status: str
    invoice_url: Optional[str]

class BillingHistoryResponse(BaseModel):
    billing_history: List[BillingHistoryItem]

@sync_to_async
def get_user_by_email_db(email: str):
    try:
        return UserData.objects.get(email=email)
    except ObjectDoesNotExist:
        return None
    except Exception as e:
        print(f"Error in get_user_by_email_db: {e}")
        raise

@sync_to_async
def get_user_by_internal_id_db(user_id_int: int):
    try:
        return UserData.objects.get(id=user_id_int)
    except ObjectDoesNotExist:
        return None
    except Exception as e:
        print(f"Error in get_user_by_internal_id_db: {e}")
        raise

@sync_to_async
def get_user_by_external_userid_db(external_userid_str: str):
    try:
        return UserData.objects.get(userid=external_userid_str)
    except ObjectDoesNotExist:
        return None
    except Exception as e:
        print(f"Error in get_user_by_external_userid_db: {e}")
        raise

@router.get("/profile", tags=["Profile"])
async def get_profile(
    email: Optional[str] = Query(None, description="User's email address"),
    user_id_pk: Optional[int] = Query(
        None,
        alias="userid",
        description="User's internal integer primary key ID (e.g., 71)"
    ),
):
    if not email and user_id_pk is None:
        raise HTTPException(
            status_code=400,
            detail="Either email or userid (integer ID) must be provided"
        )

    try:
        user = None
        if email:
            user = await get_user_by_email_db(email)
        elif user_id_pk is not None:
            user = await get_user_by_internal_id_db(user_id_pk)
        
        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found with the provided credentials"
            )

        # FIXED: Generate proper S3 URL for profile picture
        profile_pic_url = None
        if user.profile_pic and hasattr(user.profile_pic, 'name') and user.profile_pic.name:
            if USE_S3:
                # For S3, use the storage function to get the proper URL
                profile_pic_url = get_file_url(user.profile_pic.name)
            else:
                # For local storage, use the relative path
                profile_pic_url = f"/media/{user.profile_pic.name}"

        returned_user_id = None
        if hasattr(user, 'userid') and user.userid:
            returned_user_id = user.userid
        elif hasattr(user, 'id'):
            returned_user_id = user.id

        return {
            "userid": returned_user_id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "phone_number": user.phone_number,
            "location": user.location,
            "provider": user.provider,
            "profile_pic": profile_pic_url,  # This will be the S3 URL
            "profile_pic_url": profile_pic_url  # Add this for frontend compatibility
        }

    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred while fetching profile: {str(e)}"
        )

@router.get("/subscription", tags=["Subscription"])
async def get_user_subscription(
    user_id_pk: Optional[int] = Query(
        None,
        alias="userid",
        description="User's internal integer ID"
    )
):
    if user_id_pk is None:
        raise HTTPException(status_code=400, detail="userid must be provided")

    try:
        user = await sync_to_async(UserData.objects.filter(id=user_id_pk).first)()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        subscription = await sync_to_async(UserSubscription.objects.filter(user=user).first)()
        if not subscription:
            raise HTTPException(status_code=404, detail="Subscription not found for this user")

        return {
            "current_plan": subscription.current_plan,
            "duration": subscription.duration,
            "original_price": float(subscription.original_price),
            "discount_price": float(subscription.discount_price) if subscription.discount_price else None,
            "total_credits": subscription.total_credits,
            "used_credits": subscription.used_credits,
            "balance_credits": subscription.balance_credits,
            "renews_on": subscription.renews_on,
            "plan_expiring_date": subscription.plan_expiring_date,
            "total_members": subscription.total_members,
            "start_date": subscription.start_date,
            "user": {
                "name": subscription.name,
                "email": subscription.email,
                "userid": subscription.userid
            }
        }

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

# Update_profile.py - Fix the billing history endpoint
@router.get("/billing/history", response_model=BillingHistoryResponse, tags=["Billing"])
async def get_user_billing_history(
    user_id_pk: Optional[int] = Query(
        None,
        alias="userid",
        description="User's internal integer ID"
    ),
    current_user: UserData = Depends(get_current_user)
):
    try:
        target_user = current_user
        if user_id_pk is not None:
            target_user = await sync_to_async(UserData.objects.filter(id=user_id_pk).first)()
            if not target_user:
                raise HTTPException(status_code=404, detail="User not found")
        
        all_history = await sync_to_async(
            lambda: list(BillingHistory.objects.filter(user=target_user).order_by('-paid_on'))
        )()

        last_five = all_history[:5]

        data = []
        for entry in last_five:
            invoice_url = None
            
            # If invoice is stored as a full URL already
            if entry.invoice and hasattr(entry.invoice, 'url'):
                invoice_url = entry.invoice.url
            elif entry.invoice:
                # Try to extract from string representation
                invoice_str = str(entry.invoice)
                if invoice_str.startswith('http'):
                    invoice_url = invoice_str
                elif 'generated_invoices' in invoice_str:
                    # It's a path, convert to S3 URL
                    s3_key = f"generated_invoices/{os.path.basename(invoice_str)}"
                    invoice_url = get_file_url(s3_key)

            data.append(
                BillingHistoryItem(
                    date=entry.paid_on.strftime('%Y-%m-%d') if entry.paid_on else "",
                    amount=str(entry.amount) if entry.amount else "0.00",
                    payment_method=entry.payment_method or "Unknown",
                    status=entry.status.capitalize() if entry.status else "Unknown",
                    invoice_url=invoice_url
                )
            )

        return {"billing_history": data}

    except Exception as e:
        print(f"Billing history error: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to fetch billing history: {str(e)}")

@router.post("/update_profile")
async def update_profile(
    current_user: UserData = Depends(get_current_user),
    first_name: Optional[str] = Form(None),
    last_name: Optional[str] = Form(None),
    new_email: Optional[str] = Form(None),
    phone_number: Optional[str] = Form(None),
    profile_pic: Optional[UploadFile] = File(None)
):
    try:
        # 1. Update basic fields
        if first_name is not None:
            current_user.first_name = first_name
        if last_name is not None:
            current_user.last_name = last_name
        if phone_number is not None:
            current_user.phone_number = phone_number

        # 2. Email update with duplicate check
        if new_email is not None and new_email != current_user.email:
            exists = await sync_to_async(
                UserData.objects.filter(email=new_email).exclude(id=current_user.id).exists
            )()
            if exists:
                raise HTTPException(status_code=400, detail="Email already in use")
            current_user.email = new_email

        # 3. Profile picture upload to S3
        profile_pic_url = None
        if profile_pic:
            # Validate file type
            ext = profile_pic.filename.split(".")[-1].lower()
            if ext not in ["jpg", "jpeg", "png", "gif", "webp"]:
                raise HTTPException(status_code=400, detail="Invalid image format")

            # Generate unique filename
            filename = f"user_{current_user.id}_profile_{uuid.uuid4().hex[:8]}.{ext}"
            s3_key = get_profile_pic_path(filename)  # → "profile_pics/user_123_profile_abc123.png"

            # Delete old picture if exists
            if current_user.profile_pic:
                try:
                    old_key = str(current_user.profile_pic.name)
                    await remove_file(old_key)
                except Exception as e:
                    print(f"Warning: Could not delete old profile picture: {e}")

            # Save new picture to S3
            await save_file(profile_pic, s3_key)

            # Update Django FileField
            current_user.profile_pic.name = s3_key

            # Generate the URL for response
            profile_pic_url = get_file_url(s3_key)

        # 4. Save user
        await sync_to_async(current_user.save)()

        # 5. Update subscription name if needed
        try:
            subscription = await sync_to_async(UserSubscription.objects.get)(user=current_user)
            full_name = f"{current_user.first_name or ''} {current_user.last_name or ''}".strip()
            if subscription.name != full_name:
                subscription.name = full_name or "User"
                await sync_to_async(subscription.save)()
        except UserSubscription.DoesNotExist:
            pass

        # 6. Return success with proper URLs
        response_data = {
            "message": "Profile updated successfully",
            "profile_pic_url": profile_pic_url or (
                get_file_url(current_user.profile_pic.name) if current_user.profile_pic else None
            )
        }

        return response_data

    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Profile update failed")

class ChangePasswordRequest(BaseModel):
    new_password: str
    confirm_password: str

@router.post("/change_password")
async def change_password(
    request: ChangePasswordRequest,
    current_user: UserData = Depends(get_current_user)
):
    try:
        if not request.new_password or not request.confirm_password:
            raise HTTPException(status_code=400, detail="Both password fields are required")
        
        if request.new_password != request.confirm_password:
            raise HTTPException(status_code=400, detail="Passwords do not match")
        
        if len(request.new_password) < 6:
            raise HTTPException(status_code=400, detail="Password must be at least 6 characters long")

        current_user.password = make_password(request.new_password)
        await sync_to_async(current_user.save)()

        return {"message": "Password changed successfully"}

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# Add this endpoint to serve profile pictures if needed
@router.get("/media/profile_pics/{filename}")
async def get_profile_picture(filename: str):
    """
    Serve profile pictures - useful for local development
    In production, S3 URLs are used directly
    """
    try:
        if USE_S3:
            # Redirect to S3 URL
            s3_key = get_profile_pic_path(filename)
            s3_url = get_file_url(s3_key)
            from fastapi.responses import RedirectResponse
            return RedirectResponse(url=s3_url)
        else:
            # Serve locally
            local_path = get_profile_pic_path(filename)
            if os.path.exists(local_path):
                return FileResponse(local_path)
            else:
                raise HTTPException(status_code=404, detail="Profile picture not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/download", tags=["Download"])
async def download_image(
    image_id: int,
    image_type: str = Query(..., regex="^(uploaded|generated)$", description="Type of image: uploaded or generated"),
    quality: str = Query(..., regex="^(low|good)$", description="Quality: low or good"),
    current_user: UserData = Depends(get_current_user)
):
    try:
        design = await sync_to_async(UserDesignHistory.objects.filter(id=image_id, user=current_user).first)()
        if not design:
            raise HTTPException(status_code=404, detail="Image not found for current user")

        if image_type == "uploaded":
            image_field = design.uploaded_image
        else:
            image_field = design.generated_image

        image_path = os.path.join("fastapi_app", image_field.name)

        if not os.path.exists(image_path):
            raise HTTPException(status_code=404, detail="Image file does not exist")

        if quality == "good":
            return FileResponse(image_path, media_type="image/jpeg", filename=os.path.basename(image_path))

        try:
            image = Image.open(image_path)
            buf = io.BytesIO()
            image.convert("RGB").save(buf, format="JPEG", quality=30)
            buf.seek(0)

            return StreamingResponse(
                buf,
                media_type="image/jpeg",
                headers={"Content-Disposition": f"attachment; filename=low_{os.path.basename(image_path)}"}
            )
        except Exception as e:
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=f"Failed to compress image: {str(e)}")

    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
