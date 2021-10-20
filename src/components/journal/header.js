import { graphql, useStaticQuery, Link } from "gatsby";
import React, { useState } from "react";
import Helmet from "react-helmet";

function Header() {
  const [isExpanded, toggleExpansion] = useState(false);
  const { site } = useStaticQuery(graphql`
    query JournalHeaderSiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <header id="gh-head" className="gh-head gh-outer">
      <Helmet>
        <body className={`${ isExpanded ? 'is-head-open' : '' } is-head-b--a_n`}></body>
      </Helmet>
      <div className="gh-head-inner gh-inner">
        <div className="gh-head-brand">
          <Link className="gh-head-logo" to="/">{ site.siteMetadata.title }</Link>
          <button className="gh-burger" onClick={() => toggleExpansion(!isExpanded)}></button>
        </div>
        <nav className="gh-head-menu">
          <ul className="nav">
          {[
            {
              route: `/`,
              title: `Home`
            },
            {
              route: `/about/`,
              title: `About`
            },
            {
              route: `/contact/`,
              title: `Contact`
            },
            {
              route: `/now/`,
              title: `Now`
            }
          ].map(link => (
            <li key={link.title}>
              <Link to={link.route}>
                {link.title}
              </Link>
            </li>
          ))}
          <li><a href="https://amzn.to/2gdI0Ua">Wishlist</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
