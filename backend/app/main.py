from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import engine, Base
from .routers import auth, products, agents, carts, orders
# Import models to ensure they're registered
from .models import user, product, cart, order

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="E-commerce API with AI Agents",
    description="A complete e-commerce solution with JWT auth, cart, payments, and AI shopping assistants",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(agents.router)
app.include_router(carts.router)
app.include_router(orders.router)
@app.get("/")
async def root():
    return {
        "message": "Welcome to the E-commerce API with AI Agents!",
        "features": [
            "JWT Authentication",
            "Product Management",
            "Shopping Cart",
            "Order Management",
            "AI Shopping Assistants",
            "Multi-Agent System"
        ]
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}