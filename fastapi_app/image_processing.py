import os
import shutil
import requests
import base64
import random
import time, math
import asyncio
import uuid
from fastapi import FastAPI, APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from io import BytesIO
from PIL import Image, UnidentifiedImageError
import io
import hashlib
import aiohttp
from typing import List, Optional
from pydantic import BaseModel
from enum import Enum
from concurrent.futures import ThreadPoolExecutor
import math
from pathlib import Path
import logging
from typing import Literal
from PIL import UnidentifiedImageError, Image, ImageDraw, ImageFont
from asgiref.sync import sync_to_async
from django.db import transaction
load_dotenv()

app = FastAPI()
BASE_DIR = Path(__file__).parent.parent  # Goes up one level from fastapi_app/

# Import storage functions
from fastapi_app.storage import (
    get_upload_path, get_generated_path, save_file, save_bytes_file,
    remove_file, get_file_url, read_file_bytes, USE_S3, S3_CLIENT, S3_BUCKET
)

# Define paths for local storage (fallback)
uploads_path = BASE_DIR / "fastapi_app" / "uploads"
generated_path = BASE_DIR / "fastapi_app" / "generated"

# Create folders if they don't exist (for local storage fallback)
uploads_path.mkdir(parents=True, exist_ok=True)
generated_path.mkdir(parents=True, exist_ok=True)

# Mount static files only if not using S3
if not USE_S3:
    app.mount("/static_uploads", StaticFiles(directory=uploads_path), name="static_uploads")
    app.mount("/static_generated", StaticFiles(directory=generated_path), name="static_generated")

router = APIRouter()
app.include_router(router)

STABILITY_API_KEY = os.getenv("STABILITY_API_KEY")
if not STABILITY_API_KEY:
    raise RuntimeError("STABILITY_API_KEY environment variable not set")

STABILITY_API_URL = "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/image-to-image"

HEADERS = {
    "Accept": "application/json",
    "Authorization": f"Bearer {STABILITY_API_KEY}",
}

class RoomType(str, Enum):
    LIVING_ROOM = "living room"
    BEDROOM = "bedroom"
    KITCHEN = "kitchen"
    HOME_OFFICE = "home office"
    DINING_ROOM = "dining room"
    STUDY_ROOM = "study room"
    FAMILY_ROOM = "family room"
    KID_ROOM = "kid room"
    BALCONY = "balcony"

class DesignStyle(str, Enum):
    CLASSIC = "classic"
    MODERN = "modern"
    MINIMAL = "minimal"
    SCANDINAVIAN = "scandinavian"
    CONTEMPORARY = "contemporary"
    INDUSTRIAL = "industrial"
    JAPANDI = "japandi"
    BOHEMIAN = "bohemian"
    COASTAL = "coastal"
    MODERN_LUXURY = "modern luxury"
    TROPICAL_RESORT = "tropical resort"
    JAPANESE_ZEN = "japanese zen"

class AIStylingStrength(str, Enum):
    VERY_LOW = "very low"
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

# Style configurations for interior
STYLE_CONFIGS = {
    "classic": {
        "prompt": "Elegant {room_type} with traditional furniture, ornate details, rich fabrics, warm lighting, {style} aesthetic. High-quality materials, symmetrical composition, timeless elegance, sophisticated ambiance, professional interior photography",
        "negative_prompt": "modern, minimalist, industrial, futuristic, cheap materials, poor lighting, asymmetrical"
    },
    "modern": {
        "prompt": "Sleek {room_type} with clean architectural lines, contemporary furniture, neutral color palette, statement lighting, {style} aesthetic. High contrast, polished surfaces, designer pieces, 8K ultra HD, magazine-worthy interior",
        "negative_prompt": "traditional, ornate, rustic, vintage, cluttered, outdated decor"
    },
    "minimal": {
        "prompt": "Serene {room_type} with essential furniture only, monochromatic palette, negative space emphasized, {style} aesthetic. Airy atmosphere, perfect proportions, high-end finishes, architectural digest quality, natural light",
        "negative_prompt": "cluttered, ornate, traditional, heavy furniture, dark colors, busy patterns"
    },
    "scandinavian": {
        "prompt": "Light-filled {room_type} with pale wood tones, functional furniture, cozy textiles, {style} hygge aesthetic. Soft natural light, muted colors, organic shapes, minimalist yet warm, professional staging",
        "negative_prompt": "ornate, dark colors, heavy furniture, cluttered, industrial"
    },
    "contemporary": {
        "prompt": "Current {room_type} blending modern and traditional elements, curated furniture selection, {style} aesthetic. Mixed textures, balanced composition, designer lighting, high-resolution professional render",
        "negative_prompt": "dated, mass-produced furniture, poor lighting, mismatched styles"
    },
    "industrial": {
        "prompt": "Urban-chic {room_type} with exposed structural elements, metal accents, raw materials, {style} aesthetic. Open concept, loft-style lighting, high ceilings, professional architectural photography",
        "negative_prompt": "traditional, floral, rustic, country, delicate, ornate"
    },
    "japandi": {
        "prompt": "Harmonious {room_type} blending Japanese minimalism and Scandinavian functionality, {style} aesthetic. Natural materials, muted palette, handcrafted elements, zen atmosphere, premium interior design",
        "negative_prompt": "cluttered, ornate, bright colors, western traditional, mass-produced"
    },
    "bohemian": {
        "prompt": "Eclectic {room_type} with layered textiles, global influences, plants, {style} aesthetic. Warm lighting, curated collections, artistic vibe, professionally styled boho-chic interior",
        "negative_prompt": "minimalist, sterile, modern, monochromatic, cold"
    },
    "coastal": {
        "prompt": "Breezy {room_type} with washed wood finishes, nautical accents, soft blue tones, {style} aesthetic. Sun-drenched, airy curtains, beach-inspired decor, luxury vacation home quality",
        "negative_prompt": "dark, heavy furniture, urban, industrial, closed-in"
    },
    "modern luxury": {
        "prompt": "Opulent {room_type} with designer furniture, premium materials, custom lighting, {style} aesthetic. High-end finishes, spacious layout, architectural details, 8K professional interior photography",
        "negative_prompt": "cheap materials, cluttered, outdated, poor lighting, small spaces"
    },
    "tropical resort": {
        "prompt": "Lush {room_type} with natural materials, indoor plants, resort-style luxury, {style} aesthetic. Canopy elements, open-air feeling, vacation ambiance, professional hospitality photography",
        "negative_prompt": "urban, industrial, minimalist, cold, sterile"
    },
    "japanese zen": {
        "prompt": "Tranquil {room_type} with clean lines, natural materials, minimalist decor, {style} aesthetic. Tatami elements, shoji screens, balanced composition, meditative quality, professional interior design",
        "negative_prompt": "western, cluttered, bright colors, ornate, heavy furniture"
    }
}

