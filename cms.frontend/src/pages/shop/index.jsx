// =====================================================
// src/pages/Shop.jsx
// Trang Shop: sidebar lọc giá + danh mục, lưới sản phẩm tái sử dụng
// component ProductGrid (đã có phân trang sẵn). Đọc category từ query string
// để hỗ trợ click từ CategoryMenu ở Home (/shop?category=3).
// =====================================================
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../../components/product/ProductGrid';
import PriceFilter from '../../components/shop/PriceFilter';
import EmptyState from '../../components/common/EmptyState';
import categoryProductService from '../../services/categoryProductService';

function Shop({ onAddToCart }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [categories, setCategories] = useState([]);
    const [priceRange, setPriceRange] = useState({});

    const activeCategoryId = searchParams.get('category');
    const keyword = searchParams.get('keyword') || '';

    useEffect(() => {
        categoryProductService.getAllCategories().then(setCategories).catch(() => setCategories([]));
    }, []);

    const handleCategoryClick = (id) => {
        const next = new URLSearchParams(searchParams);
        if (id) {
            next.set('category', id);
        } else {
            next.delete('category');
        }
        setSearchParams(next);
    };

    // Tổng hợp toàn bộ filter để truyền xuống ProductGrid -> productService.getAllProducts()
    const filters = useMemo(() => ({
        categoryProductId: activeCategoryId || undefined,
        keyword: keyword || undefined,
        minPrice: priceRange.minPrice,
        maxPrice: priceRange.maxPrice,
    }), [activeCategoryId, keyword, priceRange]);

    return (
        <main className="sn-section">
            <div className="container">
                <div className="row">
                    {/* Sidebar lọc */}
                    <aside className="col-lg-3 mb-4">
                        <PriceFilter onChange={setPriceRange} />

                        <div className="sn-price-filter mt-3">
                            <h6 className="sn-price-filter__title">Danh mục</h6>
                            <ul className="list-unstyled m-0" style={{ fontSize: 14 }}>
                                <li className="mb-2">
                                    <button
                                        className="btn btn-link p-0"
                                        style={{ color: !activeCategoryId ? '#E8191A' : '#3D3D3D', fontWeight: !activeCategoryId ? 700 : 400 }}
                                        onClick={() => handleCategoryClick(null)}
                                    >
                                        Tất cả danh mục
                                    </button>
                                </li>
                                {categories.length === 0 && (
                                    <li className="text-muted" style={{ fontSize: 13 }}>Chưa có danh mục.</li>
                                )}
                                {categories.map((cat) => (
                                    <li className="mb-2" key={cat.id}>
                                        <button
                                            className="btn btn-link p-0"
                                            style={{
                                                color: String(activeCategoryId) === String(cat.id) ? '#E8191A' : '#3D3D3D',
                                                fontWeight: String(activeCategoryId) === String(cat.id) ? 700 : 400,
                                            }}
                                            onClick={() => handleCategoryClick(cat.id)}
                                        >
                                            {cat.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>

                    {/* Lưới sản phẩm */}
                    <div className="col-lg-9">
                        <ProductGrid
                            title={null}
                            filters={filters}
                            pageSize={12}
                            onAddToCart={onAddToCart}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Shop;
