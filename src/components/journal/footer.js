import { graphql, useStaticQuery, Link } from "gatsby";
import React from "react";
import moment from "moment";

function Footer() {
  const { site } = useStaticQuery(graphql`
    query JournalFooterSiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <footer className="gh-foot gh-outer">
      <div className="gh-foot-inner gh-inner">
        <div className="gh-copyright">
          { site.siteMetadata.title } © { moment().format('YYYY') }
        </div>
        <nav className="gh-foot-menu"></nav>
        <div className="gh-powered-by">
          <a href="https://www.gatsbyjs.org/" target="_blank" rel="noopener">Powered by Gatsby</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
