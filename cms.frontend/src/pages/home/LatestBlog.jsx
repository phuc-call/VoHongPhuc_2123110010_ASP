import React, { useState, useEffect } from 'react';
import blogService from '../../services/postService';
import PostCard from '../../components/Postcard';

function LatestBlog() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatestPosts = async () => {
            try {
                setLoading(true);
                const data = await blogService.getLatestPosts(3);
                setPosts(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Lỗi hệ thống khi tải tin tức thời trang:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLatestPosts();
    }, []);

    if (loading) {
        return (
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '48px 0', fontFamily: "'Be Vietnam Pro', sans-serif"
            }}>
                <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    border: '3px solid #D9D9D9', borderTopColor: '#E8191A',
                    animation: 'spin 0.8s linear infinite', marginRight: '10px'
                }} />
                <span style={{ color: '#888888', fontSize: '14px' }}>
                    Đang tải tin tức xu hướng...
                </span>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div style={{
                textAlign: 'center', padding: '48px 0',
                fontFamily: "'Be Vietnam Pro', sans-serif"
            }}>
                <p style={{ color: '#888888', fontSize: '15px' }}>Chưa có bài viết nào.</p>
            </div>
        );
    }

    return (
        <section style={{
            padding: '48px 0',
            backgroundColor: '#F5F5F5',
            fontFamily: "'Be Vietnam Pro', sans-serif"
        }}>
            <div className="container">

                {/* Section header */}
                <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                    <h3 style={{
                        fontFamily: "'Barlow Semi Condensed', sans-serif",
                        fontWeight: 700, fontSize: '28px',
                        color: '#2C2C2C', textTransform: 'uppercase',
                        letterSpacing: '0.5px', margin: '0 0 10px'
                    }}>
                        Xu Hướng Thời Trang
                    </h3>
                    <p style={{
                        fontSize: '15px', color: '#888888',
                        margin: '0 0 14px', lineHeight: '1.6'
                    }}>
                        Cập nhật những mẹo phối đồ và tin tức phong cách mới nhất cùng ShopNhanh
                    </p>
                    {/* Accent line — dùng màu đỏ chính thay vì #11CAA0 */}
                    <div style={{
                        width: '48px', height: '3px',
                        backgroundColor: '#E8191A', margin: '0 auto'
                    }} />
                </div>

                {/* Grid bài viết */}
                <div className="row">
                    {posts.map((item) => (
                        <div className="col-lg-4 col-md-6 col-12 mb-4" key={item.id}>
                            <PostCard post={item} />
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}

export default LatestBlog;