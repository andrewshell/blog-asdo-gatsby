import React from "react";
import { graphql } from "gatsby";
import moment from "moment";

import Layout from "../components/journal/layout";
import PageNav from "../components/journal/pagenav";

export default function PostTemplate({ data, pageContext }) {
  const post = data.markdownRemark;
  const { previous, next } = data;

  return (
    <Layout>
      <main id="gh-main" class="gh-main">
        <article class="gh-article post no-image">
          <header class="gh-article-header gh-canvas">
            <span class="gh-article-meta">
              <time datetime="{ post.frontmatter.iso8601 }">{ moment(post.frontmatter.updated).format(`MMMM DD, YYYY`) }</time>
            </span>
            <h1 class="gh-article-title">{ post.frontmatter.title }</h1>
          </header>

          <div class="gh-content gh-canvas"dangerouslySetInnerHTML={{ __html: post.html }}></div>

          <footer class="gh-article-footer gh-canvas">
            <nav class="gh-navigation">
              <div class="gh-navigation-previous">
                <PageNav
                  slug={ previous?.fields?.slug }
                  label="&laquo; Previous essay"
                  title={previous?.frontmatter?.title}
                />
              </div>

              <div class="gh-navigation-middle"></div>

              <div class="gh-navigation-next">
                <PageNav
                  slug={ next?.fields?.slug }
                  label="Next essay &raquo;"
                  title={next?.frontmatter?.title}
                />
              </div>
            </nav>
          </footer>
        </article>
      </main>
    </Layout>
  );
}

export const query = graphql`query PostQuery(
  $slug: String!
  $previousNodeId: String
  $nextNodeId: String
) {
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
  previous: markdownRemark(id: { eq: $previousNodeId }) {
    fields {
      slug
    }
    frontmatter {
      title
    }
  }
  next: markdownRemark(id: { eq: $nextNodeId }) {
    fields {
      slug
    }
    frontmatter {
      title
    }
  }
}`;
