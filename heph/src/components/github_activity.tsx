import * as React from "react"
import PropTypes from "prop-types"
import axios from 'axios'
import { useEffect } from "react";

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
  useEffect(() => {
    axios.get(`https://api.github.com/users/${username}`)
      .then(function (response) {
        // handle success
        console.log(response);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }, [username]);
  return (
    <div>
      <p>Coolests</p>
      {message}
    </div>
  );
};

export default GitHubActivity;
