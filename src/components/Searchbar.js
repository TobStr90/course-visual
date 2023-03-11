import React from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";

function Searchbar(props) {
  // const handleOnSearch = (string, results) => {
  //   console.log(string, results);
  // };

  // const handleOnHover = (result) => {
  //   console.log(result);
  // };

  const handleOnSelect = (item) => {
    props.handleOnSelect(item);
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
        <div style={{ width: 1000, margin: 20 }}>
          <div style={{ marginBottom: 20 }}>Search for nodes</div>
          <ReactSearchAutocomplete
            items={props.items}
            // onSearch={handleOnSearch}
            // onHover={handleOnHover}
            onSelect={handleOnSelect}
            // onFocus={handleOnFocus}
            // onClear={handleOnClear}
            styling={{ zIndex: 4 }} // To display it on top of the search box below
            autoFocus
          />
        </div>
      </header>
    </div>
  );
}

export default Searchbar;
