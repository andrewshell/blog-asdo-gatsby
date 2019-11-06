const { createFilePath } = require(`gatsby-source-filesystem`);
const path = require(`path`);

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === `MarkdownRemark`) {
    const slug = '/' + node.frontmatter.slug + '/';
    // createFilePath({ node, getNode, basePath: `pages` });
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

  return new Promise((resolve, reject) => {
    graphql(`{
        allMarkdownRemark {
          edges {
            node {
              frontmatter {
                published
              },
              fields {
                sourceInstanceName,
                slug
              }
            }
          }
        }
      }`).then(result => {
      result.data.allMarkdownRemark.edges.forEach(({ node }) => {
        if (false !== node.frontmatter.published) {
          createPage({
            path: node.fields.slug,
            component: path.resolve(`./src/templates/${node.fields.sourceInstanceName}.js`),
            context: {
              slug: node.fields.slug,
            },
          });
        }
      })
      resolve();
    })
  })
}
