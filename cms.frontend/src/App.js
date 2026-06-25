import React from 'react';
// Import các thành phần lõi của thư viện điều hướng đường dẫn
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. IMPORT CÁC COMPONENT TOÀN CỤC (LAYOUT CHUNG)
import Header from './components/Header';
import Footer from './components/Footer';
// Sửa dòng import này
import PostDetail from './pages/postDetail/PostDetail';

// 2. IMPORT CÁC TRANG CHỨC NĂNG (GIAO DIỆN CHÍNH)
import Home from './pages/home/index';
import Shop from './pages/shop/index';                  // Tự động nạp file pages/shop/index.jsx
import ProductDetail from './pages/product-detail';      // Tự động nạp file pages/product-detail/index.jsx
import Blog from './pages/blog/index';                
import Cart from './pages/cart/index';                   // Tự động nạp file pages/cart/index.jsx
import Checkout from './pages/checkout/index';            // Tự động nạp file pages/checkout/index.jsx

function App() {
    return (
        <Router>
            <div className="d-flex flex-column min-vh-100 bg-light">
                <Header />                    {/* ← thêm dòng này */}
                <main className="flex-grow-1">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/product/:id" element={<ProductDetail />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/blog/:id" element={<PostDetail />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="*" element={
                            <div className="container text-center py-5 my-5">
                                <img src="https://cdn-icons-png.flaticon.com/512/580/580185.png" alt="404" className="mb-4" style={{ width: '100px', opacity: 0.6 }} />
                                <h2 className="fw-bold text-secondary">404 - KHÔNG TÌM THẤY TRANG</h2>
                                <p className="text-muted">Đường dẫn bạn truy cập không tồn tại trên hệ thống</p>
                                <a href="/" className="btn btn-dark btn-sm mt-2">Quay lại Trang Chủ</a>
                            </div>
                        } />
                    </Routes>
                </main>
                <Footer />                    {/* ← thêm dòng này */}
            </div>
        </Router>
    );
}

export default App;