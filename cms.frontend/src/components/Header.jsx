import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Header({ cartCount = 0 }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchKeyword, setSearchKeyword] = useState('');

    // Submit search -> navigate to /shop?keyword=... to trigger the real search API
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const trimmed = searchKeyword.trim();
        if (!trimmed) return;
        navigate(`/shop?keyword=${encodeURIComponent(trimmed)}`);
    };

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/', label: 'Home' },
        { path: '/shop', label: 'Shop' },
        { path: '/blog', label: 'Blog' },
        { path: '/about', label: 'About Us' },
    ];

    return (
        <header className="sn-header">
            {/* Design tokens + component styles.
               Tip: move this into Header.css and put the Google Fonts <link>
               in public/index.html for better load performance. */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Barlow+Semi+Condensed:wght@500;600;700&family=Be+Vietnam+Pro:wght@400;500;600&family=Roboto+Mono:wght@500;700&display=swap');

                .sn-header {
                    --color-primary: #E8191A;
                    --color-secondary: #2C2C2C;
                    --color-bg: #F5F5F5;
                    --color-dark: #1A1A1A;
                    --color-accent: #FF8C00;
                    --color-border: #D9D9D9;
                    --color-on-dark: #FFFFFF;
                    font-family: 'Be Vietnam Pro', sans-serif;
                }

                /* Top utility bar */
                .sn-topbar { background: var(--color-dark); }
                .sn-topbar-inner {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 8px 24px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 13px;
                }
                .sn-topbar-contact span { margin-right: 24px; color: rgba(255,255,255,0.75); }
                .sn-topbar-contact i { color: var(--color-accent); margin-right: 6px; }
                .sn-topbar-links a {
                    color: rgba(255,255,255,0.85);
                    text-decoration: none;
                    margin-left: 20px;
                    transition: color .2s;
                }
                .sn-topbar-links a:hover { color: var(--color-accent); }

                /* Main header row */
                .sn-main { background: #FFFFFF; border-bottom: 1px solid var(--color-border); }
                .sn-main-inner {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 18px 24px;
                    display: flex;
                    align-items: center;
                    gap: 32px;
                }
                .sn-logo {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-weight: 800;
                    font-size: 28px;
                    color: var(--color-primary);
                    text-decoration: none;
                    letter-spacing: 0.5px;
                    white-space: nowrap;
                }
                .sn-logo span { color: var(--color-accent); }

                .sn-search { flex: 1; display: flex; max-width: 560px; }
                .sn-search input {
                    flex: 1;
                    border: 1px solid var(--color-border);
                    border-right: none;
                    border-radius: 6px 0 0 6px;
                    padding: 10px 16px;
                    font-family: 'Be Vietnam Pro', sans-serif;
                    font-size: 15px;
                    color: #3D3D3D;
                    outline: none;
                    transition: border-color .2s;
                }
                .sn-search input:focus { border-color: var(--color-primary); }
                .sn-search button {
                    border: none;
                    background: var(--color-primary);
                    color: #FFFFFF;
                    font-size: 14px;
                    font-weight: 600;
                    padding: 0 22px;
                    border-radius: 0 6px 6px 0;
                    cursor: pointer;
                    transition: background .2s;
                }
                .sn-search button:hover { background: #c91314; }

                .sn-cart {
                    position: relative;
                    display: flex;
                    align-items: center;
                    color: var(--color-secondary);
                    text-decoration: none;
                    font-size: 22px;
                    margin-left: auto;
                }
                .sn-cart-badge {
                    position: absolute;
                    top: -8px;
                    right: -12px;
                    background: var(--color-accent);
                    color: #FFFFFF;
                    font-family: 'Roboto Mono', monospace;
                    font-size: 12px;
                    font-weight: 600;
                    line-height: 1;
                    padding: 3px 6px;
                    border-radius: 999px;
                    min-width: 18px;
                    text-align: center;
                }

                /* Navigation */
                .sn-nav { background: var(--color-bg); }
                .sn-nav-inner {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 24px;
                    display: flex;
                    gap: 36px;
                }
                .sn-nav-link {
                    font-family: 'Barlow Semi Condensed', sans-serif;
                    font-size: 14px;
                    font-weight: 500;
                    color: var(--color-secondary);
                    text-decoration: none;
                    padding: 14px 0;
                    border-bottom: 2px solid transparent;
                    transition: color .2s, border-color .2s;
                }
                .sn-nav-link:hover { color: var(--color-primary); }
                .sn-nav-link.active {
                    color: var(--color-primary);
                    font-weight: 600;
                    border-bottom-color: var(--color-primary);
                }

                @media (max-width: 768px) {
                    .sn-search { display: none; }
                    .sn-nav-inner { gap: 20px; overflow-x: auto; }
                    .sn-topbar-contact span:last-child { display: none; }
                }
            `}</style>

            {/* Top utility bar */}
            <div className="sn-topbar">
                <div className="sn-topbar-inner">
                    <div className="sn-topbar-contact">
                        <span><i className="fas fa-phone-alt"></i>Hotline: 090x.xxx.xxx</span>
                        <span><i className="fas fa-envelope"></i>support@shopnhanh.com</span>
                    </div>
                    <div className="sn-topbar-links">
                        <Link to="/login"><i className="fas fa-user mr-1"></i> Login</Link>
                        <Link to="/register"><i className="fas fa-user-plus mr-1"></i> Sign Up</Link>
                    </div>
                </div>
            </div>

            {/* Logo / search / cart */}
            <div className="sn-main">
                <div className="sn-main-inner">
                    <Link to="/" className="sn-logo">
                        ShopNhanh<span>.Fashion</span>
                    </Link>

                    <form className="sn-search" onSubmit={handleSearchSubmit}>
                        <input
                            type="text"
                            placeholder="Search for products, brands, categories..."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                        <button type="submit"><i className="fas fa-search"></i></button>
                    </form>

                    <Link to="/cart" className="sn-cart">
                        <i className="fas fa-shopping-bag"></i>
                        <span className="sn-cart-badge">{cartCount}</span>
                    </Link>
                </div>
            </div>

            {/* Main navigation */}
            <nav className="sn-nav">
                <div className="sn-nav-inner">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`sn-nav-link ${isActive(item.path) ? 'active' : ''}`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </nav>
        </header>
    );
}

export default Header;