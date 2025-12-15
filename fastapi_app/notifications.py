# fastapi/notifications.py
from fastapi import APIRouter, WebSocket
from typing import List

router = APIRouter()
connections: List[WebSocket] = []

@router.websocket("/api/ws/admin/notifications")
async def admin_notifications_ws(websocket: WebSocket):
    await websocket.accept()
    connections.append(websocket)
    try:
        while True:
            msg = await websocket.receive_text()
            if msg == "ping":
                await websocket.send_text("pong")   # KEEP ALIVE # keep connection alive
    except Exception:
        if websocket in connections:
            connections.remove(websocket)


async def broadcast_notification(message: str, type_: str = "general", extra: dict = None):
    """Send a notification to all connected admin clients"""
    payload = {"type": type_, "message": message}
    if extra:
        payload.update(extra)
    for conn in connections[:]:
        try:
            await conn.send_json(payload)
        except Exception as e:
            print(f"❌ Failed WebSocket send: {e}")
            try:
                connections.remove(conn)
            except ValueError:
                pass
