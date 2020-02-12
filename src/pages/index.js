import React from "react";
import { graphql, Link } from "gatsby";

import Layout from "../components/layout";
import SEO from "../components/seo";
import topPosts from "./top-posts.json";

export default function IndexPage({data}) {
  const siteUrl = data.site.siteMetadata.siteUrl;
  const permalink = `${siteUrl}/`;
  const headshot = `${siteUrl}/headshot.jpg`;

  return (
    <Layout>
      <SEO
        keywords={[`andrew shell`, `developer`, `php`, `javascript`]}
        title="Home"
      />

      <div id="hcard-Andrew-Shell" className="vcard">

      <img src={ headshot } alt="photo of Andrew Shell" className="photo mb-6 md:ml-6 rounded md:float-right" style={{ width: '230px', height: '230px' }} />

      <h2>Me in 10 seconds</h2>

      <p class="p-note">I'm <a className="url fn" href={ permalink }>Andrew Shell</a>, a <span className="p-role">software developer</span> in <span className="p-adr"><span className="p-locality">Madison</span>, <abbr title="Wisconsin" className="p-region">WI</abbr></span>. I founded <a rel="nofollow" href="https://www.meetup.com/madisonphp/">Madison PHP</a> and Co-Founded <a rel="nofollow" href="https://pinpointsoftware.com/">Pinpoint Software</a>. Currently I'm a Senior Web Developer at <a rel="nofollow" href="https://www.linkedin.com/company/johnson-health-tech-na/" className="org">Johnson Health Tech</a>.</p>

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
        <li>See <Link to="/contact/">my &quot;contact&quot; page</Link>.</li>
      </ul>

      <h2>Newest Posts <Link className="text-xs" to='/posts/'>All Posts</Link></h2>
      <ul>
        {data.allMarkdownRemark.edges.map(({ node }) => {
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

      <ul>
        <li>If you'd like to be notified by e-mail when I update my website <a href="http://eepurl.com/bvdQH9">subscribe here</a>.</li>
      </ul>

      <h2>Social Media</h2>

      <ul>
        <li><a href="https://dev.to/andrewshell" rel="me">DEV</a></li>
        <li><a href="https://www.facebook.com/andrew.shell" rel="me">Facebook</a></li>
        <li><a href="https://github.com/andrewshell" rel="me">GitHub</a></li>
        <li><a href="https://www.goodreads.com/user/show/856379-andrew-shell" rel="me">Goodreads</a></li>
        <li><a href="https://kik.me/andrewshell81" rel="me">Kik</a></li>
        <li><a href="https://www.instagram.com/andrewshell/" rel="me">Instagram</a></li>
        <li><a href="https://www.linkedin.com/in/andrewshell/" rel="me">LinkedIn</a></li>
        <li><a href="https://www.pinterest.com/andrewshell/" rel="me">Pinterest</a></li>
        <li><a href="https://www.reddit.com/user/shellab" rel="me">Reddit</a></li>
        <li><a href="https://stackoverflow.com/users/1052579/andrew-shell" rel="me">Stack Overflow</a></li>
        <li><a href="https://www.snapchat.com/add/andrewshell" rel="me">Snapchat</a></li>
        <li><a href="https://open.spotify.com/user/1285501863" rel="me">Spotify</a></li>
        <li><a href="https://www.twitch.tv/andrewshell" rel="me">Twitch</a></li>
        <li><a href="https://twitter.com/andrewshell" rel="me">Twitter</a></li>
      </ul>

      </div>
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
    sort: {fields: [frontmatter___date], order: DESC},
    limit: 5
  ) {
    totalCount
    edges {
      node {
        frontmatter {
          title
        }
        fields {
          slug
        }
        id
      }
    }
  }
}`
