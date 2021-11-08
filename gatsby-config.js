const remark = require('remark');
const visit = require('unist-util-visit');

require('dotenv').config()

module.exports = {
  siteMetadata: {
    title: `Andrew Shell's Weblog`,
    author: {
      name: `Andrew Shell`,
    },
    description: `Strategies for thinking, learning, and productivity.`,
    siteUrl: `https://blog.andrewshell.org/`,
    social: {
      twitter: `andrewshell`,
    },
  },
  plugins: [
    `gatsby-plugin-netlify`,
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/posts`,
        name: `posts`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/pages`,
        name: `pages`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 630,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-60009507-1",
        head: true,
        anonymize: true,
        respectDNT: true
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.nodes.map(node => {
                return Object.assign({}, node.frontmatter, {
                  description: node.excerpt,
                  date: node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + node.fields.slug,
                  guid: site.siteMetadata.siteUrl + node.fields.slug,
                  custom_elements: [{ "content:encoded": node.html }],
                })
              })
            },
            query: `
              {
                allMarkdownRemark(
                  filter: { frontmatter: { published: { ne: false } }, fields: { sourceInstanceName: { eq: "posts" } } },
                  sort: { order: DESC, fields: [frontmatter___date] },
                ) {
                  nodes {
                    excerpt(pruneLength: 280)
                    html
                    fields {
                      slug
                    }
                    frontmatter {
                      title
                      date
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "Andrew Shell's Weblog",
          },
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-lunr',
      options: {
        languages: [{
          name: 'en',
          filterNodes: node => {
            return (node.frontmatter || {}).published !== false;
          }
        }],
        fields: [
          { name: 'title', store: true, attributes: { boost: 20 } },
          { name: 'excerpt', store: true, attributes: { boost: 5 }},
          { name: 'content' },
          { name: 'url', store: true },
          { name: 'date', store: true }
        ],
        resolvers: {
          MarkdownRemark: {
            excerpt: node => {
              const excerptLength = 240;
              let excerpt = '';
              const tree = remark().parse(node.rawMarkdownBody);
              visit(tree, 'text', (node) => {
                excerpt += node.value;
              });
              return excerpt.slice(0, excerptLength) + '...';
            },
            title: node => node.frontmatter.title,
            content: node => node.rawMarkdownBody,
            url: node => node.fields.slug,
            date: node => node.frontmatter.date
          },
        },
        filename: 'search_index.json',
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Andrew Shell's Weblog`,
        short_name: `A.Shell`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#e2e8f0`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-react-helmet`,
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
