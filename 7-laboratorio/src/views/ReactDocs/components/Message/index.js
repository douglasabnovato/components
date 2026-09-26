import React from "react";
import styled from "styled-components";
import "./index.css"

const TitleDialog = styled.h1`
  margin: 0;
  font-family: sans-serif;
`;

const MessageDialog = styled.p`
  font-size: larger;
`; 

function FancyBorder(props) {
  return (
    <div className={"FancyBorder FancyBorder-" + props.color}>
      {props.children}
    </div>
  );
}

function Dialog(props) {
    return (
      <FancyBorder color="blue">
        <TitleDialog>
          {props.title}
        </TitleDialog>
        <MessageDialog>
          {props.message}
        </MessageDialog>
      </FancyBorder>
    );
  }
  
  function WelcomeDialog() {
    return (
      <Dialog
        title="Bem-vindo"
        message="Obrigado por visitar a nossa espaçonave!" />
    );
  }

export default WelcomeDialog;
