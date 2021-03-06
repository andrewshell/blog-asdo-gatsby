import React from "react"
import { Helmet } from "react-helmet"
import PropTypes from "prop-types"
import { StaticQuery, graphql } from "gatsby"
const SEO = ({ title, description, image, pathname, article }) => (
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
      return (
        <>
          <Helmet title={seo.title} titleTemplate={titleTemplate}>
            <meta name="google-site-verification" content={googleSiteVerification} />
            <meta name="description" content={seo.description} />
            <meta name="image" content={seo.image} />
            {seo.url && <meta property="og:url" content={seo.url} />}
            {(article ? true : null) && (
              <meta property="og:type" content="article" />
            )}
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
   "@type": "WebSite",
   "url": "https://blog.andrewshell.org/",
   "potentialAction": {
     "@type": "SearchAction",
     "target": "https://blog.andrewshell.org/search/?keywords={search_term_string}",
     "query-input": "required name=search_term_string"
   }
}
`}</script>
          </Helmet>
        </>
      )
    }}
  />
)
export default SEO
SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  pathname: PropTypes.string,
  article: PropTypes.bool,
}
SEO.defaultProps = {
  title: null,
  description: null,
  image: null,
  pathname: null,
  article: false,
}
const query = graphql`
  query SEO {
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
