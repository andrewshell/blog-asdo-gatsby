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

const MonthIndex = ({ data, location, pageContext }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const month = dayjs(pageContext.month, "YYYY-MM");
  const pageTitle = month.format('MMMM YYYY');
  const posts = data.allMarkdownRemark.nodes
  let previous, next;

  if (pageContext.previousMonth) {
    previous = {
      fields: { slug: `/${pageContext.previousMonth}/` },
      frontmatter: { title: dayjs(pageContext.previousMonth, "YYYY-MM").format('MMMM YYYY') }
    };
  }

  if (pageContext.nextMonth) {
    next = {
      fields: { slug: `/${pageContext.nextMonth}/` },
      frontmatter: { title: dayjs(pageContext.nextMonth, "YYYY-MM").format('MMMM YYYY') }
    };
  }

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Seo title={ pageTitle } />
        <Bio />
        <p>
          No blog posts found. Add markdown posts to "content/blog" (or the
          directory you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title={ pageTitle } />
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h1 itemProp="headline">{ pageTitle }</h1>
        </header>
        <section itemProp="articleBody">
          <ol style={{ listStyle: `none` }}>
            {posts.map(post => {
              const title = post.frontmatter.title || post.fields.slug

              return (
                <li key={post.fields.slug}>
                  <article
                    className="post-list-item"
                    itemScope
                    itemType="http://schema.org/Article"
                  >
                    <header>
                      <h2>
                        <Link to={post.fields.slug} itemProp="url">
                          <span itemProp="headline">{title}</span>
                        </Link>
                      </h2>
                      <small>{ dayjs(post.frontmatter.date).tz(process.env.GATSBY_TIMEZONE).format('MMMM DD, YYYY') }</small>
                    </header>
                    <section>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: post.frontmatter.description || post.excerpt,
                        }}
                        itemProp="description"
                      />
                    </section>
                  </article>
                </li>
              )
            })}
          </ol>
        </section>
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

export default MonthIndex

export const pageQuery = graphql`
  query MonthIndex(
    $month: String!
  ) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      filter: {
        frontmatter: {
          published: { ne: false }
        },
        fields: {
          sourceInstanceName: { eq: "posts" },
          month: { eq: $month }
        }
      },
      sort: {fields: [frontmatter___date], order: DESC}
    ) {
      nodes {
        excerpt(pruneLength: 280)
        fields {
          slug
        }
        frontmatter {
          date
          title
          description
        }
      }
    }
  }
`
