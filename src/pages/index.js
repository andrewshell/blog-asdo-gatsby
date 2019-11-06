import React from "react";
import { graphql, Link } from "gatsby";

import Layout from "../components/layout";
import SEO from "../components/seo";

export default function IndexPage({data}) {
  return (
    <Layout>
      <SEO
        keywords={[`gatsby`, `tailwind`, `react`, `tailwindcss`]}
        title="Home"
      />

    {data.allMarkdownRemark.edges.map(({node}) => {
      if (false === node.frontmatter.published) {
        return (
          <article key={node.id}></article>
        );
      }

      return (
        <article key={node.id} className="post mb-6 border-b border-gray-200">
          <header className="entry-header">
            <h2 className="entry-title">
              <Link to={ node.fields.slug } rel="bookmark">{node.frontmatter.title}</Link>
            </h2>
          </header>
          <div className="entry-content">
            <div className="entry-summary">
              <p>{node.excerpt}</p>
            </div>
          </div>
        </article>
      );
    })}
    </Layout>
  );
}

export const query = graphql`query HomePageQuery{
  allMarkdownRemark(
    filter: { fields: { sourceInstanceName: { eq: "posts" } } },
    sort: {fields: [frontmatter___date], order: DESC}
  ) {
    totalCount
    edges {
      node {
        frontmatter {
          title
          date
          published
        }
        fields {
          slug
        }
        excerpt(pruneLength: 240)
        timeToRead
        id
      }
    }
  }
}`
