import React, { useState, useEffect } from "react";
import { graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"
import SearchForm from "../components/searchForm";
import SearchResults from "../components/searchResults";

const SearchPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
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
  }, [searchQuery]);

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
    <Layout location={location} title={siteTitle}>
      <Seo title="Search" />
      <SearchForm
        query={ searchQuery }
        onUpdate={ onUpdate }
      />
      <SearchResults
        query={ searchQuery }
        results={ results }
      />
      <hr />
      <footer>
        <Bio />
      </footer>
    </Layout>
  );
}

export default SearchPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`

