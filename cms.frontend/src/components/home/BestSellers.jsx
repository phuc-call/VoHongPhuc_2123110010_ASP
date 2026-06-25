// =====================================================
// src/components/home/BestSellers.jsx
// Khu vực "Sản phẩm Hot / Bán chạy" - gọi API riêng lấy top sản phẩm bán chạy.
// Dùng nền dark section (#1A1A1A) theo bảng màu để tạo điểm nhấn phân vùng.
// =====================================================
import React, { useState, useEffect } from 'react';
import ProductCard from '../product/ProductCard';
import EmptyState from '../common/EmptyState';
import productService from '../../services/productService';

function BestSellers({ onAddToCart }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        productService
            .getBestSellerProducts(3)
            .then(setProducts)
            .catch((err) => setErrorMessage(err.message || 'Không thể tải sản phẩm bán chạy.'))
            .finally(() => setLoading(false));
    }, []);

    return (
        <section className="sn-section sn-section--dark">
            <div className="container">
                <div className="sn-section__header" style={{ borderBottomColor: 'rgba(255,255,255,0.15)' }}>
                    <h2 className="sn-section__title">
                        <i className="fas fa-fire mr-2" style={{ color: '#FF8C00' }}></i>
                        Bán chạy nhất
                    </h2>
                </div>

                {loading && <div className="sn-loading"><div className="sn-spinner" /></div>}

                {!loading && errorMessage && (
                    <EmptyState icon="fa-triangle-exclamation" message={errorMessage} />
                )}

                {!loading && !errorMessage && products.length === 0 && (
                    <EmptyState icon="fa-box-open" message="Chưa có dữ liệu sản phẩm bán chạy." />
                )}

                {!loading && !errorMessage && products.length > 0 && (
                    <div className="row">
                        {products.map((item) => (
                            <div className="col-lg-4 col-sm-6 col-12 mb-4" key={item.id}>
                                <ProductCard item={item} onAddToCart={onAddToCart} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default BestSellers;
