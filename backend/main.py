# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api import dashboard as dashboard_router
from backend.api import auth as auth_router

app = FastAPI(
    title="PaperPilot API",
    description="Multi-tenant Examination and Question Bank Management System",
    version="1.0.0"
)

# CORS Middleware (Allows your React frontend to talk to FastAPI)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Your React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(dashboard_router.router, prefix="/api/v1", tags=["Dashboard"])

@app.get("/")
def health_check():
    return {"status": "healthy", "project": "PaperPilot"}