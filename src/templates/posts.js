import React from "react";
import { graphql } from "gatsby";

import Layout from "../components/layout";
import SEO from "../components/seo";

export default ({ data }) => {
  const post = data.markdownRemark;
  const siteUrl = data.site.siteMetadata.siteUrl;
  const permalink = `${siteUrl}${post.fields.slug || "/"}`;

  return (
    <Layout>
      <SEO
        title={ post.frontmatter.title }
        pathname={ post.fields.slug }
        article={ true }
      />
      <article className="h-entry">
        <header>
          <h1 className="p-name">{ post.frontmatter.title }</h1>
        </header>
        <div className="e-content" dangerouslySetInnerHTML = {{ __html: post.html }} />
        <div className="text-xs">
          Published by <a className="p-author h-card" href="https://blog.andrewshell.org/">Andrew Shell</a>
          on <a className="u-url u-uid" href={ permalink }><time className="dt-published" datetime={ post.frontmatter.iso8601 }>{ post.frontmatter.date }</time></a>
        </div>
      </article>
    </Layout>
  );
};

export const query = graphql`query PostQuery($slug: String!) {
  site {
    siteMetadata {
      siteUrl
    }
  }
  markdownRemark(fields: { slug: { eq: $slug } }) {
    html
    frontmatter {
      title
      date(formatString: "MMMM DD, YYYY")
      iso8601: date
    }
    fields {
      slug
    }
  }
}`;
