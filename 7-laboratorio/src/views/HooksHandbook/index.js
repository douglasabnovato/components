import React from "react";

import "./styles/HooksHandbook.css";

import Card from "./Card";
import UseState from "./UseState";
import UseEffect from "./UseEffect";
import UseContext from "./UseContext";
import UseReducer from "./UseReducer";
import UseCallback from "./UseCallback";
import UseMemo from "./UseMemo";
import UseRef from "./UseRef";
import UseImperativeHandle from "./UseImperativeHandle";
import UseLayoutEffec from "./UseLayoutEffect";
import UseCustom from "./UseCustom";
import UseDebugValue from "./UseDebugValue";

export default function HooksHandbook(props) {
  return (
    <div className="HooksHandbook">
      <div className="Main">
        <div className="Cards">
          <Card titulo="#00 - Hooks useState" color="#E7E014">
            <UseState />
          </Card>
          <Card titulo="#01 - Components Lifecycle useEffect" color="#AF601A">
            <UseEffect />
          </Card>
          <Card
            titulo="#02 - Consumindo Contextos com useContext"
            color="#168A2B"
          >
            <UseContext />
          </Card>
          <Card
            titulo="#03 - Manipulando múltiplos state ao mesmo tempo com useReducer"
            color="#0D3BE6"
          >
            <UseReducer />
          </Card>
          <Card
            titulo="#04 - Memorizando funções com useCallback"
            color="#B9006E"
          >
            <UseCallback />
          </Card>
          <Card titulo="#05 - Memorizando dados com useMemo" color="#921E28">
            <UseMemo />
          </Card>
          <Card titulo="#06 - Entendendo referências no React" color="#6D6D72">
            <UseRef />
          </Card>
          <Card
            titulo="#07 - Acessar Componentes Imperativamente com forwardRef e useImperativeHandle"
            color="#897ED0"
          >
            <UseImperativeHandle />
          </Card>
          <Card
            titulo="#08 - Diferenças entre useEffect e useLayoutEffec"
            color="#FFC300"
          >
            <UseLayoutEffec />
          </Card>
          <Card
            titulo="#09 - Criando Custom Hooks, criei o useFetch"
            color="#558635"
          >
            <UseCustom />
          </Card>
          <Card titulo="#10 - Pra que serve o useDebugValue?" color="#F0460A">
            <UseDebugValue />
          </Card>
        </div>
      </div>
      <div className="Footer">
        <h5>@douglasabnovato</h5>
      </div>
    </div>
  );
}
