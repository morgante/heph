import * as React from "react"
import PropTypes from "prop-types"
import axios from 'axios'

type Props = {
  message: string;
  username: string;
};
type State = {
};
class GitHubActivity extends React.Component<Props, State> {
  state: State = {
  };
  componentDidMount() {
    const { username } = this.props;
    console.log("component mounted");
    axios.get(`https://api.github.com/users/${username}`)
      .then(function (response) {
        // handle success
        console.log(response);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }
  render() {
    const { message } = this.props;
    return (
      <div>
        <p>Cooler</p>
        {message}
      </div>
    );
  }
}

export default GitHubActivity;
