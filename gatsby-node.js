const { createFilePath } = require(`gatsby-source-filesystem`);
const path = require(`path`);

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` });
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    });
  }
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  return new Promise((resolve, reject) => {
    graphql(`{
        allMarkdownRemark {
          edges {
            node {
              frontmatter {
                slug,
                published
              }
            }
          }
        }
      }`).then(result => {
      result.data.allMarkdownRemark.edges.forEach(({ node }) => {
        if (false !== node.frontmatter.published) {
          createPage({
            path: node.frontmatter.slug,
            component: path.resolve(`./src/templates/posts.js`),
            context: {
              slug: node.frontmatter.slug,
            },
          });
        }
      })
      resolve();
    })
  })
}
