import React from "react";
import { graphql } from "gatsby";

import Layout from "../components/layout";
import SEO from "../components/seo";

export default ({ data }) => {
  const post = data.markdownRemark;
  return (
    <Layout>
      <SEO
        title={post.frontmatter.title}
      />
      <article className="post">
        <header className="entry-header">
          <h1 className="entry-title">{post.frontmatter.title}</h1>
        </header>
        <div className="entry-content" dangerouslySetInnerHTML = {{ __html: post.html }} />
      </article>
    </Layout>
  );
};

export const query = graphql`query PostQuery($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        author
        date
      }
    }
  }`;
