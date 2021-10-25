import React from "react";
import { graphql } from "gatsby";
import moment from "moment-timezone";

import Layout from "../components/journal/layout";

export default function PageTemplate({ data }) {
  const post = data.markdownRemark;

  return (
    <Layout>
      <main id="gh-main" class="gh-main">
        <article class="gh-article post no-image">
          <header class="gh-article-header gh-canvas">
            <h1 class="gh-article-title">{ post.frontmatter.title }</h1>
          </header>

          <div class="gh-content gh-canvas"dangerouslySetInnerHTML={{ __html: post.html }}></div>
        </article>
      </main>
    </Layout>
  );
}

export const query = graphql`query PageQuery($slug: String!) {
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
      updated: updated
    }
    fields {
      slug
    }
  }
}`;
