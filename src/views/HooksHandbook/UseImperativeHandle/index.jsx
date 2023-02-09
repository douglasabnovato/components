import React, { forwardRef, useImperativeHandle, useRef } from "react";
import "./index.css";

function UseImperativeHandle() {
  const formRef = useRef(null);

  function handleSubmit() {
    console.log(formRef);
    formRef.current.submit()
  }

  return (
    <div className="UseImperativeHandle">
      <Form ref={formRef} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

const Form = forwardRef((props, ref) => {
  const inputRef = useRef(null);

  function handleSubmit(){
    alert(inputRef.current.value)
  }

  useImperativeHandle(
    ref,
    () => {
      return {
        submit: handleSubmit,
      };
    },
    [],
  );

  return (
    <form>
      <input ref={inputRef} />
    </form>
  );
});

export default UseImperativeHandle;
