import React from "react"
import styled from "styled-components";

const theme = {
    blue: {
      default: "#3f51b5",
      hover: "#283593"
    },
    pink: {
      default: "#e91e63",
      hover: "#ad1457"
    }
  };

const MeuBotao = styled.button `
    background-color: ${(props) => theme[props.theme].default};
    border: 2px solid ${(props) => theme[props.theme].default};
    border-radius: 3px;
    color: #FDFDFD;
    font-size: 1.2rem;
    margin: 1rem;
    padding: 1rem 1.5rem;
    cursor: pointer;
    box-shadow: 0px 2px 2px lightgray;
    transition: ease background-color 250ms;
    &:hover {
      background-color: ${(props) => theme[props.theme].hover};
      border: 2px solid ${(props) => theme[props.theme].default};
    }
`;

export default class Toggle extends React.Component {
    
  constructor(props) {
    super(props);
    this.state = { isToggleOn: true };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState((prevState) => ({
      isToggleOn: !prevState.isToggleOn,
    }));
  }

  render() {
    return (
      <MeuBotao theme="pink" onClick={() => this.handleClick()}>
        {this.state.isToggleOn ? "ON" : "OFF"}
      </MeuBotao>
    );
  }
}
