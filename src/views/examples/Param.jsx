import React from "react";
import IntervalNumber from "./../IntervalNumber";
import Game from "./../TicTacToe/Game";
import { useParams } from "react-router-dom";

const Param = (props) => {
  const { id } = useParams();
  let component;

  if (id == 1) {
    component = <IntervalNumber />;
  } else if (id == 2) {
    component = <Game />;
  }

  return (
    <div className="Param">
      <h1>Param</h1>
      <p>Valor: {id}</p>
      {component}
    </div>
  );
};
export default Param;
