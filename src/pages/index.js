import React from "react";
import { graphql, Link } from "gatsby";
import moment from "moment";

import Layout from "../components/journal/layout";
import Loop from "../components/journal/loop";

export default function IndexPage({data}) {
  const nodes = [...data.allMarkdownRemark.nodes];
  const post = nodes.shift();
  const next = nodes.pop();

  return (
    <Layout>
      <main id="gh-main" className="gh-main gh-outer">
        <div className="gh-inner">
          <article className="gh-latest gh-card">
            <Link to={ post.fields.slug } rel="bookmark" className="gh-card-link">
              <header className="gh-card-header">
                <div className="gh-article-meta">
                  <span className="gh-card-date">Latest — <time dateTime={ post.frontmatter.iso8601 }>{ moment(post.frontmatter.updated).format(`MMMM DD, YYYY`) }</time></span>
                </div>

                <h2 className="gh-article-title gh-card-title">{ post.frontmatter.title }</h2>
              </header>

              <p className="gh-article-excerpt" dangerouslySetInnerHTML={{ __html: post.excerpt }}></p>

              <footer className="gh-card-meta">
                <span className="gh-card-meta-wrapper">
                  <span className="gh-card-duration">{ post.timeToRead } min read</span>
                </span>
              </footer>
            </Link>
          </article>

          <div className="gh-wrapper">
            <section className="gh-section">
              <h2 className="gh-section-title">More essays</h2>
              <div className="gh-feed">
                {nodes.map((node) => {
                    return (
                      <Loop post={ node } key={ node.id } />
                    )
                })}
              </div>
              <Link to={ `/${next.fields.month}/` }>
                <button class="gh-loadmore gh-btn">Load more essays</button>
              </Link>
            </section>

            <aside className="gh-sidebar">
              <section className="gh-section">
                <h2 className="gh-section-title">About</h2>

                <div className="gh-about">
                  <section className="gh-about-wrapper">
                    <h3 className="gh-about-title">Andrew Shell's Weblog</h3>
                    <p className="gh-about-description">Strategies for thinking, learning, and productivity.</p>
                  </section>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </main>
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
    filter: {
      frontmatter: { published: { ne: false } },
      fields: { sourceInstanceName: { eq: "posts" } }
    },
    sort: {fields: [frontmatter___date], order: DESC},
    limit: 6
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
        month
      }
    }
  }
}`
