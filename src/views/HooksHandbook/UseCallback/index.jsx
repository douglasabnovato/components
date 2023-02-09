import React, { useState, useCallback } from 'react'
import './index.css'

//const fnCounter = new Set()

function UseCallback() {
    const [counter, setCounter] = useState(0)

    const handlePlus = useCallback(() => {
        setCounter((prevState) => prevState + 1)
    }, [])

    return (
        <div className="UseCallback">
            <h1>{counter}</h1>
            <Button onClick={handlePlus} />
        </div>
    )
}

function Button(props){
    return (
        <button onClick={props.onClick}>+</button>
    )
}

export default UseCallback;