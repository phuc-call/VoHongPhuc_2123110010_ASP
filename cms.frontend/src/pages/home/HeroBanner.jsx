import React from 'react';
import { useState, useEffect, useCallback } from 'react';

var SLIDES = [
    {
        id: 1,
        imageUrl: null,
        tag: 'Moi ve thang 6',
        title: 'Phu tung chinh hang',
        subtitle: 'Nhong sen dia, piston, bac dan - du loai xe pho thong',
        ctaText: 'Xem ngay',
        ctaLink: '/shop',
        accentColor: '#11CAA0',
        bgColor: '#0a1628',
    },
    {
        id: 2,
        imageUrl: null,
        tag: 'Khuyen mai tuan',
        title: 'Giam den 30 phan tram phu kien',
        subtitle: 'Kinh chieu hau, den LED, binh xang con - gia tot nhat',
        ctaText: 'Mua ngay',
        ctaLink: '/shop',
        accentColor: '#f59e0b',
        bgColor: '#1a1200',
    },
    {
        id: 3,
        imageUrl: null,
        tag: 'Do choi xe',
        title: 'Do xe phong cach',
        subtitle: 'Binh dau CNC, tay thang racing, vanh duc',
        ctaText: 'Kham pha',
        ctaLink: '/shop',
        accentColor: '#e05a5a',
        bgColor: '#1a0a0a',
    },
];

