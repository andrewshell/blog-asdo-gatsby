import { graphql, useStaticQuery, Link } from "gatsby";
import React from "react";
import moment from "moment-timezone";

function Loop({ post }) {
  return (
    <article className="gh-card" key={ post.id }>
      <Link to={ post.fields.slug } rel="bookmark" className="gh-card-link">
        <header className="gh-card-header">
          <h2 className="gh-card-title">{ post.frontmatter.title }</h2>
        </header>
        <div className="gh-card-excerpt" dangerouslySetInnerHTML={{ __html: post.excerpt }}></div>
        <footer className="gh-card-meta">
          <time className="gh-card-date" dateTime={ post.frontmatter.iso8601 }>{ moment(post.frontmatter.updated).format(`MMMM DD, YYYY`) }</time>
          —
          <span className="gh-card-meta-wrapper">
            <span className="gh-card-duration">{ post.timeToRead } min read</span>
          </span>
        </footer>
      </Link>
    </article>
  );
}

export default Loop;
