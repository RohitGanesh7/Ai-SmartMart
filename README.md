# 🛍️ ShopSphere - AI-Powered E-commerce Platform

<div align="center">
  <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop" alt="ShopSphere Banner" width="100%">
  
  [![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)
  [![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com)
  [![Stripe](https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com)
  
  **A complete e-commerce solution with intelligent AI shopping assistants**
  
  [🚀 Live Demo](#) • [📖 Documentation](#) • [🐛 Report Bug](#) • [💡 Request Feature](#)
</div>

## 📋 Table of Contents
- [✨ Features](#-features)
- [🤖 AI Agents](#-ai-agents)
- [🏗️ Architecture](#️-architecture)
- [🚀 Quick Start](#-quick-start)
- [📦 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [🔧 Development](#-development)
- [📱 Screenshots](#-screenshots)
- [🧪 Testing](#-testing)
- [🚀 Deployment](#-deployment)
- [📚 API Documentation](#-api-documentation)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## ✨ Features

<div align="center">
  <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=300&fit=crop" alt="Modern E-commerce Features">
</div>

### 🛒 **Core E-commerce Features**
- ✅ **JWT Authentication** - Secure user registration and login
- ✅ **Product Catalog** - Browse, search, and filter products
- ✅ **Shopping Cart** - Add, remove, and manage cart items
- ✅ **Order Management** - Complete order lifecycle with tracking
- ✅ **Payment Integration** - Secure payments with Stripe
- ✅ **User Profiles** - Comprehensive user account management
- ✅ **Admin Dashboard** - Product and order management
- ✅ **Real-time Updates** - Live inventory and pricing

### 🤖 **AI-Powered Shopping Experience**
- 🔮 **Smart Product Recommendations** - Personalized suggestions
- 💬 **Conversational Commerce** - Natural language shopping
- 📊 **Intelligent Analytics** - User behavior insights
- 🎯 **Dynamic Pricing** - AI-driven price optimization
- 🔍 **Advanced Search** - Semantic product search

## 🤖 AI Agents

<div align="center">
  <img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=300&fit=crop" alt="AI Shopping Assistants">
</div>

Our multi-agent system features three specialized AI assistants:

### 👩‍💼 **Emma - Sales Assistant**
<img align="right" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face" alt="Sales Assistant" width="120">

- 🛍️ **Product Recommendations** - Personalized suggestions based on preferences
- 💰 **Deal Finder** - Identifies best offers and discounts
- 🎯 **Shopping Guidance** - Helps navigate product categories
- 📈 **Trend Analysis** - Suggests trending and popular items

### 🔧 **Alex - Product Expert**
<img align="right" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" alt="Product Expert" width="120">

- 📋 **Technical Specifications** - Detailed product information
- ⚖️ **Product Comparisons** - Side-by-side feature analysis
- 🔍 **Compatibility Check** - Ensures product compatibility
- 🛠️ **Usage Guidance** - Installation and setup assistance

### 🎧 **Sam - Customer Support**
<img align="right" src="https://images.unsplash.com/photo-1559087867-ce4c91325525?w=200&h=200&fit=crop&crop=face" alt="Customer Support" width="120">

- 📦 **Order Tracking** - Real-time shipment updates
- 🔄 **Returns & Refunds** - Streamlined return process
- 🏠 **Account Management** - Profile and settings assistance
- 🚨 **Issue Resolution** - Quick problem solving

## 🏗️ Architecture

<div align="center">
  <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop" alt="System Architecture">
</div>

```mermaid
graph TB
    subgraph "Frontend (React + Tailwind)"
        A[User Interface]
        B[Shopping Cart]
        C[AI Chat Widget]
    end
    
    subgraph "Backend (FastAPI)"
        D[Authentication API]
        E[Product API]
        F[Order API]
        G[AI Agent API]
    end
    
    subgraph "AI Layer"
        H[OpenAI GPT-3.5]
        I[Agent Router]
        J[Context Manager]
    end
    
    subgraph "Data Layer"
        K[(PostgreSQL)]
        L[Redis Cache]
    end
    
    subgraph "External Services"
        M[Stripe Payments]
        N[Email Service]
    end
    
    A --> D
    B --> E
    C --> G
    G --> I
    I --> H
    D --> K
    E --> K
    F --> K
    F --> M
```

### 🎯 **Tech Stack**

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + Tailwind CSS | Modern, responsive UI |
| **Backend** | FastAPI + Python | High-performance API |
| **Database** | PostgreSQL + SQLAlchemy | Reliable data storage |
| **AI Engine** | OpenAI GPT-3.5-turbo | Intelligent conversations |
| **Authentication** | JWT + bcrypt | Secure user auth |
| **Payments** | Stripe API | Secure transactions |
| **Deployment** | Docker + Nginx | Scalable infrastructure |

## 🚀 Quick Start

<div align="center">
  <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop" alt="Quick Start Guide">
</div>

Get up and running in 5 minutes:

### 1️⃣ **Clone Repository**
```bash
git clone https://github.com/yourusername/shopsphere.git
cd shopsphere
```

### 2️⃣ **Setup Backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install fastapi uvicorn sqlalchemy psycopg2-binary alembic python-jose passlib python-multipart pydantic pydantic-settings python-dotenv stripe openai httpx typing-extensions
```

### 3️⃣ **Setup Frontend**
```bash
cd ../frontend
npm install
```

### 4️⃣ **Configure Environment**
```bash
# Backend .env
DATABASE_URL=postgresql://user:password@localhost/shopsphere
SECRET_KEY=your-secret-key-here
OPENAI_API_KEY=your-openai-api-key
STRIPE_SECRET_KEY=your-stripe-secret-key
```

### 5️⃣ **Run Application**
```bash
# Terminal 1 - Backend
cd backend && python run.py

# Terminal 2 - Frontend  
cd frontend && npm start
```

🎉 **Access your app at [http://localhost:3000](http://localhost:3000)**

## 📦 Installation

<div align="center">
  <img src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=300&fit=crop" alt="Installation Process">
</div>

### **Prerequisites**
- Python 3.8+ 🐍
- Node.js 16+ 📦
- PostgreSQL 12+ 🐘
- Git 📚

### **Backend Installation**
```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup database
createdb shopsphere
alembic upgrade head

# Insert sample data
psql -d shopsphere -f database/product_inserts.sql
```

### **Frontend Installation**
```bash
# Install dependencies
npm install

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## ⚙️ Configuration

<div align="center">
  <img src="https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=600&h=300&fit=crop" alt="Configuration Settings">
</div>

### **Environment Variables**

#### **Backend (.env)**
```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/shopsphere

# Security
SECRET_KEY=your-super-secret-jwt-key-minimum-32-characters
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# AI Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-3.5-turbo

# Payment Processing
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# CORS
ALLOWED_ORIGINS=["http://localhost:3000","https://yourdomain.com"]
```

#### **Frontend (.env)**
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
REACT_APP_APP_NAME=ShopSphere
```

## 🔧 Development

<div align="center">
  <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=300&fit=crop" alt="Development Environment">
</div>

### **Development Commands**

```bash
# Backend Development
cd backend
python run.py --reload

# Frontend Development
cd frontend  
npm start

# Database Operations
alembic revision --autogenerate -m "Description"
alembic upgrade head

# Run Tests
pytest backend/tests/
npm test --watchAll=false

# Code Formatting
black backend/
prettier --write frontend/src/
```

### **Project Structure**
```
shopsphere/
├── 📁 backend/                 # FastAPI Backend
│   ├── 📁 app/
│   │   ├── 📁 agents/         # AI Agent System
│   │   ├── 📁 models/         # Database Models  
│   │   ├── 📁 routers/        # API Routes
│   │   ├── 📁 schemas/        # Pydantic Schemas
│   │   └── 📁 services/       # Business Logic
│   ├── 📁 tests/              # Backend Tests
│   └── 📄 requirements.txt    # Python Dependencies
├── 📁 frontend/                # React Frontend
│   ├── 📁 src/
│   │   ├── 📁 components/     # React Components
│   │   ├── 📁 pages/          # Page Components  
│   │   ├── 📁 context/        # React Context
│   │   └── 📁 services/       # API Services
│   └── 📄 package.json        # Node Dependencies
├── 📁 database/                # Database Scripts
│   ├── 📄 init.sql            # Initial Schema
│   └── 📄 product_inserts.sql # Sample Data
└── 📄 README.md               # This File
```

## 📱 Screenshots

<div align="center">
  
### 🏠 **Homepage with AI Assistant**
<img src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=500&fit=crop" alt="Homepage" width="100%">

### 🛍️ **Product Catalog**
<img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=500&fit=crop" alt="Product Catalog" width="100%">

### 💬 **AI Chat Interface**
<img src="https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=500&fit=crop" alt="AI Chat Interface" width="100%">

### 🛒 **Shopping Cart**
<img src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=500&fit=crop" alt="Shopping Cart" width="100%">

### 📱 **Mobile Responsive**
<div align="center">
  <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=600&fit=crop" alt="Mobile View 1" width="30%">
  <img src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=600&fit=crop" alt="Mobile View 2" width="30%">
  <img src="https://images.unsplash.com/photo-1556656793-08538906a9f8?w=300&h=600&fit=crop" alt="Mobile View 3" width="30%">
</div>

</div>

## 🧪 Testing

<div align="center">
  <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=300&fit=crop" alt="Testing Framework">
</div>

### **Backend Testing**
```bash
# Run all tests
pytest backend/tests/ -v

# Run with coverage
pytest backend/tests/ --cov=app --cov-report=html

# Test specific module
pytest backend/tests/test_agents.py -v
```

### **Frontend Testing**
```bash
# Run component tests
npm test

# Run e2e tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

### **Test Coverage Goals**
- 🎯 Backend API: 90%+
- 🎯 Frontend Components: 80%+
- 🎯 AI Agent Logic: 85%+

## 🚀 Deployment

<div align="center">
  <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=300&fit=crop" alt="Deployment Infrastructure">
</div>

### **Docker Deployment**
```bash
# Build and run with Docker Compose
docker-compose up -d --build

# Scale services
docker-compose up -d --scale backend=3

# View logs
docker-compose logs -f
```

### **Production Checklist**
- ✅ Environment variables configured
- ✅ Database migrations applied  
- ✅ SSL certificates installed
- ✅ Static files served via CDN
- ✅ Error monitoring setup (Sentry)
- ✅ Analytics configured (Google Analytics)
- ✅ Backup strategy implemented
- ✅ Load balancer configured

### **Deployment Platforms**

| Platform | Backend | Frontend | Database |
|----------|---------|----------|----------|
| **AWS** | ECS/Lambda | S3 + CloudFront | RDS PostgreSQL |
| **Google Cloud** | Cloud Run | Firebase Hosting | Cloud SQL |
| **Heroku** | Heroku Dyno | Heroku Static | Heroku Postgres |
| **Vercel** | Vercel Functions | Vercel | Supabase |

## 📚 API Documentation

<div align="center">
  <img src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=300&fit=crop" alt="API Documentation">
</div>

### **Interactive API Docs**
- 📖 **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- 📋 **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

### **Key Endpoints**

#### **Authentication**
```http
POST /auth/register     # User registration
POST /auth/login        # User login  
GET  /auth/me          # Get current user
```

#### **Products**
```http
GET    /products/           # List products
GET    /products/{id}       # Get product details
POST   /products/           # Create product (admin)
PUT    /products/{id}       # Update product (admin)
DELETE /products/{id}       # Delete product (admin)
```

#### **AI Agents**
```http
POST /agents/chat                    # Chat with AI
POST /agents/switch-agent           # Switch agent type
POST /agents/product-inquiry/{id}   # Ask about product
GET  /agents/order-status/{id}      # Get order status via AI
```

#### **Orders**
```http
GET  /orders/        # List user orders
POST /orders/        # Create new order
GET  /orders/{id}    # Get order details
PUT  /orders/{id}    # Update order status
```

### **Response Format**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Product Name",
    "price": 99.99
  },
  "message": "Operation successful",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 🤝 Contributing

<div align="center">
  <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=300&fit=crop" alt="Team Collaboration">
</div>

We love contributions! Here's how to get started:

### **How to Contribute**
1. 🍴 **Fork** the repository
2. 🌟 **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. 💻 **Make** your changes
4. ✅ **Test** your changes thoroughly
5. 📝 **Commit** your changes (`git commit -m 'Add amazing feature'`)
6. 📤 **Push** to the branch (`git push origin feature/amazing-feature`)
7. 🔄 **Open** a Pull Request

### **Development Guidelines**
- Follow PEP 8 for Python code
- Use ESLint/Prettier for JavaScript
- Write comprehensive tests
- Update documentation
- Add meaningful commit messages

### **Areas for Contribution**
- 🤖 AI agent improvements
- 🎨 UI/UX enhancements  
- 🚀 Performance optimizations
- 📱 Mobile responsiveness
- 🌍 Internationalization
- 🔒 Security enhancements

## 📄 License

<div align="center">
  <img src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=300&fit=crop" alt="Open Source License">
</div>

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 ShopSphere

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🙏 Acknowledgments

<div align="center">
  <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=300&fit=crop" alt="Thank You">
</div>

Special thanks to:
- 🤖 **OpenAI** for GPT-3.5-turbo API
- ⚡ **FastAPI** team for the amazing framework
- ⚛️ **React** community for frontend excellence
- 💳 **Stripe** for seamless payment processing
- 🎨 **Unsplash** for beautiful placeholder images
- 👥 **Contributors** who make this project better

---

<div align="center">
  
### 🌟 **Star this repo if you found it helpful!**

**Made with ❤️ by [Your Name](https://github.com/yourusername)**

[![GitHub Stars](https://img.shields.io/github/stars/yourusername/shopsphere?style=social)](https://github.com/yourusername/shopsphere)
[![GitHub Forks](https://img.shields.io/github/forks/yourusername/shopsphere?style=social)](https://github.com/yourusername/shopsphere)
[![GitHub Issues](https://img.shields.io/github/issues/yourusername/shopsphere)](https://github.com/yourusername/shopsphere/issues)
[![GitHub PRs](https://img.shields.io/github/issues-pr/yourusername/shopsphere)](https://github.com/yourusername/shopsphere/pulls)

</div>

---

<div align="center">

### 📞 **Support & Contact**

- 📧 **Email**: support@shopsphere.com
- 💬 **Discord**: [Join our community](https://discord.gg/shopsphere)
- 🐦 **Twitter**: [@ShopSphere](https://twitter.com/shopsphere)
- 📋 **Documentation**: [docs.shopsphere.com](https://docs.shopsphere.com)

**⭐ Don't forget to star the repository!**

</div>
