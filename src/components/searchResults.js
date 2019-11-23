import React from 'react';
import { Link } from "gatsby";

const SearchResults = ({ query, results }) => (
  <section aria-label="Search results for all posts">
    {!!results.length && query &&
      <div className="mb-4 text-xs text-gray-500">{results.length} results</div>
    }
    {!!results.length && query &&
      <div>
        {results.map(({
          title,
          url,
          date,
          excerpt
        }) => (
          <article key={title} className="post mb-6 border-b border-gray-200">
            <header className="entry-header">
              <h2 className="entry-title">
                <Link to={ url } rel="bookmark">{ title }</Link>
              </h2>
            </header>
            <div className="entry-content">
              <div className="entry-summary">
                <p>{ excerpt }</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    }
  </section>
);

export default SearchResults;
