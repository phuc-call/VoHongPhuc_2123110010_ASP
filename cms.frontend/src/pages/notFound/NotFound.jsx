// =====================================================
// src/pages/NotFound.jsx
// Trang 404 cho mọi route không khớp - tránh app crash khi gõ sai URL.
// =====================================================
import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <main className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
            <h1 style={{ fontFamily: 'var(--sn-font-display)', fontSize: 96, color: 'var(--sn-color-primary)', margin: 0 }}>404</h1>
            <p style={{ fontFamily: 'var(--sn-font-body)', color: 'var(--sn-color-text-muted)', marginBottom: 24 }}>
                Trang bạn tìm không tồn tại hoặc đã bị di chuyển.
            </p>
            <Link to="/" className="sn-btn-primary" style={{ display: 'inline-block', padding: '12px 28px', textDecoration: 'none' }}>
                Về trang chủ
            </Link>
        </main>
    );
}

export default NotFound;
