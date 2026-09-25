import React from "react";

import Intervalo from "./Intervalo";
import Media from "./Media";
import Soma from "./Soma";
import Sorteio from "./Sorteio";

import "./IntervalNumber.css";

function IntervalNumber() {
  return (
    <div className="IntervalNumber">
      <h1>Exercício React-Redux (Simples)</h1>
      <div className="linha-card">
        <Intervalo />
      </div>
      <div className="linha-card">
        <Media />
        <Soma />
        <Sorteio />
      </div>
    </div>
  );
}

export default IntervalNumber;
