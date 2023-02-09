import React from "react";

function Details(props) {
  return <>    
    <p><span style={{fontWeight: "bold"}}>{props.titulo} </span>{props.detalhes}</p>
  </>;
}

export default Details;