# Optimized strength configuration
STRENGTH_CONFIG = {
    "very low": {"image_strength": 0.4, "steps": 20, "cfg_scale": 6},
    "low": {"image_strength": 0.3, "steps": 25, "cfg_scale": 7},
    "medium": {"image_strength": 0.2, "steps": 30, "cfg_scale": 8},
    "high": {"image_strength": 0.1, "steps": 35, "cfg_scale": 9}
}

ALLOWED_DIMENSIONS = [
    (1024, 1024), (1152, 896), (1216, 832), (1344, 768),
    (1536, 640), (640, 1536), (768, 1344), (832, 1216), (896, 1152)
]

executor = ThreadPoolExecutor(max_workers=8)

def add_watermark_to_image(image_bytes: bytes, watermark_text="Stackly.AI") -> bytes:
    """Add watermarks to image bytes and return watermarked bytes"""
    try:
        with Image.open(io.BytesIO(image_bytes)).convert("RGBA") as base:
            width, height = base.size

            # Create transparent watermark layer
            watermark = Image.new("RGBA", base.size, (255, 255, 255, 0))
            draw = ImageDraw.Draw(watermark)

            # Shared font setup
            font_size = max(15, width // 40)
            try:
                font = ImageFont.truetype("arial.ttf", font_size)
            except IOError:
                font = ImageFont.load_default()

            # --- Bottom-right watermark ---
            bbox = draw.textbbox((0, 0), watermark_text, font=font)
            textwidth = bbox[2] - bbox[0]
            textheight = bbox[3] - bbox[1]
            x1 = width - textwidth - 10
            y1 = height - textheight - 20

            draw.text((x1 + 1, y1 + 1), watermark_text, fill=(0, 0, 0, 120), font=font)  # Shadow
            draw.text((x1, y1), watermark_text, fill=(255, 255, 255, 200), font=font)    # Main

            # --- Center repeated watermark ---
            space_width = draw.textlength(" ", font=font)
            word_width = draw.textlength(watermark_text, font=font)
            total_word_width = word_width + space_width

            repeat_count = math.ceil(width / total_word_width) + 2
            repeated_text = (watermark_text + " ") * repeat_count

            center_y = (height - textheight) // 2

            draw.text((2, center_y + 2), repeated_text, fill=(0, 0, 0, 120), font=font)   # Shadow
            draw.text((0, center_y), repeated_text, fill=(255, 255, 255, 160), font=font)  # Main

            # Merge layers and return bytes
            final = Image.alpha_composite(base, watermark)
            output_bytes = io.BytesIO()
            final.convert("RGB").save(output_bytes, format="PNG", quality=95)
            return output_bytes.getvalue()
            
    except Exception as e:
        logging.error(f"Watermarking failed: {str(e)}")
        return image_bytes  # Return original if watermarking fails

async def resize_to_allowed_dimensions(image_bytes: bytes):
    """Resize image to allowed dimensions for Stability AI"""
    try:
        img = Image.open(io.BytesIO(image_bytes))
        img = img.convert("RGB")

        original_width, original_height = img.size
        original_aspect = original_width / original_height

        closest_dim = min(
            ALLOWED_DIMENSIONS,
            key=lambda dim: abs((dim[0] / dim[1]) - original_aspect)
        )

        resized_img = img.resize(closest_dim, Image.LANCZOS)

        output = io.BytesIO()
        resized_img.save(output, format="PNG", optimize=True, quality=90)

        return output.getvalue(), closest_dim

    except UnidentifiedImageError:
        raise HTTPException(400, detail="Invalid or unsupported image format.")
    except Exception as e:
        raise HTTPException(500, detail=f"Internal error: {str(e)}")

async def generate_design_variation(
    image_bytes: bytes,
    design_config: dict,
    strength_level: str
):
    """Optimized design generation with timeout"""
    async def _generate():
        try:
            params = STRENGTH_CONFIG[strength_level]
            style_config = STYLE_CONFIGS[design_config["style"]]
            
            prompt = style_config["prompt"].format(
                room_type=design_config["room_type"],
                style=design_config["style"]
            )
            
            modifiers = ["professional design", "high quality", "detailed"]
            prompt += ", " + random.choice(modifiers)
            
            files = {
                "init_image": ("input.png", BytesIO(image_bytes), "image/png"),
            }
            
            data = {
                "init_image_mode": "IMAGE_STRENGTH",
                "image_strength": str(params["image_strength"]),
                "text_prompts[0][text]": prompt,
                "text_prompts[0][weight]": "1.2",
                "text_prompts[1][text]": style_config["negative_prompt"],
                "text_prompts[1][weight]": "-1.0",
                "cfg_scale": str(params["cfg_scale"]),
                "samples": "1",
                "steps": str(params["steps"]),
                "seed": str(random.randint(0, 100000)),
                "style_preset": "photographic"
            }

            try:
                response = await asyncio.wait_for(
                    asyncio.get_event_loop().run_in_executor(
                        None,
                        lambda: requests.post(
                            STABILITY_API_URL,
                            headers=HEADERS,
                            files=files,
                            data=data,
                            timeout=45
                        )
                    ),
                    timeout=60
                )
            except asyncio.TimeoutError:
                raise HTTPException(504, "API request timed out")

            if response.status_code != 200:
                raise HTTPException(502, f"API Error: {response.status_code}")

            result = response.json()
            return result["artifacts"][0]
            
        except Exception as e:
            raise HTTPException(500, f"Generation error: {str(e)}")

    return await _generate()

@router.post("/generate-interior-design/")
async def generate_interior_design(
    user_id: str = Form(...),
    image: UploadFile = File(...),
    room_type: str = Form(...),
    design_style: str = Form(...),
    ai_strength: str = Form("medium"),
    num_designs: int = Form(1, ge=1, le=6)
):
    from django.utils import timezone
    from datetime import date
    from appln.models import UserData, UserSubscription, UserDesignHistory, CreditUsage

    try:
        # Step 1: User & Subscription
        try:
            user = await sync_to_async(UserData.objects.get)(id=user_id)
            subscription = await sync_to_async(
                UserSubscription.objects.filter(user=user).first
            )()

            if not subscription:
                raise HTTPException(status_code=404, detail="Subscription not found")

        except UserData.DoesNotExist:
            raise HTTPException(status_code=404, detail="User not found")

        # Step 2: Credit Check
        remaining_credits = subscription.total_credits - subscription.used_credits
        if remaining_credits < num_designs:
            raise HTTPException(
                status_code=402,
                detail={
                    "message": "Not enough credits",
                    "available": remaining_credits,
                    "required": num_designs
                }
            )

        # Step 3: Process and Save Original Image
        try:
            file_ext = os.path.splitext(image.filename)[1].lower()
            if file_ext not in ['.jpg', '.jpeg', '.png']:
                raise HTTPException(status_code=400, detail="Only JPG, JPEG, and PNG files are allowed")

            original_filename = f"original_{uuid.uuid4().hex}{file_ext}"
            original_s3_key = get_upload_path(original_filename)

            # Read and process image
            image_content = await image.read()
            processed_image_bytes, _ = await resize_to_allowed_dimensions(image_content)
            
            # Save processed image to S3
            await save_bytes_file(processed_image_bytes, original_s3_key)

        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Image processing failed: {str(e)}")

        # Step 4: Generate Designs
        try:
            design_config = {
                "style": design_style.lower(),
                "room_type": room_type.lower(),
            }

            tasks = [
                generate_design_variation(processed_image_bytes, design_config, ai_strength.lower())
                for _ in range(num_designs)
            ]

            results = await asyncio.gather(*tasks)

        except Exception as e:
            await remove_file(original_s3_key)
            raise HTTPException(status_code=500, detail=f"Design generation failed: {str(e)}")

        # Step 5: Save Generated Images
        generated_filenames = []

        try:
            for result in results:
                filename = f"generated_{uuid.uuid4().hex}.png"
                file_s3_key = get_generated_path(filename)

                # Apply watermark if basic plan
                generated_image_bytes = base64.b64decode(result["base64"])
                if subscription.current_plan == "basic":
                    generated_image_bytes = add_watermark_to_image(generated_image_bytes)

                await save_bytes_file(generated_image_bytes, file_s3_key)
                generated_filenames.append(filename)

        except Exception as e:
            for f in generated_filenames:
                await remove_file(get_generated_path(f))
            await remove_file(original_s3_key)
            raise HTTPException(status_code=500, detail=f"Image saving failed: {str(e)}")

        # Step 6: DB Update & Delete Old Entries
        try:
            @sync_to_async
            def save_db_changes():
                with transaction.atomic():
                    existing_entries = UserDesignHistory.objects.filter(
                        user=user
                    ).order_by("created_at")

                    excess = existing_entries.count() + len(generated_filenames) - 10

                    if excess > 0:
                        for old in existing_entries[:excess]:
                            try:
                                old_upload_key = get_upload_path(os.path.basename(old.uploaded_image.name))
                                old_generated_key = get_generated_path(os.path.basename(old.generated_image.name))
                                remove_file(old_upload_key)
                                remove_file(old_generated_key)
                            except Exception:
                                pass  # Continue even if file deletion fails
                            old.delete()

                    # Save new entries
                    for filename in generated_filenames:
                        UserDesignHistory.objects.create(
                            user=user,
                            uploaded_image=f"uploads/{original_filename}",
                            generated_image=f"generated/{filename}",
                            category="interiors"
                        )

                    subscription.used_credits += num_designs
                    subscription.total_credits_used_all_time += num_designs
                    subscription.save()

                    today = date.today()
                    entry, created = CreditUsage.objects.get_or_create(
                        user=user,
                        date=today,
                        defaults={"credits_used": num_designs}
                    )

                    if not created:
                        entry.credits_used += num_designs
                        entry.save()

            await save_db_changes()

        except Exception as e:
            for f in generated_filenames:
                await remove_file(get_generated_path(f))
            await remove_file(original_s3_key)
            raise HTTPException(status_code=500, detail=f"Database update failed: {str(e)}")

        # Step 7: Return URLs
        original_url = get_file_url(original_s3_key)
        designs_urls = [
            get_file_url(get_generated_path(f)) for f in generated_filenames
        ]

        return {
            "success": True,
            "original_image": original_url,
            "designs": designs_urls,
            "credits": {
                "remaining": subscription.total_credits - subscription.used_credits,
                "used": subscription.used_credits,
                "total": subscription.total_credits
            },
            "message": "Designs generated successfully"
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error: {str(e)}"
        )

# EXTERIOR DESIGN ENDPOINTS
class HouseAngle(str, Enum):
    FRONT = "front side"
    BACK = "back side"
    LEFT = "left side"
    RIGHT = "right side"

class ExteriorDesignStyle(str, Enum):
    CLASSIC = "classic"
    MODERN = "modern"
    BOHEMIAN = "bohemian"
    COASTAL = "coastal"
    INTERNATIONAL = "international"
    ELEPHANT = "elephant"
    STONE_CLAD = "stone clad"
    GLASS_HOUSE = "glass house"
    RED_BRICK = "red brick"
    PAINTED_BRICK = "painted brick"
    WOOD_ACCENTS = "wood accents"
    INDUSTRIAL = "industrial"

EXTERIOR_STYLE_CONFIGS = {
    "classic": {
        "prompt": "Classic {angle} view of house with symmetrical design, columns, traditional details, professional architectural rendering, ultra-detailed, 8K",
        "negative_prompt": "modern, futuristic, industrial, asymmetrical, blurry, low quality, cropped"
    },
    "modern": {
        "prompt": "Modern {angle} view of house with clean lines, large windows, minimalist design, professional architectural rendering, ultra-detailed, 8K",
        "negative_prompt": "traditional, ornate, rustic, vintage, blurry, low quality, cropped"
    },
    # ... (other exterior styles remain the same)
}

EXTERIOR_STRENGTH_CONFIG = {
    "very low": {"image_strength": 0.40, "steps": 35, "cfg_scale": 4},
    "low": {"image_strength": 0.35, "steps": 40, "cfg_scale": 5},
    "medium": {"image_strength": 0.30, "steps": 45, "cfg_scale": 6},
    "high": {"image_strength": 0.25, "steps": 50, "cfg_scale": 7}
}

async def generate_exterior_design_variation(
    image_bytes: bytes,
    design_config: dict,
    strength_level: str
):
    """Generate exterior design variation with proper aiohttp file upload"""
    try:
        if strength_level.lower() not in EXTERIOR_STRENGTH_CONFIG:
            raise ValueError(f"Invalid strength level: {strength_level}")

        params = EXTERIOR_STRENGTH_CONFIG[strength_level.lower()]
        
        style = design_config["style"].lower()
        if style not in EXTERIOR_STYLE_CONFIGS:
            raise ValueError(f"Invalid design style: {style}")

        style_config = EXTERIOR_STYLE_CONFIGS[style]
        
        try:
            prompt = style_config["prompt"].format(
                angle=design_config["angle"],
                style=style
            )
        except KeyError as e:
            raise ValueError(f"Missing key in prompt formatting: {str(e)}")

        modifiers = [
            "perfect lighting", "architectural digest quality", 
            "hyper-realistic", "highly detailed textures",
            "magazine cover quality", "award-winning design",
            "golden hour lighting", "professional 3D rendering",
            "ultra HD", "8K resolution"
        ]
        prompt += ", " + random.choice(modifiers)

        # Prepare multipart form data
        data = aiohttp.FormData()
        data.add_field('init_image', 
                     image_bytes, 
                     filename='input.png',
                     content_type='image/png')
        data.add_field('init_image_mode', 'IMAGE_STRENGTH')
        data.add_field('image_strength', str(params["image_strength"]))
        data.add_field('text_prompts[0][text]', prompt)
        data.add_field('text_prompts[0][weight]', '1.2')
        data.add_field('text_prompts[1][text]', style_config["negative_prompt"])
        data.add_field('text_prompts[1][weight]', '-1.0')
        data.add_field('cfg_scale', str(params["cfg_scale"]))
        data.add_field('samples', '1')
        data.add_field('steps', str(params["steps"]))
        data.add_field('seed', str(random.randint(0, 100000)))
        data.add_field('style_preset', 'photographic')

        # Make API request with timeout
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    STABILITY_API_URL,
                    headers=HEADERS,
                    data=data,
                    timeout=60
                ) as response:
                    if response.status != 200:
                        error_detail = await response.text()
                        raise ValueError(
                            f"API returned status {response.status}: {error_detail}"
                        )
                    
                    result = await response.json()
                    
                    if not result.get("artifacts"):
                        raise ValueError("No artifacts in API response")
                    
                    return result["artifacts"][0]
                    
        except asyncio.TimeoutError:
            raise ValueError("API request timed out")
        except aiohttp.ClientError as e:
            raise ValueError(f"Network error: {str(e)}")

    except Exception as e:
        raise ValueError(f"Generation failed: {str(e)}")

