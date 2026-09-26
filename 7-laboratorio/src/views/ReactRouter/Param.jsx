import React from "react";

import IntervalNumber from "../IntervalNumber";
import Game from "../TicTacToe/Game";
import HooksHandbook from "../HooksHandbook"; 

import { useParams } from "react-router-dom";

const Param = (props) => {
  const { id } = useParams();
  let component;

  if (id == 1) {
    component = <IntervalNumber />;
  } else if (id == 2) {
    component = <Game />;
  }else if (id == 3) {
    component = <HooksHandbook />;
  }

  return (
    <div className="Param">
      {component}
    </div>
  );
};
export default Param;