function HeroBanner(props) {
    var customSlides = props.slides;
    var interval = props.autoPlayInterval;
    var slideList = customSlides || SLIDES;
    var waitTime = interval || 5000;

    var s1 = useState(0);
    var currentIndex = s1[0];
    var setCurrentIndex = s1[1];

    var s2 = useState(false);
    var isDragging = s2[0];
    var setIsDragging = s2[1];

    var s3 = useState(0);
    var startX = s3[0];
    var setStartX = s3[1];

    var s4 = useState(false);
    var busy = s4[0];
    var setBusy = s4[1];

    var total = slideList.length;

    var jumpTo = useCallback(function(idx) {
        if (busy) { return; }
        setBusy(true);
        var next = (idx + total) % total;
        setCurrentIndex(next);
        setTimeout(function() { setBusy(false); }, 400);
    }, [busy, total]);

    var next = useCallback(function() {
        jumpTo(currentIndex + 1);
    }, [currentIndex, jumpTo]);

    var prev = useCallback(function() {
        jumpTo(currentIndex - 1);
    }, [currentIndex, jumpTo]);

    useEffect(function() {
        if (total <= 1) { return undefined; }
        var t = setInterval(next, waitTime);
        return function() { clearInterval(t); };
    }, [next, waitTime, total]);

    function onDown(e) {
        setIsDragging(true);
        var x = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        setStartX(x);
    }

    function onUp(e) {
        if (!isDragging) { return; }
        setIsDragging(false);
        var x = e.type === 'touchend' ? e.changedTouches[0].clientX : e.clientX;
        var delta = startX - x;
        if (delta > 50) { next(); }
        if (delta < -50) { prev(); }
    }

    var slide = slideList[currentIndex];

    var outerStyle = {
        borderRadius: '12px',
        overflow: 'hidden',
        position: 'relative',
        userSelect: 'none',
        marginTop: '16px',
        marginBottom: '16px',
    };

    var innerStyle = {
        backgroundColor: slide.bgColor,
        minHeight: '320px',
        display: 'flex',
        alignItems: 'center',
        padding: '48px 56px',
        position: 'relative',
        cursor: isDragging ? 'grabbing' : 'grab',
    };

    var tagStyle = {
        background: slide.accentColor,
        color: '#fff',
        fontSize: '12px',
        fontWeight: '600',
        padding: '4px 12px',
        borderRadius: '20px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    };

    var h2Style = {
        color: '#ffffff',
        fontSize: '42px',
        fontWeight: '800',
        lineHeight: '1.2',
        margin: '0 0 16px 0',
    };

    var pStyle = {
        color: 'rgba(255,255,255,0.72)',
        fontSize: '15px',
        lineHeight: '1.6',
        margin: '0 0 28px 0',
    };

    var aStyle = {
        display: 'inline-block',
        background: slide.accentColor,
        color: '#fff',
        padding: '12px 28px',
        borderRadius: '8px',
        textDecoration: 'none',
        fontWeight: '700',
        fontSize: '15px',
    };

    var circleStyle = {
        position: 'absolute',
        right: '56px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '220px',
        height: '220px',
        borderRadius: '50%',
        border: '2px dashed ' + slide.accentColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    var counterStyle = {
        position: 'absolute',
        bottom: '20px',
        right: '56px',
        color: 'rgba(255,255,255,0.3)',
        fontSize: '13px',
        letterSpacing: '2px',
    };

    var navBase = {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'rgba(255,255,255,0.15)',
        border: '1px solid rgba(255,255,255,0.25)',
        color: '#ffffff',
        width: '38px',
        height: '38px',
        borderRadius: '50%',
        cursor: 'pointer',
        fontSize: '20px',
        zIndex: 10,
        lineHeight: '38px',
        textAlign: 'center',
        padding: '0',
    };

    var dotsWrap = {
        position: 'absolute',
        bottom: '18px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '8px',
        zIndex: 10,
    };

    function dotStyle(i) {
        return {
            width: i === currentIndex ? '24px' : '8px',
            height: '8px',
            borderRadius: '4px',
            background: i === currentIndex ? slide.accentColor : 'rgba(255,255,255,0.35)',
            border: 'none',
            cursor: 'pointer',
            padding: '0',
            transition: 'all 0.3s ease',
        };
    }

    function handleCtaClick(e) {
        if (isDragging) { e.preventDefault(); }
    }

    function handlePrev(e) { e.stopPropagation(); prev(); }
    function handleNext(e) { e.stopPropagation(); next(); }
    function handleDot(i) {
        return function(e) { e.stopPropagation(); jumpTo(i); };
    }
    function onLeave() { setIsDragging(false); }

    return (
        <section
            style={outerStyle}
            onMouseDown={onDown}
            onMouseUp={onUp}
            onMouseLeave={onLeave}
            onTouchStart={onDown}
            onTouchEnd={onUp}
        >
            <div style={innerStyle}>

                <div style={{ position: 'absolute', top: '24px', left: '56px' }}>
                    <span style={tagStyle}>{slide.tag}</span>
                </div>

                <div style={{ maxWidth: '55%', zIndex: 2 }}>
                    <h2 style={h2Style}>{slide.title}</h2>
                    <p style={pStyle}>{slide.subtitle}</p>
                    <a href={slide.ctaLink} onClick={handleCtaClick} style={aStyle}>
                        {slide.ctaText}
                    </a>
                </div>

                <div style={circleStyle}>
                    {slide.imageUrl
                        ? (
                            <img
                                src={slide.imageUrl}
                                alt={slide.title}
                                draggable={false}
                                style={{ width: '90%', height: '90%', objectFit: 'contain', borderRadius: '50%' }}
                            />
                        )
                        : (
                            <span style={{ color: slide.accentColor, fontSize: '13px', textAlign: 'center', opacity: 0.7 }}>
                                Anh banner
                            </span>
                        )
                    }
                </div>

                <div style={counterStyle}>
                    {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </div>

            </div>

            {total > 1
                ? (
                    <button
                        onClick={handlePrev}
                        style={Object.assign({}, navBase, { left: '14px' })}
                        aria-label="Slide truoc"
                    >
                        {'<'}
                    </button>
                )
                : null
            }

            {total > 1
                ? (
                    <button
                        onClick={handleNext}
                        style={Object.assign({}, navBase, { right: '14px' })}
                        aria-label="Slide tiep"
                    >
                        {'>'}
                    </button>
                )
                : null
            }

            {total > 1
                ? (
                    <div style={dotsWrap}>
                        {slideList.map(function(item, i) {
                            return (
                                <button
                                    key={item.id}
                                    onClick={handleDot(i)}
                                    style={dotStyle(i)}
                                    aria-label={'Slide ' + (i + 1)}
                                />
                            );
                        })}
                    </div>
                )
                : null
            }

        </section>
    );
}

export default HeroBanner;