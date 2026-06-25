import React, { useState, useEffect, useCallback, useRef } from 'react';
import ProductCard from './ProductCard';
import EmptyState from '../common/EmptyState';
import { PAGE_SIZE } from '../../config/env';
import productService from '../../services/productService';

function ProductGrid({ title = 'Sản phẩm nổi bật', filters = {}, pageSize = PAGE_SIZE, onAddToCart }) {
    const [products, setProducts] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const observerRef = useRef(null);
    const sentinelRef = useRef(null);

    // Reset khi filter thay đổi
    const filtersKey = JSON.stringify(filters);
    useEffect(() => {
        setProducts([]);
        setCurrentPage(1);
        setHasMore(true);
        setErrorMessage(null);
    }, [filtersKey]);

    const fetchProducts = useCallback((page) => {
        setLoading(true);
        productService
            .getAllProducts({ page, pageSize, ...filters })
            .then((data) => {
                const items = Array.isArray(data) ? data : (data.items || []);
                const total = Array.isArray(data) ? data.length : (data.totalCount ?? items.length);
                setProducts(prev => page === 1 ? items : [...prev, ...items]);
                setTotalCount(total);
                setHasMore(page * pageSize < total);
            })
            .catch((err) => setErrorMessage(err.message || 'Không thể tải danh sách sản phẩm.'))
            .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageSize, filtersKey]);

    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage, fetchProducts]);

    // Intersection Observer theo dõi sentinel
    useEffect(() => {
        if (observerRef.current) observerRef.current.disconnect();
        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !loading) {
                setCurrentPage(prev => prev + 1);
            }
        }, { threshold: 0.1 });
        if (sentinelRef.current) observerRef.current.observe(sentinelRef.current);
        return () => observerRef.current?.disconnect();
    }, [hasMore, loading]);

    return (
        <section className="sn-section">
            <div className="container">
                {title && (
                    <div className="sn-section__header">
                        <h2 className="sn-section__title">{title}</h2>
                        {totalCount > 0 && <span className="sn-section__count">{totalCount} sản phẩm</span>}
                    </div>
                )}

                {errorMessage && (
                    <EmptyState icon="fa-triangle-exclamation" message={errorMessage}
                        actionLabel="Thử lại" onAction={() => fetchProducts(currentPage)} />
                )}

                {!loading && !errorMessage && products.length === 0 && (
                    <EmptyState icon="fa-magnifying-glass"
                        message="Không tìm thấy sản phẩm nào phù hợp." />
                )}

                <div className="row">
                    {products.map((item) => (
                        <div className="col-xl-3 col-lg-4 col-sm-6 col-12 mb-4" key={item.id}>
                            <ProductCard item={item} onAddToCart={onAddToCart} />
                        </div>
                    ))}
                </div>

                {/* Spinner load thêm */}
                {loading && (
                    <div className="sn-loading">
                        <div className="sn-spinner" />
                    </div>
                )}

                {/* Sentinel — khi scroll tới đây thì load page tiếp */}
                <div ref={sentinelRef} style={{ height: '1px' }} />

                {!hasMore && products.length > 0 && (
                    <p style={{ textAlign: 'center', color: '#888', fontSize: '14px', padding: '16px 0' }}>
                        Đã hiển thị tất cả {totalCount} sản phẩm
                    </p>
                )}
            </div>
        </section>
    );
}

export default ProductGrid;