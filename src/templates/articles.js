import React from "react";
import { graphql } from "gatsby";
import moment from "moment";

import Layout from "../components/layout";
import SeoBlogPosting from "../components/seo-blogposting";

export default function ArticleTemplate({ data }) {
  const post = data.markdownRemark;
  const siteUrl = data.site.siteMetadata.siteUrl;
  const permalink = `${siteUrl}${post.fields.slug || "/"}`;

  let publishedTime = '';

  if (post.frontmatter.iso8601) {
    publishedTime = `on <a className="u-url u-uid" href="${ permalink }"><time className="dt-published" datetime="${ post.frontmatter.iso8601 }">${ moment(post.frontmatter.iso8601).format(`MMMM DD, YYYY`) }</time></a>`;

    if (post.frontmatter.updated && post.frontmatter.updated !== post.frontmatter.iso8601) {
      publishedTime += ` and updated on <time className="dt-published" datetime="${ post.frontmatter.updated }">${ moment(post.frontmatter.updated).format(`MMMM DD, YYYY`) }</time>`;
    }
  }

  return (
    <Layout>
      <SeoBlogPosting
        title={ post.frontmatter.title }
        pathname={ post.fields.slug }
        created={ post.frontmatter.iso8601 }
        updated={ post.frontmatter.updated ? post.frontmatter.updated : post.frontmatter.iso8601 }
      />
      <article className="h-entry">
        <header>
          <h1 className="p-name">{ post.frontmatter.title }</h1>
        </header>
        <div className="e-content" dangerouslySetInnerHTML={{ __html: post.html }} />
        <div className="text-xs">
          Published by <a className="p-author h-card" href="https://blog.andrewshell.org/">Andrew Shell</a> <span dangerouslySetInnerHTML={{ __html: publishedTime }} />
        </div>
      </article>
    </Layout>
  );
}

export const query = graphql`query ArticleQuery($slug: String!) {
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
