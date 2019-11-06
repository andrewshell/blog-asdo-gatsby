import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import Search from "../components/search";

function NotFoundPage() {
  return (
    <Layout>
      <SEO title="404: Not Found" />
      <h1>404 Page Not Found</h1>
      <Search />
    </Layout>
  );
}

export default NotFoundPage;
