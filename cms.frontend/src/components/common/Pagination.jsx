// =====================================================
// src/components/common/Pagination.jsx
// Component phân trang DÙNG CHUNG cho ProductGrid và PostGrid.
// Chỉ nhận state từ cha qua props, không tự gọi API -> tái sử dụng tối đa.
// =====================================================
import React from 'react';
import usePagination from '../../hooks/usePagination';
import './Pagination.css';

function Pagination({ currentPage, totalPages, onPageChange }) {
    const pages = usePagination(currentPage, totalPages, 1);

    if (totalPages <= 1) return null;

    const goTo = (page) => {
        if (page < 1 || page > totalPages || page === currentPage) return;
        onPageChange(page);
    };

    return (
        <nav className="sn-pagination" aria-label="Điều hướng phân trang">
            <button
                className="sn-pagination__arrow"
                onClick={() => goTo(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Trang trước"
            >
                <i className="fas fa-chevron-left"></i>
            </button>

            {pages.map((page, idx) =>
                typeof page === 'number' ? (
                    <button
                        key={page}
                        className={`sn-pagination__page ${page === currentPage ? 'is-active' : ''}`}
                        onClick={() => goTo(page)}
                        aria-current={page === currentPage ? 'page' : undefined}
                    >
                        {page}
                    </button>
                ) : (
                    <span key={`${page}-${idx}`} className="sn-pagination__dots">…</span>
                )
            )}

            <button
                className="sn-pagination__arrow"
                onClick={() => goTo(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Trang sau"
            >
                <i className="fas fa-chevron-right"></i>
            </button>
        </nav>
    );
}

export default Pagination;
