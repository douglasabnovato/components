import React, { useState, useMemo } from "react";
import "./index.css";

function UseMemo() {
  const [counter, setCounter] = useState(1);
  const [name, setName] = useState("");

  const total = useMemo(() => {
    return counter * 1234 * 4311 * 9515 * 3375;
  }, [counter]);

  function handlePlus() {
    setCounter((prevState) => prevState + 1);
  }

  return (
    <div className="UseMemo">
      <h1>{counter}</h1>
      <h4>{total}</h4>
      <button onClick={handlePlus}>+</button>
      <br />
      <br />
      <span>{name}</span>
      <br />
      <input onChange={(e) => setName(e.target.value)} />
    </div>
  );
}

export default UseMemo;
