import { useState, useEffect, useRef } from "react";

import "./Filter.css";

function Filter({ units, activeUnits, changeFilter }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(undefined);
    const buttonRef = useRef(undefined);

    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    const handleSelect = (unit) => {
        const isSelected = activeUnits.has(unit);
        const newSelection = new Set(activeUnits);
        isSelected ? newSelection.delete(unit) : newSelection.add(unit);
        changeFilter(newSelection);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            const isDropdownClick =
                dropdownRef.current &&
                dropdownRef.current.contains(event.target);
            const isButtonClick =
                buttonRef.current && buttonRef.current.contains(event.target);

            if (isDropdownClick || isButtonClick) return;
            setIsOpen(false);
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef, buttonRef]);

    return (
        <div className="filter">
            <button
                className="filter-button"
                ref={buttonRef}
                onClick={handleClick}
            >
                Aktive Kurseinheiten
            </button>
            {isOpen && (
                <div>
                    <div ref={dropdownRef} className="filter-dropdown">
                        {Array.from(units).map((unit) => (
                            <label key={unit}>
                                <input
                                    type="checkbox"
                                    value={unit}
                                    checked={activeUnits.has(unit)}
                                    onChange={() => handleSelect(unit)}
                                />
                                {unit}
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Filter;
