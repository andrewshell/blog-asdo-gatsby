import React, { useState, useEffect } from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import SearchForm from "../components/searchForm";
import SearchResults from "../components/searchResults";

export default function SearchPage({ data, location }) {
  const [results, setResults] = useState([]);
  const searchQuery = new URLSearchParams(location.search).get('keywords') || '';

  useEffect(() => {
    if (window.__LUNR__) {
      window.__LUNR__.__loaded.then(lunr => {
        const refs = lunr.en.index.search(searchQuery);
        const posts = refs.map(({ ref }) => lunr.en.store[ref]);
        setResults(posts);
      });
    }
  }, []);

  return (
    <Layout>
      <SEO title="Search" />
      <SearchForm query={searchQuery} />
      <SearchResults
        query={searchQuery}
        results={results}
      />
    </Layout>
  );
}
