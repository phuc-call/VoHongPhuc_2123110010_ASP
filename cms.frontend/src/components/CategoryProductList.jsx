import React, { useState, useEffect } from 'react';
import categoryProductService from '../services/categoryProductService';

const CategoryProductList = () => {
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategoryProducts = async () => {
            try {
                setLoading(true);
                const data = await categoryProductService.getAllCategoryProducts();
                setCategoryProducts(data);
            } catch (error) {
                console.error("Lỗi khi tải danh mục sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategoryProducts();
    }, []);

    if (loading) {
        return <div className="text-center my-4">Đang tải danh mục sản phẩm...</div>;
    }

    return (
        <div className="card shadow-sm border-0 rounded">
            <div className="card-header bg-white pt-4 pb-2 px-4">
                <h5 className="card-title text-uppercase font-weight-bold text-dark mb-0">
                    <i className="fa-solid fa-cubes text-primary mr-2"></i> Danh mục SP
                </h5>
            </div>
            <div className="card-body p-0">
                <div className="list-group list-group-flush">
                    {categoryProducts.length === 0 ? (
                        <div className="p-4 text-center text-muted">
                            Không có danh mục nào.
                        </div>
                    ) : (
                        categoryProducts.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center px-4 py-3"
                            >
                                <span>{item.name}</span>
                                <i className="fa-solid fa-chevron-right text-muted"></i>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryProductList;