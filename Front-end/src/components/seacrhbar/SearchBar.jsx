
import React, { useState } from "react";
import style from "./searchbar.module.css";

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const handleSearch = () => {
   
    
      onSearch(searchQuery);
    
  };
  return (
    <div className={style["search-container"]}>
      <input
        className={style["search-input"]}
        onChange={handleChange}
        type="search"
        placeholder="Buscar por nombre o id"
        value={searchQuery}
      />
      <button
        className={style["search-button"]}
        onClick={handleSearch}
      >
        Buscar
      </button>
    </div>
  );
};

export default SearchBar;
