// =====================================================
// src/services/postService.js
// Gọi đúng route đã có ở PostsController (api/posts...).
// =====================================================
import axiosClient from '../api/axiosClient';

const postService = {
    /**
     * @param {Object} params
     * @param {number} params.page
     * @param {number} params.pageSize
     * @param {number} [params.categoryId]
     */
    getAllPosts: (params = {}) => {
        return axiosClient.get('/posts', { params });
    },

    getPostsByCategory: (categoryId, params = {}) => {
        return axiosClient.get(`/posts/category/${categoryId}`, { params });
    },

    getPostDetail: (id) => {
        return axiosClient.get(`/posts/${id}`);
    },

    // Bổ sung: lấy N bài viết mới nhất cho khu vực Blog/News tại Home
    getLatestPosts: (count = 3) => {
        return axiosClient.get('/posts/latest', { params: { count } });
    },
};

export default postService;
