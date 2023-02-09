import React, { useState, useEffect } from "react";
import "./index.css";

function UseState() {
  const [counter, setCounter] = useState(0);
  
  useEffect(() => {
    console.log("useEffect to counter rodou");

    return () => {
        console.log("useEffect to counter desmontar")
    }
  }, [counter]);

  function handlePlus() {
    setCounter((prevstate) => prevstate + 1);
  }

  function handleMinus() {
    setCounter((prevstate) => prevstate - 1);
  }

  return (
    <div className="UseState">
      <div className="container">
        <button onClick={handleMinus}>-</button>
        <h4>{counter}</h4>
        <button onClick={handlePlus}>+</button>
      </div>
    </div>
  );
}

export default UseState;
