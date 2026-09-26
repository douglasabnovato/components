import React from "react";
import "./index.css";

class RedesSociais extends React.Component {
  render() {
    return (
      <div>
        <a
          href={`https://${this.props.name}.medium.com/`}
          target="_blank"
          rel="noopener noreferrer"
          class="fa fa-medium"
          alt="medium"
        ></a>
        <a
          href={`https://www.linkedin.com/in/${this.props.name}/`}
          target="_blank"
          rel="noopener noreferrer"
          class="fa fa-linkedin"
          alt="linkedin"
        ></a>
        <a
          href={`https://github.com/${this.props.name}/`}
          target="_blank"
          rel="noopener noreferrer"
          class="fa fa-github"
          alt="github"
        ></a>
      </div>
    );
  }
}

export default RedesSociais;
