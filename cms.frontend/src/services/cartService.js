// =====================================================
// src/services/cartService.js
// Gọi đúng route đã có ở CartController (api/cart...).
// =====================================================
import axiosClient from '../api/axiosClient';

const cartService = {
    /**
     * GET api/cart/customer/{customerId}
     * Lấy giỏ hàng hiện tại của khách hàng (kèm items + tổng tiền)
     */
    getCart: (customerId) => {
        return axiosClient.get(`/cart/customer/${customerId}`);
    },

    /**
     * POST api/cart/add
     * Thêm sản phẩm vào giỏ (tự động trừ tồn kho)
     * @param {{ customerId: number, productId: number, quantity: number }} data
     */
    addToCart: (data) => {
        return axiosClient.post('/cart/add', data);
    },

    /**
     * PUT api/cart/item/{cartItemId}
     * Cập nhật số lượng 1 item trong giỏ (tự cộng/trừ tồn kho theo chênh lệch)
     * @param {number} cartItemId
     * @param {number} quantity
     */
    updateQuantity: (cartItemId, quantity) => {
        return axiosClient.put(`/cart/item/${cartItemId}`, { quantity });
    },

    /**
     * DELETE api/cart/item/{cartItemId}
     * Xóa 1 sản phẩm khỏi giỏ (hoàn lại tồn kho)
     * @param {number} cartItemId
     */
    removeItem: (cartItemId) => {
        return axiosClient.delete(`/cart/item/${cartItemId}`);
    },

    /**
     * DELETE api/cart/customer/{customerId}/clear
     * Xóa toàn bộ giỏ hàng (hoàn lại tồn kho tất cả sản phẩm)
     * @param {number} customerId
     */
    clearCart: (customerId) => {
        return axiosClient.delete(`/cart/customer/${customerId}/clear`);
    },
};

export default cartService;