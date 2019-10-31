import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import geekityLogo from "../images/geekity_full.svg";

function NotFoundPage() {
  return (
    <Layout>
      <SEO title="404: Not found" />
      <div>
        <img
          alt="Ghost getting abducted by aliens"
          className="block mx-auto w-1/2"
          src={ geekityLogo }
        />
      </div>
    </Layout>
  );
}

export default NotFoundPage;
