import React, { useState, useEffect } from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import SearchForm from "../components/searchForm";
import SearchResults from "../components/searchResults";

export default function SearchPage({ data, location }) {
  const keywords = new URLSearchParams(location.search).get('keywords') || '';
  const [results, setResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState(keywords);

  useEffect(() => {
    if (window.__LUNR__) {
      window.__LUNR__.__loaded.then(lunr => {
        let posts = [];
        if ('' !== searchQuery.trim()) {
          const refs = lunr.en.index.search(searchQuery);
          posts = refs.map(({ ref }) => lunr.en.store[ref]);
        }
        setResults(posts);
      });
    }
  }, []);

  function onUpdate(keywords) {
    setSearchQuery(keywords);

    if (window.__LUNR__) {
      window.__LUNR__.__loaded.then(lunr => {
        let posts = [];
        if ('' !== keywords.trim()) {
          const refs = lunr.en.index.search(keywords);
          posts = refs.map(({ ref }) => lunr.en.store[ref]);
        }
        setResults(posts);
      });
    }
  }

  return (
    <Layout>
      <SEO title="Search" />
      <SearchForm
        query={ searchQuery }
        onUpdate={ onUpdate }
      />
      <SearchResults
        query={ searchQuery }
        results={ results }
      />
    </Layout>
  );
}
