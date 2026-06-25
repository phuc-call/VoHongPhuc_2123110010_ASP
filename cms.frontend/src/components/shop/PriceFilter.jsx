// =====================================================
// src/components/shop/PriceFilter.jsx
// 2 ô nhập Đơn giá Min - Max. Debounce 500ms trước khi báo lên component cha
// để không gọi API liên tục khi người dùng đang gõ.
// =====================================================
import React, { useState, useEffect, useRef } from 'react';
import './PriceFilter.css';

function PriceFilter({ onChange, minLimit = 0, maxLimit = 10000000 }) {
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const debounceRef = useRef(null);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            const min = minPrice === '' ? undefined : Number(minPrice);
            const max = maxPrice === '' ? undefined : Number(maxPrice);
            onChange({ minPrice: min, maxPrice: max });
        }, 500);

        return () => clearTimeout(debounceRef.current);
    }, [minPrice, maxPrice]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleReset = () => {
        setMinPrice('');
        setMaxPrice('');
    };

    return (
        <div className="sn-price-filter">
            <h6 className="sn-price-filter__title">Khoảng giá</h6>
            <div className="sn-price-filter__inputs">
                <input
                    type="number"
                    inputMode="numeric"
                    min={minLimit}
                    placeholder="Từ (VNĐ)"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="sn-price-filter__input"
                />
                <span className="sn-price-filter__dash">—</span>
                <input
                    type="number"
                    inputMode="numeric"
                    max={maxLimit}
                    placeholder="Đến (VNĐ)"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="sn-price-filter__input"
                />
            </div>
            {(minPrice !== '' || maxPrice !== '') && (
                <button className="sn-price-filter__reset" onClick={handleReset}>
                    Xoá lọc giá
                </button>
            )}
        </div>
    );
}

export default PriceFilter;
