// =====================================================
// src/pages/cart/index.jsx
// Trang Giỏ Hàng - tích hợp đầy đủ CartController API:
//   GET    /api/cart/customer/{id}         → hiển thị giỏ
//   PUT    /api/cart/item/{cartItemId}     → cập nhật số lượng
//   DELETE /api/cart/item/{cartItemId}     → xóa 1 sản phẩm
//   DELETE /api/cart/customer/{id}/clear  → xóa toàn bộ giỏ
// =====================================================
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import cartService from '../../services/cartService';

// ── Giả định customerId từ auth/localStorage (thay bằng useAuth nếu có)
const CUSTOMER_ID = Number(localStorage.getItem('customerId')) || 1;

function formatCurrency(value) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);
}

// ── Component hiển thị trạng thái giỏ trống
function EmptyCart() {
    return (
        <div className="sn-cart-empty">
            <div className="sn-cart-empty__icon">
                <i className="fas fa-shopping-bag"></i>
            </div>
            <h3 className="sn-cart-empty__title">Giỏ hàng đang trống</h3>
            <p className="sn-cart-empty__desc">Bạn chưa thêm sản phẩm nào vào giỏ.</p>
            <Link to="/shop" className="sn-btn-primary">
                <i className="fas fa-store mr-2"></i> Tiếp tục mua sắm
            </Link>
        </div>
    );
}

// ── Component 1 dòng sản phẩm trong giỏ
function CartRow({ item, onQtyChange, onRemove, updating }) {
    const [localQty, setLocalQty] = useState(item.quantity);
    const isUpdating = updating === item.id;

    // Đồng bộ nếu server trả về quantity mới
    useEffect(() => { setLocalQty(item.quantity); }, [item.quantity]);

    const handleBlur = () => {
        const num = Math.max(1, Number(localQty) || 1);
        setLocalQty(num);
        if (num !== item.quantity) onQtyChange(item.id, num);
    };

    const handleStep = (delta) => {
        const next = Math.max(1, item.quantity + delta);
        onQtyChange(item.id, next);
    };

    return (
        <tr className={`sn-cart-row ${isUpdating ? 'is-updating' : ''}`}>
            {/* Ảnh + tên */}
            <td className="sn-cart-row__product">
                <div className="sn-cart-row__media">
                    {item.productImage
                        ? <img src={item.productImage} alt={item.productName} onError={(e) => { e.target.src = '/assets/placeholder-product.png'; }} />
                        : <div className="sn-cart-row__no-img"><i className="fas fa-image"></i></div>
                    }
                </div>
                <div className="sn-cart-row__info">
                    <Link to={`/product/${item.productId}`} className="sn-cart-row__name">
                        {item.productName || `Sản phẩm #${item.productId}`}
                    </Link>
                    <span className="sn-cart-row__pid">#{item.productId}</span>
                </div>
            </td>

            {/* Đơn giá */}
            <td className="sn-cart-row__price">
                {formatCurrency(item.unitPrice)}
            </td>

            {/* Số lượng */}
            <td className="sn-cart-row__qty">
                <div className="sn-qty-input">
                    <button onClick={() => handleStep(-1)} disabled={isUpdating || item.quantity <= 1} aria-label="Giảm">−</button>
                    <input
                        type="number"
                        min="1"
                        value={localQty}
                        onChange={(e) => setLocalQty(e.target.value)}
                        onBlur={handleBlur}
                        disabled={isUpdating}
                    />
                    <button onClick={() => handleStep(1)} disabled={isUpdating} aria-label="Tăng">+</button>
                </div>
                {isUpdating && <span className="sn-cart-row__spinner"><i className="fas fa-circle-notch fa-spin"></i></span>}
            </td>

            {/* Thành tiền */}
            <td className="sn-cart-row__total">
                {formatCurrency(item.lineTotal)}
            </td>

            {/* Xóa */}
            <td className="sn-cart-row__remove">
                <button
                    className="sn-btn-remove"
                    onClick={() => onRemove(item.id)}
                    disabled={isUpdating}
                    aria-label="Xóa sản phẩm"
                >
                    <i className="fas fa-trash-can"></i>
                </button>
            </td>
        </tr>
    );
}

