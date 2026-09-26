import React from "react";

function KeyLists(props) {
    const numbers = props.numbers;
    const listItems = numbers.map((number) =>
      <span key={number.toString()}>
        {number}{" "}  
      </span>
    );
    return (
      <p>{listItems}</p>
    );
}

export default KeyLists;
