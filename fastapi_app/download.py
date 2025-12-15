#fastapi_app/download.py
import os
from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse
from fastapi_app.storage import read_file_bytes, get_generated_path

router = APIRouter(prefix="/api", tags=["Downloads"])

@router.get("/download/{filename}")
async def download_image(
    filename: str,
    inline: Optional[bool] = Query(False, description="If true, serve as inline (for preview)")
):
    """
    Proxy endpoint to download or preview generated images.
    - Use for <img src> in frontend (inline by default).
    - For forced download, frontend fetches and creates blob link.
    """
    try:
        # Construct the storage key (assumes generated images are in 'generated/' prefix)
        key = get_generated_path(filename)
        
        # Read bytes from S3 or local
        content = read_file_bytes(key)
        
        # Determine content type based on extension
        ext = os.path.splitext(filename.lower())[1]
        content_type_map = {
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.webp': 'image/webp'
        }
        content_type = content_type_map.get(ext, 'application/octet-stream')
        
        headers = {
            "Cache-Control": "public, max-age=3600",  # Cache for 1 hour
            "Access-Control-Expose-Headers": "Content-Length",
        }
        
        if not inline:
            headers["Content-Disposition"] = f'attachment; filename="{filename}"'
        
        return StreamingResponse(
            iter([content]),
            media_type=content_type,
            headers=headers
        )
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Image not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error serving image: {str(e)}")