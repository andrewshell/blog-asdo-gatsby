const remark = require('remark')
const visit = require('unist-util-visit')

module.exports = {
  siteMetadata: {
    title: `Andrew Shell's Weblog`,
    titleTemplate: `%s - Andrew Shell's Weblog`,
    description: `Hoopla, Ballyhoo, and more...`,
    author: `Andrew Shell`,
    image: "/default-image.png",
    twitterUsername: `@andrewshell`,
    siteUrl: 'https://blog.andrewshell.org',
    googleSiteVerification: '_-goZtBP-ox3-3pjEHer7rHHhX5qA_1R_TsQsjyWQtc'
  },
  plugins: [
    {
      resolve: `gatsby-plugin-canonical-urls`,
      options: {
        siteUrl: `https://blog.andrewshell.org`,
      },
    },
    {
      resolve: 'gatsby-plugin-feed',
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
              return allMarkdownRemark.edges.map(edge => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  custom_elements: [{ "content:encoded": edge.node.html }],
                })
              })
            },
            query: `
              {
                allMarkdownRemark(
                  filter: { frontmatter: { published: { ne: false } }, fields: { sourceInstanceName: { eq: "posts" } } },
                  sort: { order: DESC, fields: [frontmatter___date] },
                ) {
                  edges {
                    node {
                      excerpt
                      html
                      frontmatter {
                        title
                        date
                        enclosure {
                          url
                          size
                          type
                        }
                      }
                      fields {
                        slug
                      }
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "Andrew Shell's Weblog",
          },
        ],
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `posts`,
        path: `${__dirname}/src/posts`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages`,
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
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-embed-video`,
            options: {
              maxWidth: 800,
              related: false,
              noIframerder: true,
            }
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            }
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            }
          },
          'gatsby-remark-prismjs'
        ]
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
        icon: `src/images/geekity_icon.png`
      }
    },
    `gatsby-plugin-postcss`,
    {
      resolve: `gatsby-plugin-purgecss`,
      options: {
        tailwind: true,
        purgeOnly: [`src/css/style.css`],
        printRejected: true,
        whitelist: ['blockquote', 'figure', 'figcaption']
      }
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-60009507-1",
        head: true,
        anonymize: true,
        respectDNT: true
      },
    },
    `gatsby-plugin-catch-links`,
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-robots-txt`,
    `gatsby-plugin-remove-serviceworker`,
    {
      resolve: `gatsby-plugin-netlify`,
      options: {}
    }
  ]
};
