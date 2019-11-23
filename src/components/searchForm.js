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
    <form role="search" autocomplete="off" method="GET" onSubmit={ handleSubmit } className="mb-4 flex w-auto">
      <input
        type="text"
        id="search-input"
        name="keywords"
        className="flex-grow flex-shrink w-full rounded-l-lg p-2 md:p-4 border-t mr-0 border-b border-l text-gray-800 border-gray-500 bg-white"
        aria-controls="search-results-count"
        onChange={ handleChange }
        value={ localQuery }
      />
      <button
        type="submit"
        className="flex-none md:px-8 rounded-r-lg bg-green-700 text-white font-bold p-2 md:p-4 uppercase border-green-900 border-t border-b border-r"
      >Submit</button>
    </form>
  );

};

export default SearchForm;
