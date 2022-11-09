import * as React from "react"
import { Link } from "gatsby"

const Layout = ({ location, title, pagetype, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header

  if (isRootPath) {
    header = (
      <>
        <h1 className="main-heading">
          <Link to="/">{title}</Link>
        </h1>
        <p>Strategies for thinking, learning, and productivity.</p>
      </>
    )
  } else {
    header = (
      <Link className="header-link-home" to="/">
        {title}
      </Link>
    )
  }

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath} itemScope="itemScope" itemType={pagetype || 'https://schema.org/WebPage'}>
      <header className="global-header">{header}</header>
      <main>{children}</main>
      <footer>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.com">Gatsby</a>
        <ul class="hlist">
        <li><strong>Social:</strong></li>
        <li><a rel="me" href="https://twitter.com/andrewshell">Twitter</a></li>
        <li><a rel="me" href="https://pub.peakthink.org/@andrewshell">Mastodon</a></li>
        <li><a href="https://github.com/andrewshell" rel="me">GitHub</a></li>
        </ul>
      </footer>
    </div>
  )
}

export default Layout
