import React from "react";
import { graphql, Link } from "gatsby";

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"

const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)

export default function IndexPage({ data, location }) {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const months = [...data.allMarkdownRemark.nodes].reduce((months, node) => {
    const month = dayjs(node.frontmatter.date).tz(process.env.GATSBY_TIMEZONE).format('YYYY-MM');
    const monthTitle = dayjs(node.frontmatter.date).tz(process.env.GATSBY_TIMEZONE).format('MMMM YYYY');
    months.titles[month] = { month, monthTitle };
    if (null == months.posts[month]) {
      months.posts[month] = [];
    }
    months.posts[month].push(node);
    return months;
  }, { titles: [], posts: {} });

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="All Essays" />
      <header>
        <h1 itemProp="headline">All Essays</h1>
      </header>
      {Object.values(months.titles).map(({ month, monthTitle }) => {
        return (
          <>
            <h2>{ monthTitle }</h2>
            <ol style={{ listStyle: `none` }}>
              {months.posts[month].map(post => {
                const title = post.frontmatter.title || post.fields.slug

                return (
                  <li key={post.fields.slug} itemScope itemType="http://schema.org/Article">
                    <Link to={post.fields.slug} itemProp="url">
                      <span itemProp="headline">{title}</span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </>
        );
      })}
      <hr />
      <footer>
        <Bio />
      </footer>
    </Layout>
  );
}

export const query = graphql`query AllEssaysQuery{
  site {
    siteMetadata {
      title
    }
  }
  allMarkdownRemark(
    filter: {
      frontmatter: { published: { ne: false } },
      fields: { sourceInstanceName: { eq: "posts" } }
    },
    sort: {fields: [frontmatter___date], order: DESC}
  ) {
    nodes {
      excerpt
      fields {
        slug
        month
      }
      frontmatter {
        date
        title
        description
      }
    }
  }
}`
