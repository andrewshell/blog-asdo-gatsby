import { graphql, useStaticQuery, Link } from "gatsby";
import React, { useState } from "react";
import geekityIcon from '../images/geekity_icon.svg';

function Header() {
  const [isExpanded, toggleExpansion] = useState(false);
  const { site } = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <header className="bg-gray-200 border-b border-gray-400">
      <div className="flex flex-wrap items-center justify-between max-w-4xl mx-auto p-4 md:p-8">
        <Link className="flex items-center" to="/">
          <img src={ geekityIcon } alt="Geekity" style={ { height: '40px' } } />
          <span className="font-bold text-xl tracking-tight">
            {site.siteMetadata.title}
          </span>
        </Link>

        <button
          className="block md:hidden bg-white border border-gray-400 flex items-center px-3 py-2 rounded"
          onClick={() => toggleExpansion(!isExpanded)}
        >
          <svg
            className="fill-current h-3 w-3"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>

        <nav
          className={`${
            isExpanded ? `block` : `hidden`
          } md:block md:flex md:items-center w-full md:w-auto`}
        >
          {[
            {
              route: `/andrew/`,
              title: `About`
            },
            {
              route: `/contact-andrew/`,
              title: `Contact`
            },
            {
              route: `/search/`,
              title: `Search`
            }
          ].map(link => (
            <Link
              className="block md:inline-block mt-4 md:mt-0 md:ml-6"
              key={link.title}
              to={link.route}
            >
              {link.title}
            </Link>
          ))}
        <a
          className="block md:inline-block mt-4 md:mt-0 md:ml-6"
          href="https://amzn.to/2gdI0Ua"
          rel="nofollow"
        >
            Wishlist
        </a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
