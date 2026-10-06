import os
from pathlib import Path
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, StreamingResponse
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

from .config import settings
from .models.schemas import (
    SocraticRequest, 
    SocraticResponse, 
    BenchmarkItem,
    SubjectArea
)
from .services.socratic_engine import SocraticEngine
from .services.evaluator import BenchmarkEvaluator
from .services.session_manager import session_manager
from .data.benchmark_dataset import BENCHMARK_DATASET

app = FastAPI(
    title="SocraticLens API",
    description="Gemma 4 Multimodal Socratic Tutor API - Track 1: A Tutor That Won't Give You the Answer",
    version="2.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = SocraticEngine()
evaluator = BenchmarkEvaluator(engine)

class CreateSessionRequest(BaseModel):
    problem_text: str
    subject: SubjectArea = SubjectArea.GENERAL
    session_id: Optional[str] = None

@app.get("/api/health")
async def health_check():
    return {
        "status": "online",
        "service": "SocraticLens Gemma 4 Tutor",
        "primary_model": settings.PRIMARY_MODEL,
        "has_api_key": bool(settings.GEMINI_API_KEY)
    }

@app.post("/api/socratic/analyze", response_model=SocraticResponse)
async def analyze_work(request: SocraticRequest):
    """Multimodal Socratic guidance endpoint."""
    try:
        response = engine.process_request(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/socratic/analyze/stream")
async def analyze_work_stream(request: SocraticRequest):
    """SSE streaming Socratic guidance endpoint."""
    try:
        return StreamingResponse(
            engine.process_request_streaming(request),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Session Management Endpoints
@app.post("/api/sessions")
async def create_session(req: CreateSessionRequest):
    session = session_manager.create_session(req.problem_text, req.subject, req.session_id)
    return session.to_dict()

@app.get("/api/sessions")
async def list_sessions():
    return session_manager.list_sessions()

@app.get("/api/sessions/{session_id}")
async def get_session(session_id: str):
    session = session_manager.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session.to_dict()

@app.get("/api/stats")
async def get_analytics_stats():
    return session_manager.get_analytics()

# Benchmark Endpoints
@app.get("/api/benchmark/dataset", response_model=List[BenchmarkItem])
async def get_benchmark_dataset():
    return BENCHMARK_DATASET

@app.get("/api/benchmark/run")
async def run_benchmark():
    try:
        summary = evaluator.run_full_benchmark()
        return summary
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Mount built frontend dist files
FRONTEND_DIST = Path(__file__).parent.parent.parent / "frontend" / "dist"
if FRONTEND_DIST.exists():
    app.mount("/assets", StaticFiles(directory=str(FRONTEND_DIST / "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        file_path = FRONTEND_DIST / full_path
        if file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(FRONTEND_DIST / "index.html")
