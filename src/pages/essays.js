import React from "react";
import { graphql, Link } from "gatsby";

import Layout from "../components/journal/layout";

export default function IndexPage({data}) {
  return (
    <Layout>
      <main id="gh-main" class="gh-main">
        <article class="gh-article post no-image">
          <header class="gh-article-header gh-canvas">
            <h1 class="gh-article-title">Essays</h1>
          </header>

          <div class="gh-content gh-canvas"><ul>
          {data.allMarkdownRemark.nodes.map((node) => {
            return (
              <li key={ node.id }><Link to={ node.fields.slug }>{ node.frontmatter.title }</Link></li>
            )
          })}
          </ul></div>
        </article>
      </main>
    </Layout>
  );
}

export const query = graphql`query AllArticlesQuery{
  allMarkdownRemark(
    filter: { frontmatter: { published: { ne: false } }, fields: { sourceInstanceName: { eq: "posts" } } },
    sort: {fields: [frontmatter___date], order: DESC}
  ) {
    nodes {
      id
      frontmatter {
        title
      }
      fields {
        slug
      }
    }
  }
}`
