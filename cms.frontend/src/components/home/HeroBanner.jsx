// =====================================================
// src/components/home/HeroBanner.jsx
// Banner slide LẤY DỮ LIỆU THẬT từ API (sản phẩm mới nhất + bài viết mới nhất)
// trộn lại thành các slide, không hardcode nội dung tĩnh.
// =====================================================
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { resolveImageUrl } from '../../config/env';
import productService from '../../services/productService';
import postService from '../../services/postService';
import './HeroBanner.css';

const AUTO_SLIDE_MS = 5000;

function buildSlidesFromData(products, posts) {
    const productSlides = (products || []).slice(0, 2).map((p) => ({
        id: `product-${p.id}`,
        kicker: 'Sản phẩm mới',
        title: p.name,
        subtitle: p.description ? p.description.slice(0, 90) : 'Khám phá ngay bộ sưu tập mới nhất',
        image: p.imageUrl,
        ctaLabel: 'Xem sản phẩm',
        ctaLink: `/product/${p.id}`,
    }));

    const postSlides = (posts || []).slice(0, 1).map((post) => ({
        id: `post-${post.id}`,
        kicker: post.categoryName || 'Tin tức',
        title: post.title,
        subtitle: 'Đọc ngay bài viết mới nhất từ ShopNhanh.Fashion',
        image: post.imageUrl,
        ctaLabel: 'Đọc bài viết',
        ctaLink: `/blog/${post.id}`,
    }));

    return [...productSlides, ...postSlides];
}

function HeroBanner() {
    const [slides, setSlides] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            productService.getLatestProducts(2).catch(() => []),
            postService.getLatestPosts(1).catch(() => []),
        ])
            .then(([products, posts]) => {
                setSlides(buildSlidesFromData(products, posts));
            })
            .finally(() => setLoading(false));
    }, []);

    const goTo = useCallback((index) => {
        setActiveIndex((prev) => {
            const len = slides.length;
            if (len === 0) return 0;
            return (index + len) % len;
        });
    }, [slides.length]);

    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(() => goTo(activeIndex + 1), AUTO_SLIDE_MS);
        return () => clearInterval(timer);
    }, [activeIndex, slides.length, goTo]);

    if (loading) {
        return <div className="sn-hero sn-hero--loading"><div className="sn-spinner" /></div>;
    }

    if (slides.length === 0) {
        // Không có dữ liệu thật -> không vẽ banner giả, nhường chỗ cho phần khác
        return null;
    }

    return (
        <section className="sn-hero">
            {slides.map((slide, idx) => (
                <div
                    key={slide.id}
                    className={`sn-hero__slide ${idx === activeIndex ? 'is-active' : ''}`}
                    style={{ backgroundImage: `url(${resolveImageUrl(slide.image, '/assets/placeholder-banner.jpg')})` }}
                >
                    <div className="sn-hero__overlay" />
                    <div className="container sn-hero__content">
                        <span className="sn-hero__kicker">{slide.kicker}</span>
                        <h1 className="sn-hero__title">{slide.title}</h1>
                        <p className="sn-hero__subtitle">{slide.subtitle}</p>
                        <Link to={slide.ctaLink} className="sn-hero__cta">
                            {slide.ctaLabel} <i className="fas fa-arrow-right ml-2"></i>
                        </Link>
                    </div>
                </div>
            ))}

            {slides.length > 1 && (
                <div className="sn-hero__dots">
                    {slides.map((slide, idx) => (
                        <button
                            key={slide.id}
                            className={`sn-hero__dot ${idx === activeIndex ? 'is-active' : ''}`}
                            onClick={() => goTo(idx)}
                            aria-label={`Xem slide ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

export default HeroBanner;
