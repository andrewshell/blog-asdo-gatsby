import { graphql, useStaticQuery, Link } from "gatsby";
import React from "react";

export function PageNav({ slug, label, title }) {
  if (slug) {
    return (
      <Link to={ slug } className="gh-navigation-link">
        <span class="gh-navigation-label">{ label }</span>
        <h4 class="gh-navigation-title">{ title }</h4>
      </Link>
    );
  }
  return '';
}

export default PageNav;
