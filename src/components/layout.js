import PropTypes from "prop-types";
import React from "react";
import { useStaticQuery, Link, graphql } from "gatsby"
import Header from "./header";

function Layout({ children }) {
  return (
    <div className="flex flex-col font-sans min-h-screen text-gray-900">
      <Header />

      <main className="flex flex-col flex-1 md:justify-center max-w-4xl mx-auto px-4 py-8 md:p-8 w-full">
        {children}
      </main>

      <footer className="bg-gray-200">
        <nav className="flex justify-between max-w-4xl mx-auto p-4 md:p-8 text-sm">
          <p>
            Created by{` `}
            <a
              className="font-bold no-underline"
              href="https://bryant.io"
            >
              Taylor Bryant
            </a>
          </p>

          <p>
            <a
              className="font-bold no-underline"
              href="https://github.com/taylorbryant/gatsby-starter-tailwind"
            >
              GitHub
            </a>
          </p>
        </nav>
      </footer>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout;
