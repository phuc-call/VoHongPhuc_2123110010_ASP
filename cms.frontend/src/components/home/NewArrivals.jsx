// =====================================================
// src/components/home/NewArrivals.jsx
// Khu vực riêng biệt: gọi API lấy 3 sản phẩm MỚI NHẤT và render thẻ sản phẩm.
// =====================================================
import React, { useState, useEffect } from 'react';
import ProductCard from '../product/ProductCard';
import EmptyState from '../common/EmptyState';
import productService from '../../services/productService';

function NewArrivals({ onAddToCart }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        productService
            .getLatestProducts(3)
            .then(setProducts)
            .catch((err) => setErrorMessage(err.message || 'Không thể tải sản phẩm mới.'))
            .finally(() => setLoading(false));
    }, []);

    return (
        <section className="sn-section">
            <div className="container">
                <div className="sn-section__header">
                    <h2 className="sn-section__title">Sản phẩm mới</h2>
                </div>

                {loading && <div className="sn-loading"><div className="sn-spinner" /></div>}

                {!loading && errorMessage && (
                    <EmptyState icon="fa-triangle-exclamation" message={errorMessage} />
                )}

                {!loading && !errorMessage && products.length === 0 && (
                    <EmptyState icon="fa-box-open" message="Chưa có sản phẩm mới nào." />
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

export default NewArrivals;
