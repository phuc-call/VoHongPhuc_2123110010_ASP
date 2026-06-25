// =====================================================
// src/services/categoryProductService.js
// CategoryProductController hiện tại là MVC (trả View), nên Frontend
// React cần một API endpoint riêng để lấy JSON danh mục.
// Đề xuất bổ sung CategoryProductsController (api/[controller]) ở Backend.
// =====================================================
import axiosClient from '../api/axiosClient';

const categoryProductService = {
    getAllCategories: () => {
        return axiosClient.get('/categoryproducts');
    },
    getCategoryDetail: (id) => {
        return axiosClient.get(`/categoryproducts/${id}`);
    },
};

export default categoryProductService;
