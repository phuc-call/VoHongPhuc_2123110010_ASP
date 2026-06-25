// =====================================================
// src/hooks/usePagination.js
// Hook tính toán mảng số trang hiển thị (kiểu rút gọn: 1 2 3 ... 8 9 10)
// Dùng chung cho ProductGrid, PostGrid, kết quả Search...
// =====================================================
import { useMemo } from 'react';

/**
 * @param {number} currentPage - trang hiện tại (1-based)
 * @param {number} totalPages - tổng số trang
 * @param {number} siblingCount - số trang lân cận hiển thị mỗi bên
 * @returns {Array<number|'dots'>}
 */
export default function usePagination(currentPage, totalPages, siblingCount = 1) {
    return useMemo(() => {
        const totalPageNumbers = siblingCount * 2 + 5; // first, last, current, 2 dots, siblings

        if (totalPages <= totalPageNumbers) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

        const pages = [1];

        if (shouldShowLeftDots) pages.push('dots-left');

        for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
            if (i !== 1 && i !== totalPages) pages.push(i);
        }

        if (shouldShowRightDots) pages.push('dots-right');

        pages.push(totalPages);

        return pages;
    }, [currentPage, totalPages, siblingCount]);
}
