// =====================================================
// src/services/productService.js
// Gọi đúng route đã có ở ProductsController (api/products...).
// Các tham số filter/pagination được gửi qua query string,
// Backend cần bổ sung tương ứng (xem ProductsController_Updated.cs).
// =====================================================
import axiosClient from '../api/axiosClient';

const productService = {
    /**
     * Lấy danh sách sản phẩm có phân trang + lọc giá + tìm kiếm + sắp xếp.
     * @param {Object} params
     * @param {number} params.page - Trang hiện tại (bắt đầu từ 1)
     * @param {number} params.pageSize - Số sản phẩm / trang
     * @param {number} [params.minPrice]
     * @param {number} [params.maxPrice]
     * @param {string} [params.keyword] - Từ khoá tìm kiếm theo tên
     * @param {number} [params.categoryProductId]
     * @param {string} [params.sortBy] - 'newest' | 'priceAsc' | 'priceDesc'
     */
    getAllProducts: (params = {}) => {
        return axiosClient.get('/products', { params });
    },

    getProductsByCategory: (categoryProductId, params = {}) => {
        return axiosClient.get(`/products/categoryproduct/${categoryProductId}`, { params });
    },

    getProductDetail: (id) => {
        return axiosClient.get(`/products/${id}`);
    },

    // Bổ sung: lấy N sản phẩm mới nhất cho khu vực "New Arrivals" tại Home
    getLatestProducts: (count = 3) => {
        return axiosClient.get('/products/latest', { params: { count } });
    },

    // Bổ sung: lấy N sản phẩm bán chạy nhất cho khu vực "Best Sellers"
    getBestSellerProducts: (count = 3) => {
        return axiosClient.get('/products/bestsellers', { params: { count } });
    },

    // Bổ sung: tìm kiếm theo từ khoá (dùng cho ô search ở Header)
    searchProducts: (keyword, params = {}) => {
        return axiosClient.get('/products/search', { params: { keyword, ...params } });
    },
};

export default productService;
