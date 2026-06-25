// =====================================================
// src/pages/ProductDetail/ProductDetail.jsx
// Trang chi tiết sản phẩm - tích hợp gọi API add to cart thực tế.
// API: POST /api/cart/add  (CartController.cs)
// =====================================================
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { resolveImageUrl } from '../../config/env';
import productService from '../../services/productService';
import cartService from '../../services/cartService';
import EmptyState from '../../components/common/EmptyState';
import './ProductDetail.css';

// ── Giả định customerId lấy từ auth context / localStorage.
// Thay bằng useAuth() hook hoặc Context thực tế của dự án nếu có.
const CUSTOMER_ID = Number(localStorage.getItem('customerId')) || 1;

function formatCurrency(value) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);
}

function ProductDetail({ onCartUpdate }) {
    const { id } = useParams();
    const [product, setProduct]           = useState(null);
    const [loading, setLoading]           = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [quantity, setQuantity]         = useState(1);
    const [stockWarning, setStockWarning] = useState(null);
    const [addStatus, setAddStatus]       = useState(null); // 'loading' | 'success' | 'error'
    const [addMessage, setAddMessage]     = useState('');

    useEffect(() => {
        setLoading(true);
        setErrorMessage(null);
        setQuantity(1);
        setStockWarning(null);
        setAddStatus(null);
        setAddMessage('');

        productService
            .getProductDetail(id)
            .then(setProduct)
            .catch((err) => setErrorMessage(err.message || 'Không thể tải thông tin sản phẩm.'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleQuantityChange = (value) => {
        const num = Math.max(1, Number(value) || 1);
        setQuantity(num);
        setStockWarning(null);
        setAddStatus(null);
    };

    // ── Gọi POST /api/cart/add
    const handleAddToCart = async () => {
        if (!product) return;

        // Kiểm tra phía client trước khi gọi API
        if (quantity > product.stockQuantity) {
            setStockWarning(`Chỉ còn ${product.stockQuantity} sản phẩm trong kho!`);
            return;
        }

        setAddStatus('loading');
        setAddMessage('');
        setStockWarning(null);

        try {
            const response = await cartService.addToCart({
                customerId: CUSTOMER_ID,
                productId: Number(id),
                quantity,
            });

            setAddStatus('success');
            setAddMessage(response.message || 'Đã thêm vào giỏ hàng!');

            // Cập nhật stockQuantity hiển thị theo remainingStock trả về từ API
            if (response.remainingStock !== undefined) {
                setProduct((prev) => ({ ...prev, stockQuantity: response.remainingStock }));
            }

            // Thông báo lên App để cập nhật badge số lượng giỏ hàng ở Header
            onCartUpdate?.();

        } catch (err) {
            setAddStatus('error');
            // Backend trả về message lỗi trong response body (Bad Request)
            const serverMsg = err?.response?.data?.message;
            setAddMessage(serverMsg || 'Thêm vào giỏ hàng thất bại, vui lòng thử lại.');
        }
    };

    // ────────────────── Render ──────────────────
    if (loading) {
        return (
            <div className="container sn-loading" style={{ padding: '80px 0' }}>
                <div className="sn-spinner" />
            </div>
        );
    }

    if (errorMessage || !product) {
        return (
            <div className="container" style={{ padding: '60px 0' }}>
                <EmptyState
                    icon="fa-circle-exclamation"
                    message={errorMessage || 'Không tìm thấy sản phẩm.'}
                />
            </div>
        );
    }

    const isOutOfStock = product.stockQuantity === 0;

    return (
        <main className="sn-section">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Barlow+Semi+Condensed:wght@500;600;700&family=Be+Vietnam+Pro:wght@400;500;600&family=Roboto+Mono:wght@500;700&display=swap');

                :root {
                    --color-primary:  #E8191A;
                    --color-secondary:#2C2C2C;
                    --color-bg:       #F5F5F5;
                    --color-dark:     #1A1A1A;
                    --color-accent:   #FF8C00;
                    --color-border:   #D9D9D9;
                    --color-white:    #FFFFFF;
                    --color-body:     #3D3D3D;
                    --color-muted:    #888888;
                }

                .sn-section { padding: 48px 0 80px; background: var(--color-bg); font-family: 'Be Vietnam Pro', sans-serif; }

                .sn-breadcrumb { font-size: 13px; color: var(--color-muted); margin-bottom: 32px; }
                .sn-breadcrumb a { color: var(--color-muted); text-decoration: none; }
                .sn-breadcrumb a:hover { color: var(--color-primary); }
                .sn-breadcrumb span { color: var(--color-body); font-weight: 500; }

                /* Media */
                .sn-product-detail__media {
                    background: var(--color-white);
                    border: 1px solid var(--color-border);
                    border-radius: 12px;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 420px;
                }
                .sn-product-detail__media img {
                    width: 100%;
                    height: 420px;
                    object-fit: contain;
                    padding: 16px;
                }

                /* Info panel */
                .sn-product-detail__title {
                    font-family: 'Barlow Semi Condensed', sans-serif;
                    font-size: 32px;
                    font-weight: 700;
                    color: var(--color-secondary);
                    margin-bottom: 8px;
                }
                .sn-product-detail__category {
                    display: inline-block;
                    font-size: 12px;
                    font-weight: 600;
                    color: var(--color-accent);
                    background: rgba(255,140,0,.1);
                    border-radius: 4px;
                    padding: 3px 10px;
                    margin-bottom: 18px;
                    text-transform: uppercase;
                    letter-spacing: .5px;
                }
                .sn-product-detail__price {
                    font-family: 'Roboto Mono', monospace;
                    font-size: 28px;
                    font-weight: 700;
                    color: var(--color-primary);
                    margin-bottom: 12px;
                }
                .sn-product-detail__stock {
                    font-size: 14px;
                    font-weight: 500;
                    color: #16a34a;
                    margin-bottom: 20px;
                }
                .sn-product-detail__stock.is-out { color: var(--color-primary); }

                .sn-product-detail__description {
                    font-size: 15px;
                    color: var(--color-body);
                    line-height: 1.75;
                    padding: 20px;
                    background: var(--color-white);
                    border: 1px solid var(--color-border);
                    border-radius: 8px;
                    margin-bottom: 28px;
                }

                /* Quantity + button row */
                .sn-product-detail__actions {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    flex-wrap: wrap;
                }

                .sn-qty-input {
                    display: flex;
                    align-items: center;
                    border: 1px solid var(--color-border);
                    border-radius: 6px;
                    overflow: hidden;
                    background: var(--color-white);
                }
                .sn-qty-input button {
                    width: 40px;
                    height: 44px;
                    border: none;
                    background: var(--color-bg);
                    font-size: 18px;
                    cursor: pointer;
                    color: var(--color-secondary);
                    transition: background .15s;
                }
                .sn-qty-input button:hover { background: var(--color-border); }
                .sn-qty-input input {
                    width: 56px;
                    height: 44px;
                    border: none;
                    border-left: 1px solid var(--color-border);
                    border-right: 1px solid var(--color-border);
                    text-align: center;
                    font-family: 'Roboto Mono', monospace;
                    font-size: 15px;
                    font-weight: 700;
                    color: var(--color-secondary);
                    outline: none;
                }
                .sn-qty-input input::-webkit-outer-spin-button,
                .sn-qty-input input::-webkit-inner-spin-button { -webkit-appearance: none; }

                .sn-btn-primary {
                    background: var(--color-primary);
                    color: var(--color-white);
                    border: none;
                    border-radius: 6px;
                    padding: 12px 28px;
                    font-family: 'Be Vietnam Pro', sans-serif;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background .2s, opacity .2s;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }
                .sn-btn-primary:hover { background: #c91314; }
                .sn-btn-primary:disabled { opacity: .6; cursor: not-allowed; }

                /* Status messages */
                .sn-product-detail__warning {
                    margin-top: 14px;
                    font-size: 13px;
                    color: var(--color-primary);
                    font-weight: 500;
                }
                .sn-product-detail__feedback {
                    margin-top: 14px;
                    padding: 10px 16px;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .sn-product-detail__feedback.success {
                    background: #f0fdf4;
                    color: #16a34a;
                    border: 1px solid #bbf7d0;
                }
                .sn-product-detail__feedback.error {
                    background: #fff1f2;
                    color: var(--color-primary);
                    border: 1px solid #fecdd3;
                }

                /* Divider */
                .sn-divider {
                    height: 1px;
                    background: var(--color-border);
                    margin: 24px 0;
                }

                /* Out of stock badge */
                .sn-out-badge {
                    display: inline-block;
                    background: var(--color-bg);
                    border: 1px solid var(--color-border);
                    color: var(--color-muted);
                    font-size: 14px;
                    font-weight: 500;
                    padding: 12px 24px;
                    border-radius: 6px;
                    cursor: not-allowed;
                }
            `}</style>

            <div className="container">
                <nav className="sn-breadcrumb">
                    <Link to="/">Trang chủ</Link>{' '}
                    /{' '}
                    <Link to="/shop">Cửa hàng</Link>{' '}
                    /{' '}
                    <span>{product.name}</span>
                </nav>

                <div className="row">
                    {/* Ảnh sản phẩm */}
                    <div className="col-lg-6 mb-4">
                        <div className="sn-product-detail__media">
                            <img
                                src={resolveImageUrl(product.imageUrl)}
                                alt={product.name}
                                onError={(e) => { e.target.src = '/assets/placeholder-product.png'; }}
                            />
                        </div>
                    </div>

                    {/* Thông tin sản phẩm */}
                    <div className="col-lg-6">
                        <h1 className="sn-product-detail__title">{product.name}</h1>

                        {product.categoryName && (
                            <span className="sn-product-detail__category">{product.categoryName}</span>
                        )}

                        <p className="sn-product-detail__price">{formatCurrency(product.price)}</p>

                        <p className={`sn-product-detail__stock ${isOutOfStock ? 'is-out' : ''}`}>
                            {isOutOfStock
                                ? 'Hết hàng'
                                : `Còn ${product.stockQuantity} sản phẩm trong kho`}
                        </p>

                        <div className="sn-divider" />

                        {/* Mô tả đầy đủ */}
                        <div className="sn-product-detail__description">
                            {product.description || 'Sản phẩm chưa có mô tả chi tiết.'}
                        </div>

                        {/* Điều khiển số lượng + nút thêm giỏ */}
                        {isOutOfStock ? (
                            <span className="sn-out-badge">
                                <i className="fas fa-ban mr-2"></i> Tạm hết hàng
                            </span>
                        ) : (
                            <div className="sn-product-detail__actions">
                                <div className="sn-qty-input">
                                    <button
                                        onClick={() => handleQuantityChange(quantity - 1)}
                                        aria-label="Giảm số lượng"
                                    >
                                        −
                                    </button>
                                    <input
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => handleQuantityChange(e.target.value)}
                                    />
                                    <button
                                        onClick={() => handleQuantityChange(quantity + 1)}
                                        aria-label="Tăng số lượng"
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    className="sn-btn-primary"
                                    onClick={handleAddToCart}
                                    disabled={addStatus === 'loading'}
                                >
                                    {addStatus === 'loading' ? (
                                        <>
                                            <i className="fas fa-circle-notch fa-spin"></i> Đang thêm...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-cart-plus"></i> Thêm vào giỏ
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Cảnh báo tồn kho (kiểm tra phía client) */}
                        {stockWarning && (
                            <p className="sn-product-detail__warning">
                                <i className="fas fa-triangle-exclamation mr-1"></i> {stockWarning}
                            </p>
                        )}

                        {/* Kết quả từ API */}
                        {addStatus === 'success' && (
                            <div className="sn-product-detail__feedback success">
                                <i className="fas fa-circle-check"></i> {addMessage}
                            </div>
                        )}
                        {addStatus === 'error' && (
                            <div className="sn-product-detail__feedback error">
                                <i className="fas fa-circle-exclamation"></i> {addMessage}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

export default ProductDetail;