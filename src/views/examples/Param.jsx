import React from "react";
import Game from "./../TicTacToe/Game";
import { useParams } from "react-router-dom";

const Param = (props) => {
  const { id } = useParams();
  console.log(id)
  return (
    <div className="Param">
      <h1>Param</h1>
      <p>Valor: {id}</p>
      {id == 2 
        ? <p>@douglasabnovato</p> 
        : <Game />
      }
    </div>
  );
};
export default Param;
