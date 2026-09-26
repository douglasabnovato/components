import React from "react";

function formatName(user) {
  return user.firstName + " " + user.lastName+ "!";
}

const user = {
  firstName: "Steve",
  lastName: "Jobs",
};

const element = <h1>Hello, {formatName(user)}</h1>;

class FormatName extends React.Component {
  render() {
    return element;
  }
}

export default FormatName;
