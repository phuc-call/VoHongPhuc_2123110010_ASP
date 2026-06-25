// =====================================================
// src/pages/About.jsx
// Trang Giới thiệu - nội dung TĨNH theo yêu cầu (không cần gọi API).
// =====================================================
import React from 'react';
import './About.css';

function About() {
    return (
        <main>
            <section className="sn-about-hero">
                <div className="container">
                    <span className="sn-about-hero__kicker">Về chúng tôi</span>
                    <h1 className="sn-about-hero__title">ShopNhanh.Fashion</h1>
                    <p className="sn-about-hero__subtitle">
                        Hệ thống thời trang cao cấp dẫn đầu xu hướng, mang đến phong cách thời thượng cho mọi khách hàng.
                    </p>
                </div>
            </section>

            <section className="sn-section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 mb-4">
                            <h2 className="sn-section__title" style={{ marginBottom: 16 }}>Câu chuyện thương hiệu</h2>
                            <p className="sn-about-text">
                                ShopNhanh.Fashion ra đời với mong muốn đơn giản hoá việc tiếp cận thời trang cao cấp.
                                Chúng tôi tuyển chọn từng sản phẩm, đảm bảo chất lượng premium và giá cả hợp lý,
                                để mỗi khách hàng đều tìm được phong cách phù hợp với chính mình.
                            </p>
                            <p className="sn-about-text">
                                Từ trang phục công sở thanh lịch đến những bộ cánh dạ hội nổi bật, đội ngũ của chúng tôi
                                luôn cập nhật xu hướng mới nhất để mang lại trải nghiệm mua sắm hiện đại, nhanh chóng và đáng tin cậy.
                            </p>
                        </div>
                        <div className="col-lg-6">
                            <div className="sn-about-stats">
                                <div className="sn-about-stats__item">
                                    <span className="sn-about-stats__number">10K+</span>
                                    <span className="sn-about-stats__label">Khách hàng tin dùng</span>
                                </div>
                                <div className="sn-about-stats__item">
                                    <span className="sn-about-stats__number">500+</span>
                                    <span className="sn-about-stats__label">Mẫu sản phẩm</span>
                                </div>
                                <div className="sn-about-stats__item">
                                    <span className="sn-about-stats__number">24/7</span>
                                    <span className="sn-about-stats__label">Hỗ trợ khách hàng</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="sn-section sn-section--dark">
                <div className="container">
                    <div className="sn-section__header" style={{ borderBottomColor: 'rgba(255,255,255,0.15)' }}>
                        <h2 className="sn-section__title">Giá trị cốt lõi</h2>
                    </div>
                    <div className="row">
                        {[
                            { icon: 'fa-gem', title: 'Chất lượng', desc: 'Mỗi sản phẩm đều được kiểm định kỹ trước khi đến tay khách hàng.' },
                            { icon: 'fa-bolt', title: 'Nhanh chóng', desc: 'Giao hàng nhanh, xử lý đơn hàng minh bạch, đúng hẹn.' },
                            { icon: 'fa-handshake', title: 'Tận tâm', desc: 'Đặt sự hài lòng của khách hàng làm trung tâm mọi hoạt động.' },
                        ].map((value) => (
                            <div className="col-md-4 mb-4" key={value.title}>
                                <div className="sn-about-value">
                                    <i className={`fas ${value.icon}`}></i>
                                    <h3>{value.title}</h3>
                                    <p>{value.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}

export default About;
