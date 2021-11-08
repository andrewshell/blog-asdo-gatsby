import React, { useState } from "react";
import { navigate } from 'gatsby';

const SearchForm = ({ query, onUpdate }) => {

  const [localQuery, setQuery] = useState(query);

  function handleChange(e) {
    setQuery(e.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();

    navigate(`/search/?keywords=${encodeURIComponent(localQuery)}`);
    onUpdate(localQuery);
  }

  return (
    <form role="search" autoComplete="off" method="GET" onSubmit={ handleSubmit } className="searchform">
      <input
        type="text"
        id="search-input"
        name="keywords"
        aria-controls="search-results-count"
        onChange={ handleChange }
        value={ localQuery }
      />
      <button type="submit">Search</button>
    </form>
  );

};

export default SearchForm;
