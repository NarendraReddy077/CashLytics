from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, transactions

app = FastAPI(
    title="Personal Finance API",
    description="RESTful API for managing personal finances",
    version="1.0.0",
)

# CORS — allow frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(transactions.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "CashLytics API is running"}


@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}
