import React from "react";

import Layout from "../components/journal/layout";
import SEO from "../components/seo";

function NotFoundPage() {
  return (
    <Layout>
      <main id="gh-main" class="gh-main">
        <article class="gh-article post no-image">
          <header class="gh-article-header gh-canvas">
            <h1 class="gh-article-title">404 Page Not Found</h1>
          </header>
        </article>
      </main>
    </Layout>
  );
}

export default NotFoundPage;
