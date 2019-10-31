import React from "react";
import { graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx"

import Layout from "../components/layout";
import SEO from "../components/seo";

export default ({ data }) => {
  const post = data.mdx;
  return (
    <Layout>
      <SEO
        title={post.frontmatter.title}
      />
      <article className="post">
        <header className="entry-header">
          <h1 className="entry-title">{post.frontmatter.title}</h1>
        </header>
        <div className="entry-content"><MDXRenderer>{node.body}</MDXRenderer></div>
      </article>
    </Layout>
  );
};

export const query = graphql`query PostQuery($slug: String!) {
    mdx(frontmatter: { slug: { eq: $slug } }) {
      body
      frontmatter {
        title
        author
        date
      }
    }
  }`;
