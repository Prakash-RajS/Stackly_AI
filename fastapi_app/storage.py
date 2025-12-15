# fastapi_app/storage.py
import os
from pathlib import Path
import boto3
from fastapi import UploadFile
from dotenv import load_dotenv

load_dotenv()  # Load .env automatically

# ------------------------------
# CONFIG
# ------------------------------
USE_S3 = True  # Set False for local storage

# S3 configuration
S3_BUCKET = os.getenv("S3_BUCKET", "stackly-ai-bucket")
S3_REGION = os.getenv("S3_REGION", "ap-south-1")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")

if USE_S3:
    if not AWS_ACCESS_KEY_ID or not AWS_SECRET_ACCESS_KEY:
        raise RuntimeError("AWS credentials not set in .env")

    S3_CLIENT = boto3.client(
        "s3",
        region_name=S3_REGION,
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY
    )
else:
    # Avoid ImportError in other files
    S3_CLIENT = None

# ------------------------------
# Local paths (fallback)
# ------------------------------
BASE_DIR = Path(__file__).parent
LOCAL_UPLOADS = BASE_DIR / "uploads"
LOCAL_GENERATED = BASE_DIR / "generated"
LOCAL_GENERATED_INVOICES = BASE_DIR / "generated_invoices"
LOCAL_PROFILE_PICS = BASE_DIR / "media" / "profile_pics"

for path in [LOCAL_UPLOADS, LOCAL_GENERATED, LOCAL_GENERATED_INVOICES, LOCAL_PROFILE_PICS]:
    path.mkdir(parents=True, exist_ok=True)

# ------------------------------
# PATH HELPERS
# ------------------------------
def get_upload_path(filename: str):
    """Get path for uploaded files"""
    if USE_S3:
        return f"uploads/{filename}"
    else:
        return LOCAL_UPLOADS / filename

def get_generated_path(filename: str):
    """Get path for generated files"""
    if USE_S3:
        return f"generated/{filename}"
    else:
        return LOCAL_GENERATED / filename

def get_generated_invoices_path(filename: str):
    """Get path for invoice files"""
    if USE_S3:
        return f"generated_invoices/{filename}"
    else:
        return LOCAL_GENERATED_INVOICES / filename

def get_profile_pic_path(filename: str):
    """Get path for profile pictures"""
    if USE_S3:
        return f"profile_pics/{filename}"
    else:
        return LOCAL_PROFILE_PICS / filename

# ------------------------------
# FILE OPERATIONS
# ------------------------------
async def save_file(file: UploadFile, s3_key: str):
    """Save file to S3 or local storage"""
    if USE_S3:
        # Reset file pointer to beginning
        await file.seek(0)
        S3_CLIENT.upload_fileobj(file.file, S3_BUCKET, s3_key)
    else:
        local_path = Path(s3_key)
        with open(local_path, "wb") as f:
            content = await file.read()
            f.write(content)

async def save_bytes_file(content: bytes, s3_key: str):
    """Save bytes content to S3 or local storage"""
    if USE_S3:
        S3_CLIENT.put_object(Bucket=S3_BUCKET, Key=s3_key, Body=content)
    else:
        local_path = Path(s3_key)
        with open(local_path, "wb") as f:
            f.write(content)

async def remove_file(s3_key: str):
    """Remove file from S3 or local storage"""
    if USE_S3:
        try:
            S3_CLIENT.delete_object(Bucket=S3_BUCKET, Key=s3_key)
        except Exception as e:
            print(f"Error deleting file from S3: {e}")
    else:
        local_path = Path(s3_key)
        if local_path.exists():
            local_path.unlink()

def get_file_url(s3_key: str):
    """Get public URL for file"""
    if USE_S3:
        return f"https://{S3_BUCKET}.s3.{S3_REGION}.amazonaws.com/{s3_key}"
    else:
        return f"/static/{s3_key}"

def read_file_bytes(s3_key: str) -> bytes:
    """Read file bytes from S3 or local storage"""
    if USE_S3:
        try:
            response = S3_CLIENT.get_object(Bucket=S3_BUCKET, Key=s3_key)
            return response['Body'].read()
        except Exception as e:
            raise Exception(f"Error reading file from S3: {e}")
    else:
        local_path = Path(s3_key)
        with open(local_path, "rb") as f:
            return f.read()