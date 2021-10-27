const { createFilePath } = require('gatsby-source-filesystem');
const path = require('path');

const moment = require('moment-timezone');

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const parent = getNode(node.parent);

    let slug = createFilePath({ node, getNode, basePath: `pages` });
    if ((node.frontmatter || {}).slug) {
      slug = '/' + node.frontmatter.slug + '/';
    }

    if ((node.frontmatter || {}).date) {
      createNodeField({
        node,
        name: 'month',
        value: moment(node.frontmatter.date).tz(process.env.TIMEZONE).format('YYYY-MM'),
      });
    }

    createNodeField({
      node,
      name: 'sourceInstanceName',
      value: parent.sourceInstanceName,
    });

    createNodeField({
      node,
      name: `slug`,
      value: slug,
    });
  }
}

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage, createRedirect } = actions;

  // Get all markdown blog posts sorted by date
  const result = await graphql(
    `
      {
        allMarkdownRemark(
          filter: { frontmatter: { published: { ne: false } } }
          sort: { fields: [frontmatter___date], order: ASC }
          limit: 1000
        ) {
          nodes {
            id
            fields {
              sourceInstanceName,
              slug
              month
            }
            frontmatter {
              date
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
    nodes[node.fields.sourceInstanceName || 'unknown'].push(node);
    return nodes;
  }, { pages: [], posts: [], unknown: [] });

  for (const sourceInstanceName of ['posts', 'pages']) {
    if (nodes[sourceInstanceName].length > 0) {
      nodes[sourceInstanceName].forEach((node, index) => {
        const previousNodeId = index === 0 ? null : nodes[sourceInstanceName][index - 1].id
        const nextNodeId = index === nodes[sourceInstanceName].length - 1 ? null : nodes[sourceInstanceName][index + 1].id

        if ('posts' === sourceInstanceName) {
          if (undefined === months[node.fields.month]) {
            months[node.fields.month] = true;
          }
        }

        createPage({
          path: node.fields.slug,
          component: path.resolve(`./src/templates/${node.fields.sourceInstanceName}.js`),
          context: {
            slug: node.fields.slug,
            previousNodeId,
            nextNodeId,
          },
        });

        if ('posts' === node.fields.sourceInstanceName) {
          const fromPath = moment(node.frontmatter.date).tz(process.env.TIMEZONE).format('/YYYY-MM/DD') + node.fields.slug
          const fromPathUTC = moment(node.frontmatter.date).tz('UTC').format('/YYYY-MM/DD') + node.fields.slug
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
        slug: month,
        previousMonth,
        nextMonth,
      },
    });
  })

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
      date: Date @dateformat
      updated: Date @dateformat
      published: Boolean
      description: String
      featuredImg: File
    }

    type Fields {
      slug: String
      sourceInstanceName: String
      month: String
    }
  `)
}
