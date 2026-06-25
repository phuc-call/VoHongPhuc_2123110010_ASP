// =====================================================
// src/pages/ProductDetail.jsx
// Trang chi tiết sản phẩm RIÊNG BIỆT (route /product/:id).
// Hiển thị trọn vẹn mô tả sản phẩm, kiểm tra tồn kho khi đặt mua.
// =====================================================
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { resolveImageUrl } from '../../config/env';
import productService from '../services/productService';
import EmptyState from '../../components/common/EmptyState';
import './ProductDetail.css';

function formatCurrency(value) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);
}

function ProductDetail({ onAddToCart }) {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [stockWarning, setStockWarning] = useState(null);

    useEffect(() => {
        setLoading(true);
        setErrorMessage(null);
        setQuantity(1);
        setStockWarning(null);

        productService
            .getProductDetail(id)
            .then(setProduct)
            .catch((err) => setErrorMessage(err.message || 'Không thể tải thông tin sản phẩm.'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleQuantityChange = (value) => {
        const num = Math.max(1, Number(value) || 1);
        setQuantity(num);
        setStockWarning(null);
    };

    const handleAddToCart = () => {
        if (!product) return;
        if (quantity > product.stockQuantity) {
            setStockWarning('Số lượng sản phẩm trong kho không đủ!');
            return;
        }
        onAddToCart?.(product, quantity);
    };

    if (loading) {
        return <div className="container sn-loading" style={{ padding: '80px 0' }}><div className="sn-spinner" /></div>;
    }

    if (errorMessage || !product) {
        return (
            <div className="container" style={{ padding: '60px 0' }}>
                <EmptyState icon="fa-circle-exclamation" message={errorMessage || 'Không tìm thấy sản phẩm.'} />
            </div>
        );
    }

    const isOutOfStock = product.stockQuantity === 0;

    return (
        <main className="sn-section">
            <div className="container">
                <nav className="sn-breadcrumb">
                    <Link to="/">Trang chủ</Link> / <Link to="/shop">Cửa hàng</Link> / <span>{product.name}</span>
                </nav>

                <div className="row">
                    <div className="col-lg-6 mb-4">
                        <div className="sn-product-detail__media">
                            <img
                                src={resolveImageUrl(product.imageUrl)}
                                alt={product.name}
                                onError={(e) => { e.target.src = '/assets/placeholder-product.png'; }}
                            />
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <h1 className="sn-product-detail__title">{product.name}</h1>

                        {product.categoryName && (
                            <span className="sn-product-detail__category">{product.categoryName}</span>
                        )}

                        <p className="sn-product-detail__price">{formatCurrency(product.price)}</p>

                        <p className={`sn-product-detail__stock ${isOutOfStock ? 'is-out' : ''}`}>
                            {isOutOfStock ? 'Hết hàng' : `Còn ${product.stockQuantity} sản phẩm trong kho`}
                        </p>

                        {/* Mô tả sản phẩm trọn vẹn, không bị cắt ngắn */}
                        <div className="sn-product-detail__description">
                            {product.description || 'Sản phẩm chưa có mô tả chi tiết.'}
                        </div>

                        {!isOutOfStock && (
                            <div className="sn-product-detail__actions">
                                <div className="sn-qty-input">
                                    <button onClick={() => handleQuantityChange(quantity - 1)} aria-label="Giảm số lượng">−</button>
                                    <input
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => handleQuantityChange(e.target.value)}
                                    />
                                    <button onClick={() => handleQuantityChange(quantity + 1)} aria-label="Tăng số lượng">+</button>
                                </div>

                                <button className="sn-btn-primary" onClick={handleAddToCart}>
                                    <i className="fas fa-cart-plus mr-2"></i> Mua ngay
                                </button>
                            </div>
                        )}

                        {stockWarning && (
                            <p className="sn-product-detail__warning">
                                <i className="fas fa-triangle-exclamation mr-1"></i> {stockWarning}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

export default ProductDetail;