// ── Trang Cart chính
function Cart() {
    const navigate = useNavigate();
    const [cart, setCart]           = useState(null);   // { cartId, customerId, items, totalAmount }
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState(null);
    const [updating, setUpdating]   = useState(null);   // cartItemId đang được cập nhật
    const [clearing, setClearing]   = useState(false);
    const [feedback, setFeedback]   = useState(null);   // { type: 'success'|'error', msg }

    // ─── Load giỏ hàng từ API
    const fetchCart = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await cartService.getCart(CUSTOMER_ID);
            setCart(data);
        } catch (err) {
            setError(err?.response?.data?.message || 'Không thể tải giỏ hàng. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchCart(); }, [fetchCart]);

    const showFeedback = (type, msg) => {
        setFeedback({ type, msg });
        setTimeout(() => setFeedback(null), 3000);
    };

    // ─── Cập nhật số lượng → PUT /api/cart/item/{id}
    const handleQtyChange = async (cartItemId, newQty) => {
        setUpdating(cartItemId);
        try {
            await cartService.updateQuantity(cartItemId, newQty);
            // Cập nhật local state để không cần re-fetch toàn bộ
            setCart((prev) => {
                const items = prev.items.map((i) =>
                    i.id === cartItemId
                        ? { ...i, quantity: newQty, lineTotal: i.unitPrice * newQty }
                        : i
                );
                return { ...prev, items, totalAmount: items.reduce((s, i) => s + i.lineTotal, 0) };
            });
        } catch (err) {
            const msg = err?.response?.data?.message || 'Cập nhật thất bại.';
            showFeedback('error', msg);
            // Rollback: reload giỏ hàng từ server
            fetchCart();
        } finally {
            setUpdating(null);
        }
    };

    // ─── Xóa 1 sản phẩm → DELETE /api/cart/item/{id}
    const handleRemoveItem = async (cartItemId) => {
        setUpdating(cartItemId);
        try {
            await cartService.removeItem(cartItemId);
            setCart((prev) => {
                const items = prev.items.filter((i) => i.id !== cartItemId);
                return { ...prev, items, totalAmount: items.reduce((s, i) => s + i.lineTotal, 0) };
            });
            showFeedback('success', 'Đã xóa sản phẩm khỏi giỏ hàng.');
        } catch (err) {
            showFeedback('error', err?.response?.data?.message || 'Xóa thất bại.');
        } finally {
            setUpdating(null);
        }
    };

    // ─── Xóa toàn bộ giỏ → DELETE /api/cart/customer/{id}/clear
    const handleClearCart = async () => {
        if (!window.confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) return;
        setClearing(true);
        try {
            await cartService.clearCart(CUSTOMER_ID);
            setCart((prev) => ({ ...prev, items: [], totalAmount: 0 }));
            showFeedback('success', 'Đã xóa toàn bộ giỏ hàng.');
        } catch (err) {
            showFeedback('error', err?.response?.data?.message || 'Không thể xóa giỏ hàng.');
        } finally {
            setClearing(false);
        }
    };

    // ─── Chuyển đến Checkout
    const handleCheckout = () => navigate('/checkout');

    const hasItems = cart?.items?.length > 0;

    // ────────────────── Render ──────────────────
    return (
        <main className="sn-cart-page">
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

                .sn-cart-page {
                    min-height: 70vh;
                    padding: 48px 0 80px;
                    background: var(--color-bg);
                    font-family: 'Be Vietnam Pro', sans-serif;
                    color: var(--color-body);
                }

                /* ── Page header */
                .sn-cart-header {
                    display: flex;
                    align-items: baseline;
                    justify-content: space-between;
                    margin-bottom: 32px;
                    flex-wrap: wrap;
                    gap: 12px;
                }
                .sn-cart-header h1 {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 36px;
                    font-weight: 800;
                    color: var(--color-secondary);
                    letter-spacing: .5px;
                }
                .sn-cart-header__count {
                    font-family: 'Roboto Mono', monospace;
                    font-size: 14px;
                    color: var(--color-muted);
                }

                /* ── Feedback toast */
                .sn-feedback {
                    padding: 12px 20px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 20px;
                    animation: fadeIn .2s ease;
                }
                .sn-feedback.success { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
                .sn-feedback.error   { background: #fff1f2; color: var(--color-primary); border: 1px solid #fecdd3; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }

                /* ── Loading skeleton */
                .sn-cart-loading {
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    min-height: 320px; gap: 16px;
                }
                .sn-spinner-lg {
                    width: 48px; height: 48px;
                    border: 4px solid var(--color-border);
                    border-top-color: var(--color-primary);
                    border-radius: 50%;
                    animation: spin .8s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }

                /* ── Error state */
                .sn-cart-error {
                    text-align: center; padding: 60px 0;
                    color: var(--color-primary);
                    font-size: 15px;
                }
                .sn-cart-error i { font-size: 40px; display: block; margin-bottom: 16px; opacity: .7; }

                /* ── Empty state */
                .sn-cart-empty { text-align: center; padding: 80px 0; }
                .sn-cart-empty__icon {
                    width: 96px; height: 96px;
                    background: var(--color-white);
                    border: 1px solid var(--color-border);
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    margin: 0 auto 24px;
                    font-size: 36px;
                    color: var(--color-border);
                }
                .sn-cart-empty__title {
                    font-family: 'Barlow Semi Condensed', sans-serif;
                    font-size: 24px; font-weight: 700;
                    color: var(--color-secondary); margin-bottom: 8px;
                }
                .sn-cart-empty__desc { font-size: 15px; color: var(--color-muted); margin-bottom: 28px; }

                /* ── Table */
                .sn-cart-table-wrap {
                    background: var(--color-white);
                    border: 1px solid var(--color-border);
                    border-radius: 12px;
                    overflow: hidden;
                }
                .sn-cart-table { width: 100%; border-collapse: collapse; }
                .sn-cart-table thead tr {
                    background: var(--color-bg);
                    border-bottom: 1px solid var(--color-border);
                }
                .sn-cart-table thead th {
                    padding: 14px 20px;
                    font-family: 'Barlow Semi Condensed', sans-serif;
                    font-size: 13px; font-weight: 600;
                    color: var(--color-muted);
                    text-transform: uppercase; letter-spacing: .5px;
                    text-align: left;
                }
                .sn-cart-table thead th:not(:first-child) { text-align: center; }
                .sn-cart-table tbody tr { border-bottom: 1px solid var(--color-border); }
                .sn-cart-table tbody tr:last-child { border-bottom: none; }

                /* ── Cart row */
                .sn-cart-row { transition: background .15s; }
                .sn-cart-row.is-updating { background: #fffbeb; }
                .sn-cart-row td { padding: 20px; vertical-align: middle; }

                .sn-cart-row__product { display: flex; align-items: center; gap: 16px; min-width: 240px; }
                .sn-cart-row__media {
                    width: 72px; height: 72px; flex-shrink: 0;
                    border: 1px solid var(--color-border); border-radius: 8px; overflow: hidden;
                    background: var(--color-bg);
                    display: flex; align-items: center; justify-content: center;
                }
                .sn-cart-row__media img { width: 100%; height: 100%; object-fit: cover; }
                .sn-cart-row__no-img { font-size: 24px; color: var(--color-border); }
                .sn-cart-row__info { display: flex; flex-direction: column; gap: 4px; }
                .sn-cart-row__name {
                    font-size: 15px; font-weight: 600; color: var(--color-secondary);
                    text-decoration: none; line-height: 1.4;
                }
                .sn-cart-row__name:hover { color: var(--color-primary); }
                .sn-cart-row__pid { font-size: 12px; color: var(--color-muted); font-family: 'Roboto Mono', monospace; }

                .sn-cart-row__price,
                .sn-cart-row__total {
                    font-family: 'Roboto Mono', monospace;
                    font-size: 15px; font-weight: 500;
                    text-align: center; white-space: nowrap;
                }
                .sn-cart-row__total { font-weight: 700; color: var(--color-primary); }
                .sn-cart-row__qty { text-align: center; }
                .sn-cart-row__remove { text-align: center; }
                .sn-cart-row__spinner { margin-left: 8px; color: var(--color-accent); font-size: 14px; }

                /* ── Qty input (giống ProductDetail) */
                .sn-qty-input {
                    display: inline-flex; align-items: center;
                    border: 1px solid var(--color-border); border-radius: 6px; overflow: hidden;
                    background: var(--color-white);
                }
                .sn-qty-input button {
                    width: 36px; height: 38px; border: none;
                    background: var(--color-bg); font-size: 16px; cursor: pointer;
                    color: var(--color-secondary); transition: background .15s;
                }
                .sn-qty-input button:hover:not(:disabled) { background: var(--color-border); }
                .sn-qty-input button:disabled { opacity: .4; cursor: not-allowed; }
                .sn-qty-input input {
                    width: 48px; height: 38px; border: none;
                    border-left: 1px solid var(--color-border);
                    border-right: 1px solid var(--color-border);
                    text-align: center;
                    font-family: 'Roboto Mono', monospace; font-size: 14px; font-weight: 700;
                    color: var(--color-secondary); outline: none;
                }
                .sn-qty-input input:disabled { background: var(--color-bg); }
                .sn-qty-input input::-webkit-outer-spin-button,
                .sn-qty-input input::-webkit-inner-spin-button { -webkit-appearance: none; }

                /* ── Remove button */
                .sn-btn-remove {
                    width: 36px; height: 36px; border: none; border-radius: 6px;
                    background: #fff1f2; color: var(--color-primary); cursor: pointer;
                    font-size: 14px; transition: background .15s;
                }
                .sn-btn-remove:hover:not(:disabled) { background: #fecdd3; }
                .sn-btn-remove:disabled { opacity: .4; cursor: not-allowed; }

                /* ── Footer: Clear + Summary */
                .sn-cart-footer {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    margin-top: 24px;
                    flex-wrap: wrap;
                    gap: 24px;
                }

                .sn-btn-clear {
                    border: 1px solid var(--color-border);
                    background: var(--color-white);
                    color: var(--color-muted);
                    border-radius: 6px;
                    padding: 10px 20px;
                    font-family: 'Be Vietnam Pro', sans-serif;
                    font-size: 14px; font-weight: 500;
                    cursor: pointer; transition: all .2s;
                    display: inline-flex; align-items: center; gap: 8px;
                    align-self: flex-start;
                }
                .sn-btn-clear:hover:not(:disabled) {
                    border-color: var(--color-primary);
                    color: var(--color-primary);
                }
                .sn-btn-clear:disabled { opacity: .5; cursor: not-allowed; }

                /* ── Order summary panel */
                .sn-order-summary {
                    background: var(--color-white);
                    border: 1px solid var(--color-border);
                    border-radius: 12px;
                    padding: 28px 32px;
                    min-width: 300px;
                    max-width: 380px;
                    flex: 1;
                }
                .sn-order-summary h3 {
                    font-family: 'Barlow Semi Condensed', sans-serif;
                    font-size: 20px; font-weight: 700;
                    color: var(--color-secondary); margin-bottom: 20px;
                }
                .sn-order-summary__row {
                    display: flex; justify-content: space-between;
                    font-size: 15px; color: var(--color-body);
                    padding: 8px 0;
                    border-bottom: 1px dashed var(--color-border);
                }
                .sn-order-summary__row:last-of-type { border-bottom: none; }
                .sn-order-summary__total {
                    display: flex; justify-content: space-between;
                    align-items: center;
                    padding-top: 16px; margin-top: 8px;
                    border-top: 2px solid var(--color-secondary);
                }
                .sn-order-summary__total-label {
                    font-family: 'Barlow Semi Condensed', sans-serif;
                    font-size: 18px; font-weight: 700; color: var(--color-secondary);
                }
                .sn-order-summary__total-value {
                    font-family: 'Roboto Mono', monospace;
                    font-size: 22px; font-weight: 700; color: var(--color-primary);
                }

                /* ── Buttons */
                .sn-btn-primary {
                    display: inline-flex; align-items: center; gap: 8px;
                    background: var(--color-primary); color: var(--color-white);
                    border: none; border-radius: 6px;
                    padding: 13px 28px;
                    font-family: 'Be Vietnam Pro', sans-serif;
                    font-size: 14px; font-weight: 600;
                    cursor: pointer; text-decoration: none;
                    transition: background .2s;
                    width: 100%; justify-content: center; margin-top: 20px;
                }
                .sn-btn-primary:hover { background: #c91314; }

                .sn-btn-secondary {
                    display: inline-flex; align-items: center; gap: 8px;
                    background: var(--color-white); color: var(--color-secondary);
                    border: 1px solid var(--color-secondary); border-radius: 6px;
                    padding: 11px 28px;
                    font-family: 'Be Vietnam Pro', sans-serif;
                    font-size: 14px; font-weight: 600;
                    cursor: pointer; text-decoration: none;
                    transition: all .2s;
                    width: 100%; justify-content: center; margin-top: 10px;
                }
                .sn-btn-secondary:hover { background: var(--color-secondary); color: var(--color-white); }

                /* ── Mobile responsive */
                @media (max-width: 768px) {
                    .sn-cart-table thead th:nth-child(2) { display: none; }
                    .sn-cart-table td:nth-child(2) { display: none; }
                    .sn-cart-row__product { flex-direction: column; align-items: flex-start; gap: 8px; }
                    .sn-order-summary { max-width: 100%; min-width: unset; }
                    .sn-cart-footer { flex-direction: column; }
                }
            `}</style>

            <div className="container">
                {/* ── Page title */}
                <div className="sn-cart-header">
                    <h1><i className="fas fa-shopping-bag mr-2" style={{ color: 'var(--color-primary)' }}></i> Giỏ hàng của bạn</h1>
                    {!loading && cart && (
                        <span className="sn-cart-header__count">
                            {cart.items?.length || 0} sản phẩm
                        </span>
                    )}
                </div>

                {/* ── Feedback toast */}
                {feedback && (
                    <div className={`sn-feedback ${feedback.type}`}>
                        <i className={`fas ${feedback.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}`}></i>
                        {feedback.msg}
                    </div>
                )}

                {/* ── Loading */}
                {loading && (
                    <div className="sn-cart-loading">
                        <div className="sn-spinner-lg" />
                        <p style={{ color: 'var(--color-muted)', fontSize: '14px' }}>Đang tải giỏ hàng...</p>
                    </div>
                )}

                {/* ── Error */}
                {!loading && error && (
                    <div className="sn-cart-error">
                        <i className="fas fa-circle-exclamation"></i>
                        <p>{error}</p>
                        <button className="sn-btn-secondary" style={{ maxWidth: 200, margin: '16px auto 0' }} onClick={fetchCart}>
                            <i className="fas fa-rotate-right mr-1"></i> Thử lại
                        </button>
                    </div>
                )}

                {/* ── Giỏ trống */}
                {!loading && !error && !hasItems && <EmptyCart />}

                {/* ── Có sản phẩm */}
                {!loading && !error && hasItems && (
                    <>
                        {/* Bảng sản phẩm */}
                        <div className="sn-cart-table-wrap">
                            <table className="sn-cart-table">
                                <thead>
                                    <tr>
                                        <th>Sản phẩm</th>
                                        <th>Đơn giá</th>
                                        <th>Số lượng</th>
                                        <th>Thành tiền</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.items.map((item) => (
                                        <CartRow
                                            key={item.id}
                                            item={item}
                                            onQtyChange={handleQtyChange}
                                            onRemove={handleRemoveItem}
                                            updating={updating}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer: Xóa giỏ + Tổng đơn hàng */}
                        <div className="sn-cart-footer">
                            {/* Xóa toàn bộ */}
                            <button
                                className="sn-btn-clear"
                                onClick={handleClearCart}
                                disabled={clearing}
                            >
                                {clearing
                                    ? <><i className="fas fa-circle-notch fa-spin"></i> Đang xóa...</>
                                    : <><i className="fas fa-trash-can"></i> Xóa toàn bộ giỏ</>
                                }
                            </button>

                            {/* Tóm tắt đơn hàng */}
                            <div className="sn-order-summary">
                                <h3>Tóm tắt đơn hàng</h3>

                                {cart.items.map((item) => (
                                    <div key={item.id} className="sn-order-summary__row">
                                        <span style={{ flex: 1, marginRight: 12, fontSize: 14 }}>
                                            {item.productName || `#${item.productId}`}
                                            <span style={{ color: 'var(--color-muted)', marginLeft: 6, fontFamily: 'Roboto Mono, monospace', fontSize: 12 }}>
                                                ×{item.quantity}
                                            </span>
                                        </span>
                                        <span style={{ fontFamily: 'Roboto Mono, monospace', fontSize: 14, whiteSpace: 'nowrap' }}>
                                            {formatCurrency(item.lineTotal)}
                                        </span>
                                    </div>
                                ))}

                                <div className="sn-order-summary__total">
                                    <span className="sn-order-summary__total-label">Tổng cộng</span>
                                    <span className="sn-order-summary__total-value">{formatCurrency(cart.totalAmount)}</span>
                                </div>

                                <button className="sn-btn-primary" onClick={handleCheckout}>
                                    <i className="fas fa-lock"></i> Tiến hành đặt hàng
                                </button>

                                <Link to="/shop" className="sn-btn-secondary">
                                    <i className="fas fa-arrow-left"></i> Tiếp tục mua sắm
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}

export default Cart;