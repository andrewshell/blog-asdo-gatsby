import * as React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"

const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)

const PageTemplate = ({ data, location }) => {
  const post = data.markdownRemark;
  const siteTitle = data.site.siteMetadata?.title || `Title`;
  const { previous, next } = data;
  const pagetype = post.frontmatter?.pagetype || `https://schema.org/WebPage`;
  const itemtype = post.frontmatter?.itemtype || `https://schema.org/Article`;
  const updatedDate = dayjs(post.frontmatter?.updated).tz(process.env.GATSBY_TIMEZONE);

  const displaydate = updatedDate.isValid() ? (
    <p><span itemprop="dateModified" content={ updatedDate.format('YYYY-MM-DD') }>Updated { updatedDate.format('MMMM DD, YYYY') }</span></p>
  ) : ``;

  return (
    <Layout location={location} title={siteTitle} pagetype={pagetype}>
      <Seo
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <article
        className="blog-post"
        itemprop="mainContentOfPage"
        itemscope="itemscope"
        itemtype={ itemtype }
      >
        <header>
          <h1 itemProp="headline">{post.frontmatter.title}</h1>
          { displaydate }
        </header>
        <section
          dangerouslySetInnerHTML={{ __html: post.html }}
          itemProp="articleBody"
        />
        <hr />
        <footer>
          <Bio />
        </footer>
      </article>
      <nav className="blog-post-nav">
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  )
}

export default PageTemplate

export const pageQuery = graphql`
  query PageBySlug(
    $id: String!
    $previousNodeId: String
    $nextNodeId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date
        updated
        description
        pagetype
        itemtype
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
  }
`
