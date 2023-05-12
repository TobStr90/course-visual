import React from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";

import "./SearchBar.css";

function SearchBar({ items, onSelect, width }) {
    items.forEach((item) => {
        if (item.chapter) item.keyName = item.chapter + " " + item.name;
        else item.keyName = item.name;
    });
    // const handleOnSearch = (string, results) => {
    //   console.log(string, results);
    // };

    // const handleOnHover = (result) => {
    //   console.log(result);
    // };

    const handleOnSelect = (item) => {
        onSelect(item);
    };

    // const handleOnFocus = () => {
    //   console.log("Focused");
    // };

    // const handleOnClear = () => {
    //   console.log("Cleared");
    // };

    return (
        <div className="Searchbar">
            <header className="Searchbar-header">
                <div style={{ width: width, margin: 10 }}>
                    <ReactSearchAutocomplete
                        items={items}
                        // onSearch={handleOnSearch}
                        // onHover={handleOnHover}
                        onSelect={handleOnSelect}
                        // onFocus={handleOnFocus}
                        // onClear={handleOnClear}
                        styling={{ zIndex: 4, borderRadius: 0 }}
                        autoFocus
                        resultStringKeyName={"keyName"}
                        placeholder={"Knoten suchen"}
                        fuseOptions={{
                            keys: ["name", "chapter"],
                        }}
                    />
                </div>
            </header>
        </div>
    );
}

export default SearchBar;
