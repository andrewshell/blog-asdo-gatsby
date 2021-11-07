const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage, createRedirect } = actions

  // Define a template for blog post
  const blogPost = path.resolve(`./src/templates/blog-post.js`)

  // Get all markdown blog posts sorted by date
  const result = await graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: ASC }
          limit: 1000
        ) {
          nodes {
            id
            fields {
              sourceInstanceName,
              slug
              month
              day
            }
            frontmatter {
              date
              published
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors
    )
    return
  }

  const months = {};
  const nodes = result.data.allMarkdownRemark.nodes.reduce((nodes, node) => {
    if (false === node.frontmatter.published) {
      nodes['unpublished'].push(node);
    } else {
      nodes[node.fields.sourceInstanceName || 'unknown'].push(node);
    }
    return nodes;
  }, { pages: [], posts: [], unpublished: [], unknown: [] });

  // Create blog posts pages
  // But only if there's at least one markdown file found at "content/blog" (defined in gatsby-config.js)
  // `context` is available in the template as a prop and as a variable in GraphQL

  for (const sourceInstanceName of ['pages', 'posts', 'unpublished']) {
    if (nodes[sourceInstanceName].length > 0) {
      nodes[sourceInstanceName].forEach((node, index) => {
        let previousNodeId = index === 0 ? null : nodes[sourceInstanceName][index - 1].id
        let nextNodeId = index === nodes[sourceInstanceName].length - 1 ? null : nodes[sourceInstanceName][index + 1].id

        if (sourceInstanceName === 'unpublished') {
          previousNodeId = null;
          nextNodeId = null;
        }

        if ('posts' === sourceInstanceName) {
          if (undefined === months[node.fields.month]) {
            months[node.fields.month] = true;
          }
        }

        createPage({
          path: node.fields.slug,
          component: path.resolve(`./src/templates/${node.fields.sourceInstanceName}.js`),
          context: {
            id: node.id,
            previousNodeId,
            nextNodeId,
          },
        })

        if ('posts' === node.fields.sourceInstanceName) {
          const fromPath = dayjs(node.frontmatter.date).tz(process.env.GATSBY_TIMEZONE).format('/YYYY-MM/DD') + node.fields.slug
          const fromPathUTC = dayjs(node.frontmatter.date).tz('UTC').format('/YYYY-MM/DD') + node.fields.slug
          const toPath = node.fields.slug
          createRedirect({ fromPath, toPath, isPermanent: true });
          if (fromPathUTC !== fromPath) {
            createRedirect({ fromPath: fromPathUTC, toPath, isPermanent: true });
          }
        }
      })
    }
  }

  const monthIdx = Object.keys(months);
  monthIdx.forEach((month, index) => {
    const previousMonth = index === 0 ? null : monthIdx[index - 1]
    const nextMonth = index === monthIdx.length - 1 ? null : monthIdx[index + 1]

    createPage({
      path: `/${month}/`,
      component: path.resolve(`./src/templates/months.js`),
      context: {
        month,
        previousMonth,
        nextMonth,
      },
    });
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const parent = getNode(node.parent);
    const value = createFilePath({ node, getNode })

    if ((node.frontmatter || {}).date) {
      createNodeField({
        node,
        name: 'month',
        value: dayjs(node.frontmatter.date).tz(process.env.TIMEZONE).format('YYYY-MM'),
      });
      createNodeField({
        node,
        name: 'day',
        value: dayjs(node.frontmatter.date).tz(process.env.TIMEZONE).format('DD'),
      });
    }

    createNodeField({
      node,
      name: 'sourceInstanceName',
      value: parent.sourceInstanceName,
    });

    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  // Explicitly define the siteMetadata {} object
  // This way those will always be defined even if removed from gatsby-config.js

  // Also explicitly define the Markdown frontmatter
  // This way the "MarkdownRemark" queries will return `null` even when no
  // blog posts are stored inside "content/blog" instead of returning an error
  createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: String
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
      updated: Date @dateformat
      published: Boolean
    }

    type Fields {
      slug: String
      sourceInstanceName: String
      month: String
      day: String
    }
  `)
}