@router.post("/generate-exterior-design/")
async def generate_exterior_design(
    user_id: str = Form(...),
    image: UploadFile = File(...),
    house_angle: HouseAngle = Form(...),
    design_style: ExteriorDesignStyle = Form(...),
    ai_strength: AIStylingStrength = Form("medium"),
    num_designs: int = Form(1, ge=1, le=12)
):
    from datetime import date
    from appln.models import UserData, UserSubscription, UserDesignHistory, CreditUsage

    try:
        # Step 1: User & Subscription
        try:
            user = await sync_to_async(UserData.objects.get)(id=user_id)
            subscription = await sync_to_async(UserSubscription.objects.filter(user=user).first)()
            if not subscription:
                raise HTTPException(status_code=404, detail="Subscription not found")
        except UserData.DoesNotExist:
            raise HTTPException(status_code=404, detail="User not found")

        # Step 2: Credit Check
        remaining_credits = subscription.total_credits - subscription.used_credits
        if remaining_credits < num_designs:
            raise HTTPException(status_code=402, detail={"message": "Not enough credits", "available": remaining_credits, "required": num_designs})

        # Step 3: Save uploaded image to S3
        file_ext = os.path.splitext(image.filename)[1].lower()
        if file_ext not in ['.jpg', '.jpeg', '.png']:
            raise HTTPException(status_code=400, detail="Only JPG, JPEG, and PNG files are allowed")

        original_filename = f"original_{uuid.uuid4().hex}{file_ext}"
        original_s3_key = get_upload_path(original_filename)
        
        # Read and process image
        image_content = await image.read()
        processed_image_bytes, _ = await resize_to_allowed_dimensions(image_content)
        await save_bytes_file(processed_image_bytes, original_s3_key)

        # Step 4: Generate designs
        design_config = {"style": design_style.value, "angle": house_angle.value}
        tasks = [generate_exterior_design_variation(processed_image_bytes, design_config, ai_strength.value) for _ in range(num_designs)]
        results = await asyncio.gather(*tasks)

        # Step 5: Save generated images to S3
        generated_filenames = []
        for result in results:
            filename = f"generated_{uuid.uuid4().hex}.png"
            file_s3_key = get_generated_path(filename)
            
            generated_image_bytes = base64.b64decode(result["base64"])
            if subscription.current_plan == "basic":
                generated_image_bytes = add_watermark_to_image(generated_image_bytes)
                
            await save_bytes_file(generated_image_bytes, file_s3_key)
            generated_filenames.append(filename)

        # Step 6: Update DB and remove old entries if needed
        @sync_to_async
        def save_db_changes():
            with transaction.atomic():
                existing_entries = UserDesignHistory.objects.filter(user=user).order_by('created_at')
                excess = existing_entries.count() + len(generated_filenames) - 10
                if excess > 0:
                    for old_entry in existing_entries[:excess]:
                        try:
                            old_upload_key = get_upload_path(os.path.basename(old_entry.uploaded_image.name))
                            old_generated_key = get_generated_path(os.path.basename(old_entry.generated_image.name))
                            remove_file(old_upload_key)
                            remove_file(old_generated_key)
                        except Exception:
                            pass
                        old_entry.delete()

                for fname in generated_filenames:
                    UserDesignHistory.objects.create(
                        user=user,
                        uploaded_image=f"uploads/{original_filename}",
                        generated_image=f"generated/{fname}",
                        category="exteriors"
                    )

                subscription.used_credits += num_designs
                subscription.total_credits_used_all_time += num_designs
                subscription.save()

                today = date.today()
                credit_entry, created = CreditUsage.objects.get_or_create(
                    user=user,
                    date=today,
                    defaults={"credits_used": num_designs}
                )
                if not created:
                    credit_entry.credits_used += num_designs
                    credit_entry.save()

        await save_db_changes()

        # Step 7: Return S3 URLs
        uploaded_url = get_file_url(original_s3_key)
        generated_urls = [get_file_url(get_generated_path(f)) for f in generated_filenames]

        return {
            "success": True,
            "original_image": uploaded_url,
            "designs": generated_urls,
            "credits": {
                "remaining": subscription.total_credits - subscription.used_credits,
                "used": subscription.used_credits,
                "total": subscription.total_credits
            },
            "message": "Exterior designs generated successfully"
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


#out door 
class OutdoorSpaceType(str, Enum):
    FRONT_YARD = "front yard"
    BACKYARD = "backyard"
    BALCONY = "balcony"
    TERRACE_ROOFTOP = "terrace/rooftop"
    DRIVEWAY_PARKING = "driveway/parking"
    WALKWAY_PATH = "walkway/path"
    LOUNGE = "lounge"
    PORCH = "porch"
    FENCE = "fence"
    GARDEN = "garden"

class OutdoorDesignStyle(str, Enum):
    MODERN = "modern"
    CONTEMPORARY = "contemporary"
    TRADITIONAL = "traditional"
    RUSTIC = "rustic"
    SCANDINAVIAN = "scandinavian"
    CLASSIC_GARDEN = "classic garden"
    COASTAL_OUTDOOR = "coastal outdoor"
    FARMHOUSE = "farmhouse"
    COTTAGE_GARDEN = "cottage garden"
    INDUSTRIAL = "industrial"
    BEACH = "beach"

OUTDOOR_STRENGTH_CONFIG = {
    "very low": {"image_strength": 0.45, "steps": 45, "cfg_scale": 10},
    "low": {"image_strength": 0.40, "steps": 50, "cfg_scale": 11},
    "medium": {"image_strength": 0.35, "steps": 50, "cfg_scale": 12},
    "high": {"image_strength": 0.30, "steps": 50, "cfg_scale": 13}
}

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def outdoor_resize_to_allowed_dimensions(image_bytes: bytes):
    """
    Resize the image to the closest allowed SDXL dimension based on aspect ratio.
    Returns: (image_bytes, (new_width, new_height))
    """
    try:
        with Image.open(io.BytesIO(image_bytes)) as img:
            img = img.convert("RGB")  # Ensure correct mode
            width, height = img.size
            aspect_ratio = width / height

            # Find closest allowed dimension by comparing aspect ratios
            closest_dim = min(
                ALLOWED_DIMENSIONS,
                key=lambda dim: abs((dim[0] / dim[1]) - aspect_ratio)
            )

            # If the image is already close enough to a valid dimension, skip resizing
            if abs(width - closest_dim[0]) < 100 and abs(height - closest_dim[1]) < 100:
                return image_bytes, (width, height)

            # Resize using high-quality resampling
            resized_img = img.resize(closest_dim, Image.LANCZOS)
            img_bytes = io.BytesIO()
            resized_img.save(img_bytes, format="PNG", optimize=True, quality=90)
            return img_bytes.getvalue(), closest_dim

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Image processing error: {str(e)}")

# Style configurations for outdoor
OUTDOOR_STYLE_CONFIGS = {
    "modern": {
        "prompt": "Modern {space_type} with clean lines, sleek outdoor furniture, minimal landscaping, {style} style",
        "negative_prompt": "traditional, rustic, cluttered, overgrown"
    },
    "contemporary": {
        "prompt": "Contemporary {space_type} with innovative layout, stylish materials, modern lighting, {style} style",
        "negative_prompt": "vintage, outdated, chaotic, dark"
    },
    "traditional": {
        "prompt": "Traditional {space_type} with classic landscaping, balanced design, cozy seating, {style} style",
        "negative_prompt": "futuristic, industrial, minimalist"
    },
    "rustic": {
        "prompt": "Rustic {space_type} with natural wood, stone elements, vintage charm, cozy vibes, {style} style",
        "negative_prompt": "modern, polished, synthetic"
    },
    "scandinavian": {
        "prompt": "Scandinavian {space_type} with clean simplicity, light wood, minimalism, natural tones, {style} style",
        "negative_prompt": "ornate, cluttered, industrial"
    },
    "classic garden": {
        "prompt": "Classic garden {space_type} with symmetrical layout, trimmed hedges, elegant planters, {style} style",
        "negative_prompt": "wild, messy, futuristic"
    },
    "coastal outdoor": {
        "prompt": "Coastal {space_type} with ocean-inspired tones, light textures, airy seating, beachy plants, {style} style",
        "negative_prompt": "dark, urban, heavy"
    },
    "farmhouse": {
        "prompt": "Farmhouse-style {space_type} with natural wood, reclaimed elements, vintage accessories, {style} style",
        "negative_prompt": "sleek, modern, artificial"
    },
    "cottage garden": {
        "prompt": "Cottage garden {space_type} with colorful flowers, curving paths, storybook charm, {style} style",
        "negative_prompt": "structured, minimalist, modern"
    },
    "industrial": {
        "prompt": "Industrial {space_type} with exposed concrete, metal structures, bold lighting, urban design, {style} style",
        "negative_prompt": "floral, vintage, traditional"
    },
    "beach": {
        "prompt": "Beach-style {space_type} with sandy textures, driftwood decor, relaxed seating, breezy colors, {style} style",
        "negative_prompt": "formal, sharp, dark"
    }
}

async def generate_outdoor_design_variation(
    image_bytes: bytes,
    design_config: dict,
    strength_level: str
) -> dict:
    """Robust outdoor design generation with enhanced error handling"""
    try:
        # Validate strength level
        strength_level = strength_level.lower()
        if strength_level not in OUTDOOR_STRENGTH_CONFIG:
            raise ValueError(f"Invalid strength level: {strength_level}")

        params = OUTDOOR_STRENGTH_CONFIG[strength_level]

        # Validate and format design style
        style = design_config["style"].lower()
        if style not in OUTDOOR_STYLE_CONFIGS:
            raise ValueError(f"Invalid design style: {style}")

        style_config = OUTDOOR_STYLE_CONFIGS[style]

        # Format space type (handle enum values consistently)
        space_type = design_config["space_type"].lower().replace("_", " ").replace("/", " ")

        # Build enhanced prompt
        prompt = style_config["prompt"].format(
            space_type=space_type.title(), 
            style=style.lower().replace("_", " ")
        )
        prompt += ", ultra realistic, 8K resolution, professional photography, detailed textures"

        # Enhanced negative prompt
        negative_prompt = (
            style_config["negative_prompt"] + ", " +
            "blurry, distorted proportions, bad lighting, flat colors, " +
            "cartoonish, painting-like, unrealistic materials"
        )

        # Prepare API request
        data = aiohttp.FormData()
        data.add_field('init_image', image_bytes, filename='input.png', content_type='image/png')
        data.add_field('init_image_mode', 'IMAGE_STRENGTH')
        data.add_field('image_strength', str(params["image_strength"]))
        data.add_field('text_prompts[0][text]', prompt)
        data.add_field('text_prompts[0][weight]', '1.5')
        data.add_field('text_prompts[1][text]', negative_prompt)
        data.add_field('text_prompts[1][weight]', '-1.2')
        data.add_field('cfg_scale', str(params["cfg_scale"]))
        data.add_field('samples', '1')
        data.add_field('steps', str(params["steps"]))
        data.add_field('seed', str(random.randint(0, 100000)))
        data.add_field('style_preset', 'photographic')
        data.add_field('sampler', 'K_DPMPP_2M')

        # Make API request with timeout
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    STABILITY_API_URL,
                    headers=HEADERS,
                    data=data,
                    timeout=aiohttp.ClientTimeout(total=90)
                ) as response:
                    if response.status != 200:
                        error_detail = await response.text()
                        logger.error(f"API Error: {response.status} - {error_detail}")
                        raise ValueError(f"API request failed with status {response.status}")

                    result = await response.json()
                    if not result.get("artifacts"):
                        raise ValueError("No artifacts in API response")

                    return result["artifacts"][0]

        except asyncio.TimeoutError:
            raise ValueError("API request timed out")
        except aiohttp.ClientError as e:
            raise ValueError(f"Network error: {str(e)}")

    except Exception as e:
        logger.error(f"Generation failed: {str(e)}", exc_info=True)
        raise

