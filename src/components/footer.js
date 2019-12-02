import { graphql, useStaticQuery, Link } from "gatsby";
import React, { useState } from "react";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <nav className="sm:flex justify-between items-center max-w-4xl mx-auto p-4 md:p-8 text-sm">
        <div className="py-2 sm:py-0">
          <div className="text-center sm:text-left">
            {`Powered by `}
            <a
              href="https://www.gatsbyjs.org/"
              rel="nofollow"
            >
              GatsbyJS
            </a>
            {` and `}
            <a
              href="https://tailwindcss.com/"
              rel="nofollow"
            >
              Tailwind
            </a>
            {` on `}
            <a
              href="https://www.netlify.com/"
              rel="nofollow"
            >
              Netlify
            </a>
          </div>
        </div>
      </nav>
    </footer>
  );
}

export default Footer;
