import React, { useState, useLayoutEffect, useEffect } from "react";
import "./index.css";

function UseLayoutEffect() {
  return (
    <div>
      <UseLayoutEffectFirst />
      <UseEffectLater />
    </div>
  );
}

function UseLayoutEffectFirst() {
  const [counter, setCounter] = useState(0);

  useLayoutEffect(() => {
    for (let i = 0; i < 5000; i++) {
      console.log("UseLayoutEffectFirst useLayoutEffect");
    }
  }, [counter]);

  function handlePlus() {
    setCounter((prevState) => prevState + 1);
  }

  return (
    <div className="UseLayoutEffect">
      <h2>{counter}</h2>
      <button onClick={handlePlus}>+</button>
    </div>
  );
}

function UseEffectLater() {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    console.log("UseEffectLater useEffect 1")
  }, [])
  
  useEffect(() => {
    console.log("UseEffectLater useEffect 2")
  }, [])
  
  useEffect(() => {
    console.log("UseEffectLater useEffect 3")
  }, [])
  
  useLayoutEffect(() => {
    console.log("UseEffectLater useLayoutEffect")
  }, [])

  function handlePlus() {
    setCounter((prevState) => prevState + 1);
  }

  return (
    <div className="UseLayoutEffect">
      <h2>{counter}</h2>
      <button onClick={handlePlus}>+</button>
    </div>
  );
}


export default UseLayoutEffect;
