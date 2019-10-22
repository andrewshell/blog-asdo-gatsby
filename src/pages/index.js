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

    {data.allMarkdownRemark.edges.map(({node}) => (
      <article key={node.id} className="post pb-8 mb-10 border-b border-gray-200">
        <header className="entry-header">
          <h2 className="entry-title">
            <Link to={node.frontmatter.slug} rel="bookmark">{node.frontmatter.title}</Link>
          </h2>
        </header>
        <div className="entry-content">
          <div className="entry-summary">
            <p>{node.excerpt}</p>
          </div>
        </div>
      </article>
    ))}
    </Layout>
  );
}

export const query = graphql`query HomePageQuery{
  allMarkdownRemark(sort: {fields: [frontmatter___date], order: DESC}) {
    totalCount
    edges {
      node {
        frontmatter {
          title
          slug
          date
          author
        }
        excerpt(pruneLength: 240)
        timeToRead
      }
    }
  }
}`
