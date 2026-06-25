// =====================================================
// src/components/home/LatestPosts.jsx
// Khu vực Blog/Tin tức tại trang chủ, gọi API thật, click chuyển sang /blog/:id
// =====================================================
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resolveImageUrl } from '../../config/env';
import EmptyState from '../common/EmptyState';
import postService from '../../services/postService';
import './LatestPosts.css';

function formatDate(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
}

function LatestPosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        postService
            .getLatestPosts(3)
            .then(setPosts)
            .catch((err) => setErrorMessage(err.message || 'Không thể tải bài viết.'))
            .finally(() => setLoading(false));
    }, []);

    return (
        <section className="sn-section">
            <div className="container">
                <div className="sn-section__header">
                    <h2 className="sn-section__title">Tin tức &amp; Blog</h2>
                    <Link to="/blog" className="sn-section__viewall">Xem tất cả <i className="fas fa-arrow-right ml-1"></i></Link>
                </div>

                {loading && <div className="sn-loading"><div className="sn-spinner" /></div>}

                {!loading && errorMessage && (
                    <EmptyState icon="fa-triangle-exclamation" message={errorMessage} />
                )}

                {!loading && !errorMessage && posts.length === 0 && (
                    <EmptyState icon="fa-newspaper" message="Chưa có bài viết nào." />
                )}

                {!loading && !errorMessage && posts.length > 0 && (
                    <div className="row">
                        {posts.map((post) => (
                            <div className="col-md-4 mb-4" key={post.id}>
                                <Link to={`/blog/${post.id}`} className="sn-post-card">
                                    <div className="sn-post-card__media">
                                        <img
                                            src={resolveImageUrl(post.imageUrl, '/assets/placeholder-post.jpg')}
                                            alt={post.title}
                                            loading="lazy"
                                            onError={(e) => { e.target.src = '/assets/placeholder-post.jpg'; }}
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
                )}
            </div>
        </section>
    );
}

export default LatestPosts;
