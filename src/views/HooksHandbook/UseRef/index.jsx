import React, { useRef } from "react";
import "./index.css";

function UseRef() {
  return (
    <div className="UseRef">
      <UseRefCurrent />
      <UseRefInput />
    </div>
  );
}

function UseRefInput() {
  console.log("rendered UseRefInput");
  const inputRef = useRef(null)

  function handlePrintName() {
    alert(inputRef.current.value);
  }

  return (
    <div className="UseRefInput">
      <input ref={inputRef} />
      <button onClick={handlePrintName}>Print name</button>
    </div>
  );
}

function UseRefCurrent() {
  console.log("rendered UseRefCurrent");
  const number = useRef(0);

  function handleSetValue() {
    const newNumber = Math.round(Math.random() * (10 - 1) * 1);
    number.current = newNumber;
  }

  function handlePrintValue() {
    alert(number.current);
  }

  return (
    <div className="UseRefCurrent">
      <button onClick={handleSetValue}>Set Value</button>
      <button onClick={handlePrintValue}>Print Value</button>
    </div>
  );
}

export default UseRef;
