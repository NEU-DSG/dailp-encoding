import React from "react"
import { Link } from "gatsby"
import Layout from "../layout"

export default () => (
  <Layout title="Not Found">
    <main>
      <h1>Page Not Found</h1>
      <p>
        We aren't sure what page you were looking for.{" "}
        <Link to="/">View our collection of Cherokee manuscripts</Link>
      </p>
    </main>
  </Layout>
)
