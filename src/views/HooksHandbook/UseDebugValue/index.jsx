import React, { useDebugValue, useEffect, useState} from "react";
import "./index.css";

function UseDebugValue() {
  const [loading, response] = useFetch('https://api.github.com/users/maateusilva')

  if(loading){
    return <h1>Loading ...</h1>
  }

  return (
    <div className="UseDebugValue">
        <h4>use Debug Value</h4>
      {JSON.stringify(response)}
    </div>
  );
}

function useFetch(url){
  const [loading, setLoading] = useState(true)
  const [response, setResponse] = useState(null)

  useEffect(() => {
    (async () => {
      const resp = await fetch(url)
      const json = await resp.json()

      setLoading(false)
      setResponse(json)
    })()
  }, [url])

  useDebugValue("label",(message) => {
    return `Mensagem: ${message}`
  })

  return [loading, response?.json]
}

export default UseDebugValue;
