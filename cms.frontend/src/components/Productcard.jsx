import React from 'react';
import { resolveImageUrl } from '../config/env';

function ProductCard({ item }) {
    if (!item) return null;

    const price = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(item.price);

    const imgSrc = resolveImageUrl(item.imageUrl);

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
            <div style={{ height: '220px', overflow: 'hidden', backgroundColor: '#F5F5F5', flexShrink: 0 }}>
                <img
                    src={imgSrc}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover',
                        transition: 'transform 0.4s' }}
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                    onError={e => { e.currentTarget.src = '/assets/placeholder-product.png'; }}
                />
            </div>

            {/* Nội dung */}
            <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                {item.categoryName && (
                    <span style={{
                        display: 'inline-block', width: 'fit-content',
                        fontSize: '11px', fontWeight: 600,
                        color: '#FF8C00', border: '1px solid #FF8C00',
                        borderRadius: '4px', padding: '2px 8px', marginBottom: '6px'
                    }}>
                        {item.categoryName}
                    </span>
                )}

                <h6 style={{
                    fontSize: '15px', fontWeight: 600, color: '#2C2C2C',
                    margin: '0 0 6px', overflow: 'hidden', textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }} title={item.name}>
                    {item.name}
                </h6>

                <p style={{
                    fontSize: '17px', fontWeight: 700, color: '#E8191A',
                    fontFamily: "'Roboto Mono', monospace", margin: '0 0 12px'
                }}>
                    {price}
                </p>

                {/* Buttons */}
                <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                    <a href={'/product/' + item.id} style={{
                        flex: 1, textAlign: 'center', padding: '7px 0',
                        fontSize: '13px', fontWeight: 600, color: '#E8191A',
                        border: '1px solid #E8191A', borderRadius: '6px',
                        textDecoration: 'none', transition: 'background 0.2s, color 0.2s'
                    }}
                        onMouseOver={e => { e.currentTarget.style.background = '#E8191A'; e.currentTarget.style.color = '#fff'; }}
                        onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#E8191A'; }}>
                        Chi tiết
                    </a>
                    <button style={{
                        flex: 1, padding: '7px 0',
                        fontSize: '13px', fontWeight: 600, color: '#FFFFFF',
                        background: '#2C2C2C', border: 'none', borderRadius: '6px',
                        cursor: 'pointer', transition: 'background 0.2s'
                    }}
                        onMouseOver={e => e.currentTarget.style.background = '#1A1A1A'}
                        onMouseOut={e => e.currentTarget.style.background = '#2C2C2C'}
                        onClick={() => alert('Đã thêm ' + item.name + ' vào giỏ hàng!')}>
                        Mua ngay
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;