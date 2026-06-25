// =====================================================
// src/components/product/ProductCard.jsx
// Thẻ sản phẩm dùng chung cho Home, Shop, kết quả Search...
// Toàn bộ URL ảnh đi qua resolveImageUrl() -> không hardcode domain.
// Chuyển trang dùng <Link> của react-router -> không reload trang.
// =====================================================
import React from 'react';
import { Link } from 'react-router-dom';
import { resolveImageUrl } from '../../config/env';
import './ProductCard.css';

function formatCurrency(value) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);
}

function ProductCard({ item, onAddToCart }) {
    if (!item) return null;

    const isLowStock = item.stockQuantity > 0 && item.stockQuantity <= 5;
    const isOutOfStock = item.stockQuantity === 0;

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isOutOfStock) return;
        onAddToCart?.(item);
    };

    return (
        <div className="sn-product-card">
            <Link to={`/product/${item.id}`} className="sn-product-card__media">
                <img
                    src={resolveImageUrl(item.imageUrl)}
                    alt={item.name}
                    loading="lazy"
                    onError={(e) => { e.target.src = '/assets/placeholder-product.png'; }}
                />

                {isOutOfStock && (
                    <span className="sn-product-card__badge sn-product-card__badge--soldout">
                        Hết hàng
                    </span>
                )}
                {!isOutOfStock && isLowStock && (
                    <span className="sn-product-card__badge sn-product-card__badge--low">
                        Còn {item.stockQuantity}
                    </span>
                )}

                {item.categoryName && (
                    <span className="sn-product-card__tag">{item.categoryName}</span>
                )}
            </Link>

            <div className="sn-product-card__body">
                <Link to={`/product/${item.id}`} className="sn-product-card__title" title={item.name}>
                    {item.name}
                </Link>

                <div className="sn-product-card__footer">
                    <span className="sn-product-card__price">{formatCurrency(item.price)}</span>
                    <button
                        className="sn-product-card__cart-btn"
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                        aria-label={`Thêm ${item.name} vào giỏ`}
                    >
                        <i className="fas fa-cart-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;
