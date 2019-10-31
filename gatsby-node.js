const { createFilePath } = require(`gatsby-source-filesystem`);
const parseFilepath = require(`parse-filepath`);
const path = require(`path`);

exports.onCreateNode = ({node, getNode, boundActionCreators}) => {
  const {createNodeField} = boundActionCreators
  const fileNode = getNode(node.parent)

  if (
    node.internal.type === `Mdx` &&
    fileNode.internal.type === `File`
  ) {
    const parsedFilePath = parseFilepath(fileNode.relativePath)
    let slug

    if (node.frontmatter && node.frontmatter.slug) {
      slug = `/${node.frontmatter.slug}`
    } else {
      if (parsedFilePath.name !== `index` && parsedFilePath.dir !== ``) {
        slug = `/${parsedFilePath.dir}/${parsedFilePath.name}/`
      } else if (parsedFilePath.dir === ``) {
        slug = `/${parsedFilePath.name}/`
      } else {
        slug = `/${parsedFilePath.dir}/`
      }
    }

    createNodeField({
      name: `slug`,
      node,
      value: slug,
    })
  }
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  return new Promise((resolve, reject) => {
    graphql(`{
        allMdx {
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
      result.data.allMdx.edges.forEach(({ node }) => {
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
