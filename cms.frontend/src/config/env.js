// =====================================================
// src/config/env.js
// Đọc toàn bộ biến môi trường tại MỘT nơi duy nhất.
// Không bao giờ gọi process.env trực tiếp ở component khác —
// luôn import từ file này để dễ đổi / dễ test / không hardcode domain.
// =====================================================

const required = (key, fallback) => {
    const value = process.env[key];
    if (!value) {
        // Không throw cứng để app vẫn chạy được khi dev quên set .env,
        // nhưng cảnh báo rõ ràng trên console để dev biết mà sửa.
        console.warn(
            `[ENV] Thiếu biến môi trường ${key}, đang dùng giá trị mặc định: ${fallback}`
        );
        return fallback;
    }
    return value;
};

export const API_BASE_URL = required('REACT_APP_API_URL', 'http://localhost:5146/api');
export const IMAGE_BASE_URL = required('REACT_APP_IMAGE_BASE_URL', 'http://localhost:5146');
export const PAGE_SIZE = Number(required('REACT_APP_PAGE_SIZE', '12'));

/**
 * Ghép base URL ảnh với đường dẫn tương đối trả về từ Backend.
 * Xử lý mọi trường hợp: null, đường dẫn đã có http, thiếu/dư dấu "/".
 */
export const resolveImageUrl = (relativePath, fallback = '/assets/placeholder-product.png') => {
    if (!relativePath) return fallback;
    if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
        return relativePath;
    }
    const cleanPath = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
    return `${IMAGE_BASE_URL}${cleanPath}`;
};
