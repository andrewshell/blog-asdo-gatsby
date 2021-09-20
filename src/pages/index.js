import React from "react";
import { graphql, Link } from "gatsby";
import moment from "moment";

import Layout from "../components/layout";
import SeoBlogPosting from "../components/seo-blogposting";

export default function IndexPage({data}) {
  const post = data.allMarkdownRemark.nodes[0];
  const next = data.allMarkdownRemark.nodes[1];
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
        <nav className="flex flex-row justify-between my-4">
          <a className="block" rel="prev"></a>
          <Link to={ next.fields.slug } className="block" rel="next">{ next.frontmatter.title }</Link>
        </nav>
      </article>
    </Layout>
  );
}

export const query = graphql`query HomePageQuery{
  site {
    siteMetadata {
      siteUrl
    }
  }
  allMarkdownRemark(
    filter: { frontmatter: { published: { ne: false } }, fields: { sourceInstanceName: { eq: "posts" } } },
    sort: {fields: [frontmatter___date], order: DESC}
    limit: 2
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
}`
