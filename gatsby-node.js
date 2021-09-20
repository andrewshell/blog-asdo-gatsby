const { createFilePath } = require(`gatsby-source-filesystem`);
const path = require(`path`);

const moment = require('moment');

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const parent = getNode(node.parent);

    let slug = createFilePath({ node, getNode, basePath: `pages` });
    if ((node.frontmatter || {}).slug) {
      slug = '/' + node.frontmatter.slug + '/';
    } else if ('posts' === parent.sourceInstanceName && (node.frontmatter || {}).date) {
      slug = moment(node.frontmatter.date).format('/YYYY-MM/DD/');
      console.log(slug);
    }

    if ((node.frontmatter || {}).date) {
      createNodeField({
        node,
        name: 'month',
        value: moment(node.frontmatter.date).format('YYYY-MM'),
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

exports.createPages = ({ graphql, actions }) => {
  const { createPage, createRedirect } = actions;

  createRedirect({ fromPath: '/andrew/', toPath: '/about/', isPermanent: true });
  createRedirect({ fromPath: '/contact-andrew/', toPath: '/contact/', isPermanent: true });
  createRedirect({ fromPath: '/feed/', toPath: '/rss.xml', isPermanent: true });
  createRedirect({ fromPath: '/my-resume/', toPath: '/resume/', isPermanent: true });

  const months = {};

  return new Promise((resolve, reject) => {
    graphql(`{
        allMarkdownRemark (
          filter: { frontmatter: { published: { ne: false } } }
        ) {
            nodes {
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
    }`).then(result => {
      result.data.allMarkdownRemark.nodes.forEach((node) => {
        if ('posts' === node.fields.sourceInstanceName) {
          if (undefined === months[node.fields.month]) {
            months[node.fields.month] = true;
            createPage({
              path: `/month/`,
              component: path.resolve(`./src/templates/months.js`),
              context: {
                slug: node.fields.month,
              },
            });
          }
        }

        createPage({
          path: node.fields.slug,
          component: path.resolve(`./src/templates/${node.fields.sourceInstanceName}.js`),
          context: {
            slug: node.fields.slug,
          },
        });

        if ('articles' === node.fields.sourceInstanceName) {
          const fromPath = moment(node.frontmatter.date).format('/YYYY-MM/DD') + node.fields.slug;
          const toPath = node.fields.slug;
          createRedirect({ fromPath, toPath, isPermanent: true });
        }
      })
      resolve();
    })
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
