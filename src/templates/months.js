import React from "react";
import { graphql, Link } from "gatsby";
import moment from "moment";

import Layout from "../components/layout";
import SEO from "../components/seo";

export default function MonthTemplate({ data, pageContext }) {
  const siteUrl = data.site.siteMetadata.siteUrl;
  const month = moment(pageContext.slug, "YYYY-MM");

  return (
    <Layout>
      <SEO title={ month.format('MMMM YYYY') } />

      <h1>{ month.format('MMMM YYYY') }</h1>
      {data.allMarkdownRemark.nodes.map((post) => {
        const permalink = `${siteUrl}${post.fields.slug || "/"}`;

        let publishedTime = '';

        if (post.frontmatter.iso8601) {
          publishedTime = `on <a className="u-url u-uid" href="${ permalink }"><time className="dt-published" datetime="${ post.frontmatter.iso8601 }">${ moment(post.frontmatter.iso8601).format(`MMMM DD, YYYY`) }</time></a>`;

          if (post.frontmatter.updated && post.frontmatter.updated !== post.frontmatter.iso8601) {
            publishedTime += ` and updated on <time className="dt-published" datetime="${ post.frontmatter.updated }">${ moment(post.frontmatter.updated).format(`MMMM DD, YYYY`) }</time>`;
          }
        }

        return (
          <article className="h-entry mb-4">
            <header>
              <h2 className="p-name">{ post.frontmatter.title }</h2>
            </header>
            <div className="e-content" dangerouslySetInnerHTML={{ __html: post.html }} />
            <div className="text-xs">
              Published by <a className="p-author h-card" href="https://blog.andrewshell.org/">Andrew Shell</a> <span dangerouslySetInnerHTML={{ __html: publishedTime }} />
            </div>
          </article>
        );
      })}
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
  }
}`;
