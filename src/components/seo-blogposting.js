import React from "react"
import { Helmet } from "react-helmet"
import PropTypes from "prop-types"
import { StaticQuery, graphql } from "gatsby"
import moment from "moment"

const SeoBlogPosting = ({ title, description, image, pathname, created, updated }) => (
  <StaticQuery
    query={query}
    render={({
      site: {
        siteMetadata: {
          defaultTitle,
          titleTemplate,
          defaultDescription,
          siteUrl,
          defaultImage,
          twitterUsername,
          googleSiteVerification
        },
      },
    }) => {
      let url = `${siteUrl}${pathname || "/"}`;
      let seoImage = `https://image.thum.io/get/ogImage/${url}`;
      if (null !== image) {
        seoImage = `${siteUrl}${image}`;
      }
      const seo = {
        title: title || defaultTitle,
        description: description || defaultDescription,
        image: seoImage,
        url
      }
      let dateCreated = moment(created).format(`YYYY-MM-DD`);
      let dateModified = moment(updated ? updated : created).format(`YYYY-MM-DD`);
      return (
        <>
          <Helmet title={seo.title} titleTemplate={titleTemplate}>
            <meta name="google-site-verification" content={googleSiteVerification} />
            <meta name="description" content={seo.description} />
            <meta name="image" content={seo.image} />
            {seo.url && <meta property="og:url" content={seo.url} />}
            <meta property="og:type" content="article" />
            {seo.title && <meta property="og:title" content={seo.title} />}
            {defaultTitle && <meta property="og:site_name" content={defaultTitle} />}
            {seo.description && (
              <meta property="og:description" content={seo.description} />
            )}
            {seo.image && <meta property="og:image" content={seo.image} />}
            <meta name="twitter:card" content="summary_large_image" />
            {twitterUsername && (
              <meta name="twitter:creator" content={twitterUsername} />
            )}
            {seo.title && <meta name="twitter:title" content={seo.title} />}
            {seo.description && (
              <meta name="twitter:description" content={seo.description} />
            )}
            {seo.image && <meta name="twitter:image" content={seo.image} />}
            <script type="application/ld+json">{`
{
  "@context": "http://schema.org",
  "@type": "BlogPosting",
  "headline":"${seo.title}",
  "image":"${seo.image}",
  "url":"${seo.url}",
  "datePublished":"${dateCreated}",
  "dateCreated":"${dateCreated}",
  "dateModified":"${dateModified}",
  "description":"${seo.description}",
  "author":{
    "@type":"Person",
    "name":"Andrew Shell"
  }
}
`}</script>
          </Helmet>
        </>
      )
    }}
  />
)
export default SeoBlogPosting
SeoBlogPosting.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  pathname: PropTypes.string,
  created: PropTypes.string,
  updated: PropTypes.string,
}
SeoBlogPosting.defaultProps = {
  title: null,
  description: null,
  image: null,
  pathname: null,
  created: null,
  updated: null,
}
const query = graphql`
  query SeoBlogPosting {
    site {
      siteMetadata {
        defaultTitle: title
        titleTemplate
        defaultDescription: description
        siteUrl
        defaultImage: image
        twitterUsername,
        googleSiteVerification
      }
    }
  }
`
