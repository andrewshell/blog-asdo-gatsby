import React from "react";
import { graphql, Link } from "gatsby";

import Layout from "../components/layout";
import SEO from "../components/seo";

export default function IndexPage({data}) {
  return (
    <Layout>
      <SEO
        title="All Posts"
      />

      <h1>All Posts</h1>
      <ul>
        {data.allMarkdownRemark.edges.map(({ node }) => {
          return (
            <li key={node.id} className="entry-header">
              <span className="entry-title">
                  <Link to={ node.fields.slug } rel="bookmark">{node.frontmatter.title}</Link>
              </span>
            </li>
          );
        })}
      </ul>
    </Layout>
  );
}

export const query = graphql`query AllPostsQuery{
  allMarkdownRemark(
    filter: { frontmatter: { published: { ne: false } }, fields: { sourceInstanceName: { eq: "posts" } } },
    sort: {fields: [frontmatter___date], order: DESC}
  ) {
    edges {
      node {
        frontmatter {
          title
          date(formatString: "MMMM YYYY")
        }
        fields {
          slug
        }
        id
      }
    }
  }
}`
