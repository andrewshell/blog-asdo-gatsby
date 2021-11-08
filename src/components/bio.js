/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author {
            name
          }
        }
      }
    }
  `)

  // Set these values by editing "siteMetadata" in gatsby-config.js
  const author = data.site.siteMetadata?.author

  return (
    <div className="bio">
      <StaticImage
        className="bio-avatar"
        layout="fixed"
        formats={["auto", "webp", "avif"]}
        src="../images/profile-pic.png"
        width={50}
        height={50}
        quality={95}
        alt="Profile picture"
      />
      {author?.name && (
        <div>
          Written by <Link to="/about/"><strong>{author.name}</strong></Link>, a web developer from Madison, WI.<br />
          <ul className="hlist">
            <li><Link to="/about/">About</Link></li>
            <li><Link to="/contact/">Contact</Link></li>
            <li><Link to="/now/">Now</Link></li>
            <li><Link to="/essays/">Essays</Link></li>
            <li><a href="https://amzn.to/2gdI0Ua">Wishlist</a></li>
            <li><Link to="/search/">Search</Link></li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default Bio
