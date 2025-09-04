from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List, Optional
from ..models.product import Product
from ..schemas.product import ProductCreate, ProductUpdate, ProductResponse

class ProductService:
    def __init__(self, db: Session):
        self.db = db

    async def get_products(self, skip: int = 0, limit: int = 10, 
                          category: Optional[str] = None, 
                          search: Optional[str] = None) -> List[Product]:
        """Get products with filtering and pagination"""
        query = self.db.query(Product).filter(Product.is_active == True)
        
        if category:
            query = query.filter(Product.category == category)
        
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                (Product.name.ilike(search_term)) | 
                (Product.description.ilike(search_term))
            )
        
        return query.offset(skip).limit(limit).all()

    async def get_product_by_id(self, product_id: int) -> Optional[Product]:
        """Get product by ID"""
        return self.db.query(Product).filter(
            Product.id == product_id, 
            Product.is_active == True
        ).first()

    async def create_product(self, product_data: ProductCreate) -> Product:
        """Create a new product"""
        db_product = Product(**product_data.dict())
        self.db.add(db_product)
        self.db.commit()
        self.db.refresh(db_product)
        return db_product

    async def update_product(self, product_id: int, product_update: ProductUpdate) -> Optional[Product]:
        """Update an existing product"""
        db_product = self.db.query(Product).filter(Product.id == product_id).first()
        
        if not db_product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found"
            )
        
        update_data = product_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_product, field, value)
        
        self.db.commit()
        self.db.refresh(db_product)
        return db_product

    async def delete_product(self, product_id: int) -> bool:
        """Soft delete a product"""
        db_product = self.db.query(Product).filter(Product.id == product_id).first()
        
        if not db_product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found"
            )
        
        # Soft delete
        db_product.is_active = False
        self.db.commit()
        return True

    async def get_categories(self) -> List[str]:
        """Get all product categories"""
        categories = self.db.query(Product.category).filter(
            Product.category.isnot(None),
            Product.is_active == True
        ).distinct().all()
        
        return [category[0] for category in categories if category[0]]

    async def get_featured_products(self, limit: int = 8) -> List[Product]:
        """Get featured products (most popular or newest)"""
        return self.db.query(Product).filter(
            Product.is_active == True
        ).order_by(Product.created_at.desc()).limit(limit).all()

    async def search_products(self, query: str, limit: int = 20) -> List[Product]:
        """Search products by name and description"""
        search_term = f"%{query}%"
        return self.db.query(Product).filter(
            Product.is_active == True,
            (Product.name.ilike(search_term)) | 
            (Product.description.ilike(search_term))
        ).limit(limit).all()

    async def get_products_by_category(self, category: str, limit: int = 20) -> List[Product]:
        """Get products by category"""
        return self.db.query(Product).filter(
            Product.category == category,
            Product.is_active == True
        ).limit(limit).all()

    async def update_stock(self, product_id: int, quantity_change: int) -> bool:
        """Update product stock quantity"""
        db_product = self.db.query(Product).filter(Product.id == product_id).first()
        
        if not db_product:
            return False
        
        new_quantity = db_product.stock_quantity + quantity_change
        if new_quantity < 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Insufficient stock"
            )
        
        db_product.stock_quantity = new_quantity
        self.db.commit()
        return True

    async def check_stock_availability(self, product_id: int, requested_quantity: int) -> bool:
        """Check if product has sufficient stock"""
        product = await self.get_product_by_id(product_id)
        
        if not product:
            return False
        
        return product.stock_quantity >= requested_quantity