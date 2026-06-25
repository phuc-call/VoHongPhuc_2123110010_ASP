import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:5146/api', // ✅ đổi https → http
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

axiosClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        console.error('Lỗi kết nối API:', error.message);
        return Promise.reject(error);
    }
);

export default axiosClient;