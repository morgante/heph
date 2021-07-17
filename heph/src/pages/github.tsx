import * as React from "react"
import { PageProps, Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import GitHubActivity from "../components/github_activity"

type DataProps = {
  site: {
    buildTime: string
  }
}

const Page: React.FC<PageProps<DataProps>> = ({ data, path }) => (
  <Layout>
    <Seo title="I love typescript" />
    <GitHubActivity
      username="morgante"
      message="I love GitHub lots." />
  </Layout>
)

export default Page

export const query = graphql`
  {
    site {
      buildTime(formatString: "YYYY-MM-DD hh:mm a z")
    }
  }
`
