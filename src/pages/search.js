import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import Search from "../components/search";

export default function SearchPage() {
  return (
    <Layout>
      <SEO title="Search" />
      <Search />
    </Layout>
  );
}
