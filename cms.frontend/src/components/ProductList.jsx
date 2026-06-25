import React, { useState, useEffect } from 'react';
import productService from '../services/productService';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await productService.getAllProducts();
                setProducts(data);
            } catch (error) {
                console.error("Lỗi khi tải danh sách sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) {
        return <div className="text-center my-4">Đang tải danh sách sản phẩm...</div>;
    }

    return (
        <div className="row">
            {products.length === 0 ? (
                <div className="col-12">
                    <p className="text-muted">Chưa có sản phẩm nào trong hệ thống.</p>
                </div>
            ) : (
                products.map((item) => (
                    <div className="col-md-6 mb-4" key={item.id}>
                        <div className="card h-100 shadow-sm border">
                            {item.imageUrl ? (
                                <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="card-img-top"
                                    style={{ height: '200px', objectFit: 'cover' }}
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            ) : (
                                <div className="bg-light d-flex align-items-center justify-content-center"
                                    style={{ height: '200px' }}>
                                    <i className="fa-solid fa-image text-muted fa-3x"></i>
                                </div>
                            )}
                            <div className="card-body">
                                <h5 className="card-title font-weight-bold text-dark">
                                    {item.name}
                                </h5>
                                <p className="card-text text-danger font-weight-bold">
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                    }).format(item.price)}
                                </p>
                                <p className="card-text small text-muted">
                                    Tồn kho: {item.stockQuantity} sản phẩm
                                </p>
                                {item.categoryName && (
                                    <span className="badge badge-info">
                                        {item.categoryName}
                                    </span>
                                )}
                            </div>
                            <div className="card-footer bg-transparent border-top-0">
                                <button className="btn btn-outline-primary btn-block btn-sm">
                                    <i className="fa-solid fa-eye mr-1"></i> Xem chi tiết
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ProductList;