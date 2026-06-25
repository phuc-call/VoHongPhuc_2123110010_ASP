import React from 'react';
import { resolveImageUrl } from '../config/env';

function PostCard({ post }) {
    if (!post) return null;

    const imgSrc = resolveImageUrl(post.imageUrl);
    const date = post.createdDate
        ? new Date(post.createdDate).toLocaleDateString('vi-VN')
        : '';

    return (
        <div style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            border: '0.5px solid #D9D9D9',
            overflow: 'hidden',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "'Be Vietnam Pro', sans-serif"
        }}>
            {/* Ảnh */}
            <div style={{ height: '180px', overflow: 'hidden', backgroundColor: '#F5F5F5', flexShrink: 0 }}>
                <img
                    src={imgSrc}
                    alt={post.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover',
                        transition: 'transform 0.4s' }}
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                    onError={e => { e.currentTarget.src = '/assets/placeholder-product.png'; }}
                />
            </div>

            {/* Nội dung */}
            <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                {post.categoryName && (
                    <span style={{
                        display: 'inline-block', width: 'fit-content',
                        fontSize: '11px', fontWeight: 600,
                        color: '#FF8C00', border: '1px solid #FF8C00',
                        borderRadius: '4px', padding: '2px 8px', marginBottom: '6px'
                    }}>
                        {post.categoryName}
                    </span>
                )}

                <h6 style={{
                    fontSize: '15px', fontWeight: 600, color: '#2C2C2C',
                    margin: '0 0 8px', lineHeight: '1.4',
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden'
                }}>
                    {post.title}
                </h6>

                <p style={{
                    fontSize: '12px', color: '#888888',
                    margin: '0 0 12px', fontFamily: "'Roboto Mono', monospace"
                }}>
                    {date}
                </p>

                <a href={'/blog/' + post.id} style={{
                    marginTop: 'auto', textAlign: 'center', padding: '7px 0',
                    fontSize: '13px', fontWeight: 600, color: '#2C2C2C',
                    border: '1px solid #2C2C2C', borderRadius: '6px',
                    textDecoration: 'none', transition: 'background 0.2s, color 0.2s',
                    display: 'block'
                }}
                    onMouseOver={e => { e.currentTarget.style.background = '#2C2C2C'; e.currentTarget.style.color = '#fff'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#2C2C2C'; }}>
                    Đọc thêm
                </a>
            </div>
        </div>
    );
}

export default PostCard;