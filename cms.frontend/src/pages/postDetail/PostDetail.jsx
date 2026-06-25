import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { resolveImageUrl } from '../../config/env';
import postService from '../../services/postService';
import './PostDetail.css';

function formatDate(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
}

function PostDetail() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        postService.getPostDetail(id)
            .then(data => setPost(data))
            .catch(err => setError(err.message || 'Không thể tải bài viết.'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div style={{
                display: 'flex', justifyContent: 'center',
                padding: '80px 0', fontFamily: "'Be Vietnam Pro', sans-serif"
            }}>
                <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    border: '3px solid #D9D9D9', borderTopColor: '#E8191A',
                    animation: 'spin 0.8s linear infinite'
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div style={{ textAlign: 'center', padding: '60px 0',
                fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                <p style={{ color: '#888', fontSize: '15px' }}>
                    {error || 'Không tìm thấy bài viết.'}
                </p>
                <Link to="/blog" style={{ color: '#E8191A', fontSize: '14px' }}>
                    ← Quay lại danh sách
                </Link>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#F5F5F5', minHeight: '100vh',
            fontFamily: "'Be Vietnam Pro', sans-serif" }}>
            <div className="container" style={{ maxWidth: '820px', padding: '40px 16px' }}>

                {/* Breadcrumb */}
                <nav style={{ fontSize: '13px', color: '#888888', marginBottom: '24px' }}>
                    <Link to="/" style={{ color: '#888', textDecoration: 'none' }}>Trang chủ</Link>
                    <span style={{ margin: '0 8px' }}>›</span>
                    <Link to="/blog" style={{ color: '#888', textDecoration: 'none' }}>Tin tức</Link>
                    <span style={{ margin: '0 8px' }}>›</span>
                    <span style={{ color: '#2C2C2C' }}>{post.title}</span>
                </nav>

                {/* Article */}
                <article style={{
                    background: '#fff', borderRadius: '12px',
                    border: '0.5px solid #D9D9D9', padding: '32px 40px'
                }}>
                    {/* Category badge */}
                    {post.categoryName && (
                        <span style={{
                            display: 'inline-block', fontSize: '12px', fontWeight: 600,
                            color: '#fff', background: '#FF8C00',
                            padding: '4px 12px', borderRadius: '4px',
                            textTransform: 'uppercase', marginBottom: '16px'
                        }}>
                            {post.categoryName}
                        </span>
                    )}

                    {/* Title */}
                    <h1 style={{
                        fontFamily: "'Barlow Semi Condensed', sans-serif",
                        fontSize: '32px', fontWeight: 700,
                        color: '#2C2C2C', lineHeight: 1.3, marginBottom: '10px'
                    }}>
                        {post.title}
                    </h1>

                    {/* Date */}
                    <p style={{
                        fontFamily: "'Roboto Mono', monospace",
                        fontSize: '13px', color: '#888888', marginBottom: '24px'
                    }}>
                        {formatDate(post.createdDate)}
                    </p>

                    <hr style={{ borderColor: '#D9D9D9', marginBottom: '24px' }} />

                    {/* Cover image */}
                    {post.imageUrl && (
                        <div style={{ borderRadius: '10px', overflow: 'hidden', marginBottom: '28px' }}>
                            <img
                                src={resolveImageUrl(post.imageUrl)}
                                alt={post.title}
                                style={{ width: '100%', display: 'block', maxHeight: '420px', objectFit: 'cover' }}
                                onError={e => { e.currentTarget.style.display = 'none'; }}
                            />
                        </div>
                    )}

                    {/* Content HTML từ Quill/CKEditor */}
                    <div
                        style={{
                            fontSize: '15px', lineHeight: '1.8',
                            color: '#3D3D3D'
                        }}
                        dangerouslySetInnerHTML={{ __html: post.content || '<p>Chưa có nội dung.</p>' }}
                    />

                    <hr style={{ borderColor: '#D9D9D9', marginTop: '32px', marginBottom: '20px' }} />

                    {/* Back button */}
                    <Link to="/blog" style={{
                        display: 'inline-block', padding: '9px 20px',
                        fontSize: '14px', fontWeight: 600,
                        color: '#fff', background: '#2C2C2C',
                        borderRadius: '6px', textDecoration: 'none',
                        transition: 'background .2s'
                    }}
                        onMouseOver={e => e.currentTarget.style.background = '#1A1A1A'}
                        onMouseOut={e => e.currentTarget.style.background = '#2C2C2C'}>
                        ← Quay lại danh sách
                    </Link>
                </article>

            </div>
        </div>
    );
}

export default PostDetail;