// =====================================================
// src/components/home/CategoryMenu.jsx
// Danh mục sản phẩm dạng khối tròn có ảnh đại diện, gọi API thật.
// Click vào -> điều hướng sang /shop?category={id}
// =====================================================
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resolveImageUrl } from '../../config/env';
import categoryProductService from '../../services/categoryProductService';
import EmptyState from '../common/EmptyState';
import './CategoryMenu.css';

function CategoryMenu() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        categoryProductService
            .getAllCategories()
            .then(setCategories)
            .catch((err) => setErrorMessage(err.message || 'Không thể tải danh mục.'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <section className="sn-section">
                <div className="container sn-loading"><div className="sn-spinner" /></div>
            </section>
        );
    }

    if (errorMessage || categories.length === 0) {
        // Không có dữ liệu danh mục -> không chiếm chỗ trang chủ, ẩn lặng lẽ
        return null;
    }

    return (
        <section className="sn-section">
            <div className="container">
                <div className="sn-section__header">
                    <h2 className="sn-section__title">Danh mục sản phẩm</h2>
                </div>

                <div className="sn-category-menu">
                    {categories.map((cat) => (
                        <Link to={`/shop?category=${cat.id}`} key={cat.id} className="sn-category-item">
                            <span className="sn-category-item__circle">
                                <img
                                    src={resolveImageUrl(cat.imageUrl, '/assets/placeholder-category.png')}
                                    alt={cat.name}
                                    onError={(e) => { e.target.src = '/assets/placeholder-category.png'; }}
                                />
                            </span>
                            <span className="sn-category-item__name">{cat.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default CategoryMenu;
