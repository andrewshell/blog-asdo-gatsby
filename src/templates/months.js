import React from "react";
import { graphql, Link } from "gatsby";
import moment from "moment";

import Layout from "../components/journal/layout";
import Loop from "../components/journal/loop";
import PageNav from "../components/journal/pagenav";

export default function MonthTemplate({ data, pageContext }) {
  const siteUrl = data.site.siteMetadata.siteUrl;
  const month = moment(pageContext.slug, "YYYY-MM");

  return (
    <Layout>
      <main id="gh-main" class="gh-main">
        <article class="gh-article post no-image">
          <header class="gh-article-header gh-canvas">
            <h1 class="gh-article-title">{ month.format('MMMM YYYY') }</h1>
          </header>

          <div class="gh-content gh-canvas">
          {data.allMarkdownRemark.nodes.map((node) => {
            return (
              <Loop post={ node } key={ node.id } />
            )
          })}
          </div>

          <footer class="gh-article-footer gh-canvas">
            <nav class="gh-navigation">
              <div class="gh-navigation-previous">
                <PageNav
                  slug={ pageContext.previousMonth ? `/${pageContext.previousMonth}/` : null }
                  label="&laquo; Previous month"
                  title={ pageContext.previousMonth ? moment(pageContext.previousMonth, "YYYY-MM").format('MMMM YYYY') : '' }
                />
              </div>

              <div class="gh-navigation-middle"></div>

              <div class="gh-navigation-next">
                <PageNav
                  slug={ pageContext.nextMonth ? `/${pageContext.nextMonth}/`: null }
                  label="Next month &raquo;"
                  title={ pageContext.nextMonth ? moment(pageContext.nextMonth, "YYYY-MM").format('MMMM YYYY') : '' }
                />
              </div>
            </nav>
          </footer>
        </article>
      </main>
    </Layout>
  );
}

export const query = graphql`query MonthQuery($slug: String!) {
  site {
    siteMetadata {
      siteUrl
    }
  }
  allMarkdownRemark(
    filter: {
      frontmatter: {
        published: { ne: false }
      },
      fields: {
        sourceInstanceName: { eq: "posts" },
        month: { eq: $slug }
      }
    },
    sort: {fields: [frontmatter___date], order: DESC}
  ) {
    nodes {
      id,
      excerpt
      timeToRead
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
  }
}`;
