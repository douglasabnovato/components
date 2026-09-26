import React from "react";
import styled, { ThemeProvider } from "styled-components";

import "./index.css"

const Button = styled.button`
  color: ${(props) => props.theme.fg};
  border: 2px solid ${(props) => props.theme.fg};
  background: ${(props) => props.theme.bg};
  &:hover {
    background-color: ${(props) => props.theme.fg};
    color: ${(props) => props.theme.bg};
    border: 2px solid ${(props) => props.theme.bg};
    cursor: pointer;
  }
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border-radius: 3px;
`;

const ButtonHidden = styled.button`
  background: transparent;
  border-radius: 3px;
  border: 2px solid #003D6C;
  color: #003D6C;
  margin: 0 1em;
  padding: 0.25em 1em;
  &:hover {
    background-color: #003D6C;
    color: white;
    border: 2px solid #003D6C;
    cursor: pointer;
  }
`

const theme = {
  fg: "palevioletred",
  bg: "white",
};

const invertTheme = {
  fg: "white",
  bg: "palevioletred",
};

function WarningBanner(props) {
  if (!props.warn) {
    return null;
  }

  return (
    <div style={{
      background: "#f8f3d6",
      color: "#967132",
      marginBottom:"8px"
    }}>
      <div class="data">
        <p class="title">
          <span>Warning:</span> User action warning
        </p>
        <p class="sub">Lorem ipsum dolor sit amet.</p>
      </div>
    </div>
  );
}

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showWarning: true };
    this.handleToggleClick = this.handleToggleClick.bind(this);
  }

  handleToggleClick() {
    this.setState((state) => ({
      showWarning: !state.showWarning,
    }));
  }

  render() {
    return (
      <div>
        <WarningBanner warn={this.state.showWarning} />
        <ButtonHidden onClick={this.handleToggleClick}>
          {this.state.showWarning ? "Hide" : "Show"}
        </ButtonHidden>
      </div>
    );
  }
}

function UserGreeting() {
  return <h1>Welcome back!</h1>;
}

function GuestGreeting() {
  return <h1>Please sign up.</h1>;
}

function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <UserGreeting />;
  }
  return <GuestGreeting />;
}

function LoginButton(props) {
  return (
    <ThemeProvider theme={invertTheme}>
      <Button onClick={props.onClick}>Login </Button>
    </ThemeProvider>
  );
}

function LogoutButton(props) {
  return (
    <ThemeProvider theme={theme}>
      <Button onClick={props.onClick}>Logout </Button>
    </ThemeProvider>
  );
}

class LoginControl extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.state = { isLoggedIn: false };
  }

  handleLoginClick() {
    this.setState({ isLoggedIn: true });
  }

  handleLogoutClick() {
    this.setState({ isLoggedIn: false });
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;
    let button;

    if (isLoggedIn) {
      button = <LogoutButton onClick={this.handleLogoutClick} />;
    } else {
      button = <LoginButton onClick={this.handleLoginClick} />;
    }

    return (
      <div>
        <Greeting isLoggedIn={isLoggedIn} />
        {button}
        <Page />
      </div>
    );
  }
}

export default LoginControl;
