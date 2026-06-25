import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { resolveImageUrl, PAGE_SIZE } from '../../config/env';
import postService from '../../services/postService';
import EmptyState from '../../components/common/EmptyState';
import '../../components/home/LatestPosts.css';

function formatDate(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
}

function Blog() {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeCategoryId = searchParams.get('category');

    const [posts, setPosts] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [categories, setCategories] = useState([]);

    const observerRef = useRef(null);
    const sentinelRef = useRef(null);

    // Load danh mục bài viết — gọi GET /api/posts/category không phải categories sản phẩm
    // Backend hiện chưa có API danh mục bài viết riêng nên dùng blogService nếu có,
    // tạm thời hardcode hoặc bỏ trống — chỉ cần bổ sung sau
    useEffect(() => {
        // Nếu có API: postCategoryService.getAll().then(setCategories)
        // Tạm thời để trống, sidebar vẫn render
        setCategories([]);
    }, []);

    // Reset khi đổi danh mục
    useEffect(() => {
        setPosts([]);
        setCurrentPage(1);
        setHasMore(true);
        setErrorMessage(null);
    }, [activeCategoryId]);

    const fetchPosts = useCallback((page) => {
        setLoading(true);
        const request = activeCategoryId
            ? postService.getPostsByCategory(activeCategoryId, { page, pageSize: PAGE_SIZE })
            : postService.getAllPosts({ page, pageSize: PAGE_SIZE });

        request
            .then((data) => {
                const items = Array.isArray(data) ? data : (data.items || []);
                const total = Array.isArray(data) ? data.length : (data.totalCount ?? items.length);
                setPosts(prev => page === 1 ? items : [...prev, ...items]);
                setTotalCount(total);
                setHasMore(page * PAGE_SIZE < total);
            })
            .catch(err => setErrorMessage(err.message || 'Không thể tải bài viết.'))
            .finally(() => setLoading(false));
    }, [activeCategoryId]);

    useEffect(() => {
        fetchPosts(currentPage);
    }, [currentPage, fetchPosts]);

    // Intersection Observer
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

    const handleCategoryClick = (id) => {
        const next = new URLSearchParams(searchParams);
        if (id) next.set('category', id);
        else next.delete('category');
        setSearchParams(next);
    };

    return (
        <main className="sn-section">
            <div className="container">
                <div className="row">
                    {/* Sidebar danh mục */}
                    <aside className="col-lg-3 mb-4">
                        <div className="sn-price-filter">
                            <h6 className="sn-price-filter__title">Chuyên mục</h6>
                            <ul className="list-unstyled m-0" style={{ fontSize: 14 }}>
                                <li className="mb-2">
                                    <button className="btn btn-link p-0"
                                        style={{
                                            color: !activeCategoryId ? '#E8191A' : '#3D3D3D',
                                            fontWeight: !activeCategoryId ? 700 : 400
                                        }}
                                        onClick={() => handleCategoryClick(null)}>
                                        Tất cả
                                    </button>
                                </li>
                                {categories.map(cat => (
                                    <li className="mb-2" key={cat.id}>
                                        <button className="btn btn-link p-0"
                                            style={{
                                                color: String(activeCategoryId) === String(cat.id) ? '#E8191A' : '#3D3D3D',
                                                fontWeight: String(activeCategoryId) === String(cat.id) ? 700 : 400
                                            }}
                                            onClick={() => handleCategoryClick(cat.id)}>
                                            {cat.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>

                    {/* Lưới bài viết */}
                    <div className="col-lg-9">
                        <div className="sn-section__header">
                            <h2 className="sn-section__title">Tin tức &amp; Blog</h2>
                            {totalCount > 0 && <span className="sn-section__count">{totalCount} bài viết</span>}
                        </div>

                        {errorMessage && (
                            <EmptyState icon="fa-triangle-exclamation" message={errorMessage}
                                actionLabel="Thử lại" onAction={() => fetchPosts(currentPage)} />
                        )}

                        {!loading && !errorMessage && posts.length === 0 && (
                            <EmptyState icon="fa-newspaper" message="Chưa có bài viết nào." />
                        )}

                        <div className="row">
                            {posts.map((post) => (
                                <div className="col-md-4 mb-4" key={post.id}>
                                    <Link to={`/blog/${post.id}`} className="sn-post-card">
                                        <div className="sn-post-card__media">
                                            <img
                                                src={resolveImageUrl(post.imageUrl, '/assets/placeholder-post.jpg')}
                                                alt={post.title}
                                                loading="lazy"
                                                onError={e => { e.target.src = '/assets/placeholder-post.jpg'; }}
                                            />
                                            {post.categoryName && (
                                                <span className="sn-post-card__tag">{post.categoryName}</span>
                                            )}
                                        </div>
                                        <div className="sn-post-card__body">
                                            <span className="sn-post-card__date">{formatDate(post.createdDate)}</span>
                                            <h3 className="sn-post-card__title">{post.title}</h3>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>

                        {loading && (
                            <div className="sn-loading"><div className="sn-spinner" /></div>
                        )}

                        <div ref={sentinelRef} style={{ height: '1px' }} />

                        {!hasMore && posts.length > 0 && (
                            <p style={{ textAlign: 'center', color: '#888', fontSize: '14px', padding: '16px 0' }}>
                                Đã hiển thị tất cả {totalCount} bài viết
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Blog;