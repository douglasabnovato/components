import React from "react";
import "./index.css" 

class LikeButton extends React.Component { 
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return "You liked this.";
    }

    return (
      <button className="ButtonLike" onClick={() => this.setState({ liked: true })}>
        Like
      </button>
    );
  }
}

export default LikeButton; 