@router.post("/generate-outdoor-design/")
async def generate_outdoor_design(
    user_id: str = Form(...),
    image: UploadFile = File(...),
    space_type: OutdoorSpaceType = Form(...),
    design_style: OutdoorDesignStyle = Form(...),
    ai_strength: str = Form("medium"),
    num_designs: int = Form(1, ge=1, le=6)
):
    from datetime import date
    from appln.models import UserData, UserSubscription, UserDesignHistory, CreditUsage

    try:
        # Step 1: User & Subscription
        try:
            user = await sync_to_async(UserData.objects.get)(id=user_id)
            subscription = await sync_to_async(UserSubscription.objects.filter(user=user).first)()
            if not subscription:
                raise HTTPException(status_code=404, detail="Subscription not found")
        except UserData.DoesNotExist:
            raise HTTPException(status_code=404, detail="User not found")

        # Step 2: Credit Check
        remaining_credits = subscription.total_credits - subscription.used_credits
        if remaining_credits < num_designs:
            raise HTTPException(
                status_code=402,
                detail={
                    "message": "Not enough credits", 
                    "available": remaining_credits, 
                    "required": num_designs
                }
            )

        # Step 3: Process and Save Uploaded Image to S3
        file_ext = os.path.splitext(image.filename)[1].lower()
        if file_ext not in ['.jpg', '.jpeg', '.png']:
            raise HTTPException(status_code=400, detail="Only JPG, JPEG, and PNG files are allowed")

        original_filename = f"original_{uuid.uuid4().hex}{file_ext}"
        original_s3_key = get_upload_path(original_filename)

        try:
            # Read and process image
            image_content = await image.read()
            processed_image_bytes, _ = await outdoor_resize_to_allowed_dimensions(image_content)
            
            # Save processed image to S3
            await save_bytes_file(processed_image_bytes, original_s3_key)

        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Image processing failed: {str(e)}")

        # Step 4: Generate Designs
        design_config = {
            "style": design_style.value.lower(),
            "space_type": space_type.value.lower(),
        }

        try:
            tasks = [
                generate_outdoor_design_variation(processed_image_bytes, design_config, ai_strength.lower())
                for _ in range(num_designs)
            ]
            results = await asyncio.gather(*tasks)

        except Exception as e:
            await remove_file(original_s3_key)
            raise HTTPException(status_code=500, detail=f"Design generation failed: {str(e)}")

        # Step 5: Save Generated Images to S3
        generated_filenames = []

        try:
            for result in results:
                filename = f"generated_{uuid.uuid4().hex}.png"
                file_s3_key = get_generated_path(filename)
                
                # Decode and process generated image
                generated_image_bytes = base64.b64decode(result["base64"])
                
                # Apply watermark if basic plan
                if subscription.current_plan == "basic":
                    generated_image_bytes = add_watermark_to_image(generated_image_bytes)
                
                # Save to S3
                await save_bytes_file(generated_image_bytes, file_s3_key)
                generated_filenames.append(filename)

        except Exception as e:
            # Cleanup on error
            for f in generated_filenames:
                await remove_file(get_generated_path(f))
            await remove_file(original_s3_key)
            raise HTTPException(status_code=500, detail=f"Image saving failed: {str(e)}")

        # Step 6: Update DB & Delete Old Entries
        try:
            @sync_to_async
            def save_db_changes():
                with transaction.atomic():
                    # Get existing entries ordered by creation date
                    existing_entries = UserDesignHistory.objects.filter(user=user).order_by('created_at')
                    
                    # Calculate how many entries to delete to maintain 10-entry limit
                    excess = existing_entries.count() + len(generated_filenames) - 10
                    
                    if excess > 0:
                        for old_entry in existing_entries[:excess]:
                            try:
                                # Remove files from S3
                                old_upload_key = get_upload_path(os.path.basename(old_entry.uploaded_image.name))
                                old_generated_key = get_generated_path(os.path.basename(old_entry.generated_image.name))
                                remove_file(old_upload_key)
                                remove_file(old_generated_key)
                            except Exception as e:
                                logger.warning(f"Failed to delete old files: {e}")
                                # Continue with deletion even if file removal fails
                            old_entry.delete()

                    # Create new design history entries
                    for fname in generated_filenames:
                        UserDesignHistory.objects.create(
                            user=user,
                            uploaded_image=f"uploads/{original_filename}",
                            generated_image=f"generated/{fname}",
                            category="outdoors"
                        )

                    # Update subscription credits
                    subscription.used_credits += num_designs
                    subscription.total_credits_used_all_time += num_designs
                    subscription.save()

                    # Update daily credit usage
                    today = date.today()
                    credit_entry, created = CreditUsage.objects.get_or_create(
                        user=user,
                        date=today,
                        defaults={"credits_used": num_designs}
                    )
                    if not created:
                        credit_entry.credits_used += num_designs
                        credit_entry.save()

            await save_db_changes()

        except Exception as e:
            # Cleanup on DB error
            for f in generated_filenames:
                await remove_file(get_generated_path(f))
            await remove_file(original_s3_key)
            raise HTTPException(status_code=500, detail=f"Database update failed: {str(e)}")

        # Step 7: Return S3 URLs
        uploaded_url = get_file_url(original_s3_key)
        generated_urls = [get_file_url(get_generated_path(f)) for f in generated_filenames]

        return {
            "success": True,
            "original_image": uploaded_url,
            "designs": generated_urls,
            "credits": {
                "remaining": subscription.total_credits - subscription.used_credits,
                "used": subscription.used_credits,
                "total": subscription.total_credits
            },
            "message": "Outdoor designs generated successfully"
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

@router.post("/generate/more-designs")
async def generate_more_designs(
    user_id: str = Form(...),
    category: Literal["interiors", "exteriors", "outdoors"] = Form(...),
    type_detail: str = Form(...),           # e.g., "living room", "front side", "backyard"
    style: str = Form(...),
    ai_strength: AIStylingStrength = Form("medium"),
    uploaded_image: UploadFile = File(...),
    num_designs: int = Form(2, ge=1, le=6)
):
    """
    Unified "Generate More Designs" endpoint that works for interiors, exteriors, and outdoors
    using the same uploaded image and parameters.
    """
    from datetime import date
    from appln.models import UserData, UserSubscription, UserDesignHistory, CreditUsage

    # Re-use existing configs based on category
    if category == "interiors":
        STYLE_CONFIGS_TO_USE = STYLE_CONFIGS
        STRENGTH_CONFIG_TO_USE = STRENGTH_CONFIG
    elif category == "exteriors":
        STYLE_CONFIGS_TO_USE = EXTERIOR_STYLE_CONFIGS
        STRENGTH_CONFIG_TO_USE = EXTERIOR_STRENGTH_CONFIG
    elif category == "outdoors":
        STYLE_CONFIGS_TO_USE = OUTDOOR_STYLE_CONFIGS
        STRENGTH_CONFIG_TO_USE = OUTDOOR_STRENGTH_CONFIG
    else:
        raise HTTPException(status_code=400, detail="Invalid category. Must be 'interiors', 'exteriors', or 'outdoors'")

    try:
        # === Step 1: User & Subscription ===
        user = await sync_to_async(UserData.objects.get)(id=user_id)
        subscription = await sync_to_async(UserSubscription.objects.filter(user=user).first)()
        if not subscription:
            raise HTTPException(status_code=404, detail="Subscription not found")

        # === Step 2: Credit Check ===
        remaining_credits = subscription.total_credits - subscription.used_credits
        if remaining_credits < num_designs:
            raise HTTPException(
                status_code=402,
                detail={
                    "message": "Not enough credits",
                    "available": remaining_credits,
                    "required": num_designs
                }
            )

        # === Step 3: Validate & Save Uploaded Image to S3 ===
        file_ext = os.path.splitext(uploaded_image.filename)[1].lower()
        if file_ext not in ['.jpg', '.jpeg', '.png']:
            raise HTTPException(status_code=400, detail="Only JPG, JPEG, and PNG files are allowed")

        original_filename = f"more_{uuid.uuid4().hex}{file_ext}"
        original_s3_key = get_upload_path(original_filename)

        image_content = await uploaded_image.read()
        processed_image_bytes, _ = await resize_to_allowed_dimensions(image_content)
        await save_bytes_file(processed_image_bytes, original_s3_key)

        # === Step 4: Build Prompt based on Category ===
        style_key = style.lower()
        if category == "interiors":
            if style_key not in STYLE_CONFIGS_TO_USE:
                raise HTTPException(status_code=400, detail=f"Invalid style '{style}' for interiors")
            style_config = STYLE_CONFIGS_TO_USE[style_key]
            prompt = style_config["prompt"].format(room_type=type_detail.lower(), style=style_key)
            negative_prompt = style_config["negative_prompt"]
        elif category == "exteriors":
            if style_key not in EXTERIOR_STYLE_CONFIGS:
                raise HTTPException(status_code=400, detail=f"Invalid style '{style}' for exteriors")
            style_config = EXTERIOR_STYLE_CONFIGS[style_key]
            prompt = style_config["prompt"].format(angle=type_detail.lower())
            negative_prompt = style_config["negative_prompt"]
        else:  # outdoors
            if style_key not in OUTDOOR_STYLE_CONFIGS:
                raise HTTPException(status_code=400, detail=f"Invalid style '{style}' for outdoors")
            style_config = OUTDOOR_STYLE_CONFIGS[style_key]
            space_type_formatted = type_detail.lower().replace("_", " ").replace("/", " ")
            prompt = style_config["prompt"].format(space_type=space_type_formatted.title(), style=style_key.replace("_", " "))
            negative_prompt = style_config["negative_prompt"] + ", blurry, low quality, distorted"

        strength_level = ai_strength.lower()
        params = STRENGTH_CONFIG_TO_USE[strength_level]

        # === Step 5: Generate Designs (using aiohttp like outdoor endpoint) ===
        async def _generate_one():
            data = aiohttp.FormData()
            data.add_field('init_image', processed_image_bytes, filename='input.png', content_type='image/png')
            data.add_field('init_image_mode', 'IMAGE_STRENGTH')
            data.add_field('image_strength', str(params["image_strength"]))
            data.add_field('text_prompts[0][text]', prompt + ", professional photography, 8K, highly detailed")
            data.add_field('text_prompts[0][weight]', '1.2')
            data.add_field('text_prompts[1][text]', negative_prompt)
            data.add_field('text_prompts[1][weight]', '-1.0')
            data.add_field('cfg_scale', str(params["cfg_scale"]))
            data.add_field('steps', str(params["steps"]))
            data.add_field('samples', '1')
            data.add_field('seed', str(random.randint(1, 1000000)))
            data.add_field('style_preset', 'photographic')

            async with aiohttp.ClientSession() as session:
                async with session.post(STABILITY_API_URL, headers=HEADERS, data=data, timeout=90) as resp:
                    if resp.status != 200:
                        error_text = await resp.text()
                        raise ValueError(f"Stability API error {resp.status}: {error_text}")
                    result = await resp.json()
                    return result["artifacts"][0]

        tasks = [_generate_one() for _ in range(num_designs)]
        results = await asyncio.gather(*tasks)

        # === Step 6: Save Generated Images to S3 ===
        generated_filenames = []
        try:
            for artifact in results:
                filename = f"more_{uuid.uuid4().hex}.png"
                s3_key = get_generated_path(filename)

                img_bytes = base64.b64decode(artifact["base64"])
                if subscription.current_plan == "basic":
                    img_bytes = add_watermark_to_image(img_bytes)

                await save_bytes_file(img_bytes, s3_key)
                generated_filenames.append(filename)
        except Exception as e:
            # Cleanup generated files on failure
            for f in generated_filenames:
                await remove_file(get_generated_path(f))
            await remove_file(original_s3_key)
            raise HTTPException(status_code=500, detail=f"Failed to save generated images: {str(e)}")

        # === Step 7: Update DB + Enforce 10-entry limit ===
        try:
            @sync_to_async
            def db_update():
                with transaction.atomic():
                    entries = UserDesignHistory.objects.filter(user=user).order_by('created_at')
                    excess = entries.count() + len(generated_filenames) - 10
                    if excess > 0:
                        for old in entries[:excess]:
                            try:
                                remove_file(get_upload_path(os.path.basename(old.uploaded_image.name)))
                                remove_file(get_generated_path(os.path.basename(old.generated_image.name)))
                            except: pass
                            old.delete()

                    for fname in generated_filenames:
                        UserDesignHistory.objects.create(
                            user=user,
                            uploaded_image=f"uploads/{original_filename}",
                            generated_image=f"generated/{fname}",
                            category=category + "s"  # "interiors", "exteriors", "outdoors"
                        )

                    subscription.used_credits += num_designs
                    subscription.total_credits_used_all_time += num_designs
                    subscription.save()

                    today = date.today()
                    usage, _ = CreditUsage.objects.get_or_create(user=user, date=today, defaults={"credits_used": 0})
                    usage.credits_used += num_designs
                    usage.save()

            await db_update()
        except Exception as e:
            # Cleanup on DB failure
            for f in generated_filenames:
                await remove_file(get_generated_path(f))
            await remove_file(original_s3_key)
            raise HTTPException(status_code=500, detail=f"Database update failed: {str(e)}")

        # === Step 8: Return URLs ===
        original_url = get_file_url(original_s3_key)
        design_urls = [get_file_url(get_generated_path(f)) for f in generated_filenames]

        return {
            "success": True,
            "original_image": original_url,
            "designs": design_urls,
            "credits": {
                "remaining": subscription.total_credits - subscription.used_credits,
                "used": subscription.used_credits,
                "total": subscription.total_credits
            },
            "message": f"Successfully generated {num_designs} more design(s)"
        }

    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"More designs error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
