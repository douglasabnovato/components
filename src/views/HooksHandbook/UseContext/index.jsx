import React, { createContext, useContext } from 'react'
import './index.css'

const ThemeContext = createContext()

function UseContext() {
    return (
        <ThemeContext.Provider value={{ mode: 'dark'}}>
            <Button />
        </ThemeContext.Provider>
    )
}

function Button(){
    const theme = useContext(ThemeContext)

    return (
        <button className="UseContext">{theme.mode}</button>
    )
}

export default UseContext;