import { graphql, useStaticQuery, Link } from "gatsby";
import React, { useState } from "react";
import geekityIcon from '../images/geekity_icon.svg';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <nav className="flex justify-between max-w-4xl mx-auto p-4 md:p-8 text-sm">
        <p className="m-0">
          {`Powered by `}
          <a
            className="font-bold"
            href="https://www.gatsbyjs.org/"
            rel="nofollow"
          >
            GatsbyJS
          </a>
          {` and `}
          <a
            className="font-bold"
            href="https://tailwindcss.com/"
            rel="nofollow"
          >
            Tailwind
          </a>
          {` on `}
          <a
            className="font-bold"
            href="https://www.netlify.com/"
            rel="nofollow"
          >
            Netlify
          </a>
        </p>

        <p className="m-0">
          <a
            className="font-bold"
            href="https://github.com/andrewshell/blog-asdo-gatsby"
          >
            GitHub
          </a>
        </p>
      </nav>
    </footer>
  );
}

export default Footer;
