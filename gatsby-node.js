const { createFilePath } = require(`gatsby-source-filesystem`);
const path = require(`path`);

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === `MarkdownRemark`) {
    const parent = getNode(node.parent);

    let slug = createFilePath({ node, getNode, basePath: `pages` });
    if ((node.frontmatter || {}).slug) {
      slug = '/' + node.frontmatter.slug + '/';
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

  return new Promise((resolve, reject) => {
    graphql(`{
        allMarkdownRemark (
          filter: { frontmatter: { published: { ne: false } } }
        ) {
            nodes {
              fields {
                sourceInstanceName,
                slug
              }
            }
        }
    }`).then(result => {
      result.data.allMarkdownRemark.nodes.forEach(({ fields }) => {
        createPage({
          path: fields.slug,
          component: path.resolve(`./src/templates/${fields.sourceInstanceName}.js`),
          context: {
            slug: fields.slug,
          },
        });
      })
      resolve();
    })
  })
}
