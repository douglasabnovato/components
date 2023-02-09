import React from "react";

class Description extends React.Component {
  render() {
    const simpleStyle = {
      fontWeight: this.props.fontWeight || "bold",
    };
    return (
      <div>
        <p>
          Uma pequena funcionalidade de{" "}
          <span style={simpleStyle}>{this.props.description}</span> colocando em
          prática um pedacinho do fundamento de reactjs.
        </p>
      </div>
    );
  }
}

export default Description;
