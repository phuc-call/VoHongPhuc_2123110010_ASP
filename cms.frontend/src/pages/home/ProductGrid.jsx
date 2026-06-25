import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import ProductCard from '../../components/Productcard';
import Pagination from '../../components/common/Pagination';

const PAGE_SIZE = 12;

function ProductGrid() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        setLoading(true);
        productService.getAllProducts({ page: currentPage, pageSize: PAGE_SIZE })
            .then(function(data) {
                setProducts(data?.items ?? []);
                setTotalPages(Math.ceil((data?.totalCount ?? 0) / PAGE_SIZE));
            })
            .catch(function(err) {
                console.error('Loi tai san pham:', err);
            })
            .finally(function() {
                setLoading(false);
            });
    }, [currentPage]);

    if (loading) {
        return (
            <div style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '60px 0', fontFamily: "'Be Vietnam Pro', sans-serif"
            }}>
                <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    border: '3px solid #D9D9D9', borderTopColor: '#E8191A',
                    animation: 'spin 0.8s linear infinite'
                }} />
                <p style={{ marginTop: '12px', color: '#888888', fontSize: '14px' }}>
                    Đang tải sản phẩm...
                </p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div style={{
                textAlign: 'center', padding: '60px 0',
                fontFamily: "'Be Vietnam Pro', sans-serif"
            }}>
                <p style={{ color: '#888888', fontSize: '15px' }}>Chưa có sản phẩm nào.</p>
            </div>
        );
    }

    return (
        <section style={{
            padding: '32px 0',
            fontFamily: "'Be Vietnam Pro', sans-serif"
        }}>
            <div className="container">

                {/* Header section */}
                <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'baseline',
                    borderBottom: '2px solid #E8191A',
                    paddingBottom: '10px', marginBottom: '24px'
                }}>
                    <h4 style={{
                        fontFamily: "'Barlow Semi Condensed', sans-serif",
                        fontWeight: 700, fontSize: '22px',
                        color: '#2C2C2C', textTransform: 'uppercase',
                        letterSpacing: '0.5px', margin: 0
                    }}>
                        Sản phẩm nổi bật
                    </h4>
                    <span style={{
                        fontFamily: "'Roboto Mono', monospace",
                        fontSize: '13px', color: '#888888'
                    }}>
                        {products.length} sản phẩm
                    </span>
                </div>

                {/* Grid sản phẩm */}
                <div className="row">
                    {products.map(function(product) {
                        return (
                            <div className="col-xl-3 col-lg-4 col-sm-6 col-12 mb-4" key={product.id}>
                                <ProductCard item={product} />
                            </div>
                        );
                    })}
                </div>

                {/* Phân trang */}
                {totalPages > 1 && (
                    <div style={{ marginTop: '24px' }}>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}

            </div>
        </section>
    );
}

export default ProductGrid;