import * as React from "react"
import PropTypes from "prop-types"
import axios from 'axios'
import { graphql, useStaticQuery } from "gatsby"
import { useEffect } from "react"

type Props = {
  message: string;
  username: string;
};
type State = {
};

const GitHubActivity = ({
  message,
  username
}: Props) => {
  const gatsbyRepoData = useStaticQuery(graphql`
    query {
      github {
        repository(name: "gatsby", owner: "gatsbyjs") {
          id
          nameWithOwner
          url
        }
      }
    }
  `)

  console.log("data", gatsbyRepoData);

  useEffect(() => {
    // axios.get(`https://api.github.com/users/${username}`)
    //   .then(function (response) {
    //     // handle success
    //     console.log(response);
    //   })
    //   .catch(function (error) {
    //     // handle error
    //     console.log(error);
    //   });
  }, [username]);
  return (
    <div>
      <p>Coolests</p>
      {message}
    </div>
  );
};

export default GitHubActivity;
