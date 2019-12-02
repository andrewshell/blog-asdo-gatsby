import { graphql, useStaticQuery, Link } from "gatsby";
import React, { useState } from "react";
import geekityIcon from '../images/geekity_icon.svg';
import Facebook from './icons/facebook';
import GitHub from './icons/github';
import Instagram from './icons/instagram';
import Kik from './icons/kik';
import LinkedIn from './icons/linkedin';
import Pinterest from './icons/pinterest';
import Reddit from './icons/reddit';
import Rss from './icons/rss';
import Snapchat from './icons/snapchat';
import Spotify from './icons/spotify';
import Twitter from './icons/twitter';

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

          <div className="text-center sm:text-left">Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik" rel="nofollow">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon" rel="nofollow">www.flaticon.com</a></div>
        </div>
        <div className="py-2 sm:py-0 flex justify-between items-center">
          <a className="icon" href="https://www.facebook.com/andrew.shell"><Facebook /></a>
          <a className="icon" href="https://github.com/andrewshell"><GitHub /></a>
          <a className="icon" href="https://www.instagram.com/andrewshell/"><Instagram /></a>
          <a className="icon" href="https://kik.me/andrewshell81"><Kik /></a>
          <a className="icon" href="https://www.linkedin.com/in/andrewshell/"><LinkedIn /></a>
          <a className="icon" href="https://www.pinterest.com/andrewshell/"><Pinterest /></a>
          <a className="icon" href="https://www.reddit.com/user/shellab"><Reddit /></a>
          <a className="icon" href="/rss.xml"><Rss /></a>
          <a className="icon" href="https://www.snapchat.com/add/andrewshell"><Snapchat /></a>
          <a className="icon" href="https://open.spotify.com/user/1285501863"><Spotify /></a>
          <a className="icon" href="https://twitter.com/andrewshell"><Twitter /></a>
        </div>
      </nav>
    </footer>
  );
}

export default Footer;
