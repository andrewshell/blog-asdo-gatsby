import React from 'react';
import { Link } from "gatsby";

const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)

const SearchResults = ({ query, results }) => (
  <section aria-label="Search results for all posts">
    {!!results.length && query &&
      <div className="mb-4 text-xs text-gray-500">{results.length} results</div>
    }
    {!!results.length && query &&
      <ol style={{ listStyle: `none` }}>
        {results.map(({ title, url, date, excerpt }) => {
          return (
            <li key={ title }>
              <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <header>
                  <h2>
                    <Link to={ url } itemProp="url">
                      <span itemProp="headline">{ title }</span>
                    </Link>
                  </h2>
                  <small>{ dayjs(date).tz(process.env.GATSBY_TIMEZONE).format('MMMM DD, YYYY') }</small>
                </header>
                <section>
                  <p
                    dangerouslySetInnerHTML={{ __html: excerpt }}
                    itemProp="description"
                  />
                </section>
              </article>
            </li>
          )
        })}
      </ol>
    }
  </section>
);

export default SearchResults;
