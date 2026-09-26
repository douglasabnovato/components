import React from "react"; 

//export default = (props) => {
const IndiretaFilho = (props) => { 
    const cb = props.quandoClicar
    const min = 50
    const max = 70
    const gerarIdade = () => parseInt(Math.random() * (min - (max - min))) + (max - min)
    const gerarNerd = () => Math.random() > 0.5

    return(
        <div> 
            <div> Filho </div>
            <button onClick={_ => cb("João", gerarIdade(), gerarNerd())
            }> Fornecer Informações </button>
        </div>
    )
}

export default IndiretaFilho;