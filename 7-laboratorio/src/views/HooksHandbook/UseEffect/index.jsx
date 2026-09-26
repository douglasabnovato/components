import React, { useState, useEffect } from "react";
import "./index.css";

function UseEffect() {
  const [name, setName] = useState("Olá");

  useEffect(() => {
    console.log("useEffect to first render rodou");

    return () => {
        console.log("useEffect to first render desmontar")
    }
  }, []);

  useEffect(() => {
    console.log("useEffect to name rodou");

    return () => {
        console.log("useEffect to name desmontar")
    }
  }, [name]);

  return (
    <div className="UseEffect">
      <div className="container-inputText">
        <span>{name}</span>
        <br />
        <input onChange={(e) => setName(e.target.value)} />
      </div>
    </div>
  );
}

export default UseEffect;
