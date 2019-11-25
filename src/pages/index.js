import React from "react";
import { graphql, Link } from "gatsby";

import Layout from "../components/layout";
import SEO from "../components/seo";
import topPosts from "./top-posts.json";

export default function IndexPage({data}) {
  return (
    <Layout>
      <SEO
        keywords={[`andrew shell`, `developer`, `php`, `javascript`]}
        title="Home"
      />

      <h2>Me in 10 seconds</h2>

      <p>I'm a software developer in Madison, WI. I founded <a rel="nofollow" href="https://www.meetup.com/madisonphp/">Madison PHP</a> and Co-Founded <a rel="nofollow" href="https://pinpointsoftware.com/">Pinpoint Software</a>.</p>

      <p>In my free time I spend time with my family, <a rel="nofollow" href="https://www.goodreads.com/user/show/856379-andrew-shell">read books</a>, and <a rel="nofollow" href="http://halloween.geekity.com/">sing poorly</a></p>

      <h2>Me in 10 minutes?</h2>
      <ul>
        <li>
          See <Link to="/about/">my &quot;about&quot; page</Link>.
        </li>
      </ul>

      <h2>What am I doing now?</h2>
      <ul>
        <li>
          See <Link to="/now/">my &quot;now&quot; page</Link>.
        </li>
      </ul>

      <h2>Contact me?</h2>
      <ul>
        <li>
          See <Link to="/contact/">my &quot;contact&quot; page</Link>.
        </li>
      </ul>

      <h2>Newest Posts <Link className="text-xs" to='/posts/'>All Posts</Link></h2>
      <ul>
        {data.allMarkdownRemark.edges.filter(({ node }) => {
          return false !== node.frontmatter.published;
        }).map(({ node }) => {
          return (
            <li key={ node.id } className="entry-header">
              <span className="entry-title">
                  <Link to={ node.fields.slug } rel="bookmark">{ node.frontmatter.title }</Link>
              </span>
            </li>
          );
        })}
      </ul>

      <h2>Top Posts <Link className="text-xs" to='/posts/'>All Posts</Link></h2>
      <ul>
        {topPosts.map((node) => {
          return (
            <li key={ node.id } className="entry-header">
              <span className="entry-title">
                  <Link to={ node.fields.slug } rel="bookmark">{ node.frontmatter.title }</Link>
              </span>
            </li>
          );
        })}
      </ul>

      <h2>My E-Mail List</h2>

      <p>If you'd like to be notified by e-mail when I update my website <a href="http://eepurl.com/bvdQH9">subscribe here</a>.</p>
    </Layout>
  );
}

export const query = graphql`query HomePageQuery{
  allMarkdownRemark(
    filter: { fields: { sourceInstanceName: { eq: "posts" } } },
    sort: {fields: [frontmatter___date], order: DESC},
    limit: 5
  ) {
    totalCount
    edges {
      node {
        frontmatter {
          title
          published
        }
        fields {
          slug
        }
        id
      }
    }
  }
}`
