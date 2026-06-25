// =====================================================
// src/components/common/EmptyState.jsx
// Dùng chung khi: không có sản phẩm, search rỗng, lỗi gọi API...
// =====================================================
import React from 'react';
import './EmptyState.css';

function EmptyState({ icon = 'fa-box-open', message, actionLabel, onAction }) {
    return (
        <div className="sn-empty-state">
            <i className={`fas ${icon} sn-empty-state__icon`}></i>
            <p className="sn-empty-state__message">{message}</p>
            {actionLabel && onAction && (
                <button className="sn-empty-state__action" onClick={onAction}>
                    {actionLabel}
                </button>
            )}
        </div>
    );
}

export default EmptyState;
