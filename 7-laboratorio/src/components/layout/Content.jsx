import React from "react";
import { Switch, Route } from "react-router-dom";

import "./Content.css";

import About from "../../views/ReactRouter/About";
import Inicio from "../../views/ReactRouter/Home";
import Param from "../../views/ReactRouter/Param";
import NotFound from "../../views/ReactRouter/NotFound";

import Hooks from '../../views/HooksCoder/views/examples/Home'
import Error from '../../views/HooksCoder/views/examples/NotFound'
import UseState from '../../views/HooksCoder/views/examples/UseState'
import UseEffect from '../../views/HooksCoder/views/examples/UseEffect'
import UseRef from '../../views/HooksCoder/views/examples/UseRef'
import UseCallback from '../../views/HooksCoder/views/examples/UseCallback'
import UseMemo from '../../views/HooksCoder/views/examples/UseMemo'
import UseContext from '../../views/HooksCoder/views/examples/UseContext'
import UseReducer from '../../views/HooksCoder/views/examples/UseReducer'
import UseCustom from '../../views/HooksCoder/views/examples/UseCustom'

import ReactFundamentals from "../../views/ReactFundamentals"
import ReactDocs from "../../views/ReactDocs"

const Content = (props) => (
  <main className="ContentApp">
    <Switch>
      <Route path="/about">
        <About />
      </Route>
      <Route path="/param/:id">
        <Param />
      </Route>
      <Route exact path="/hooks">
        <Hooks />
      </Route>
      <Route path="/useState">
        <UseState />
      </Route>
      <Route path="/useEffect">
        <UseEffect />
      </Route>
      <Route path="/useRef">
        <UseRef />
      </Route>
      <Route path="/useCallback">
        <UseCallback />
      </Route>
      <Route path="/useMemo">
        <UseMemo />
      </Route>
      <Route path="/useContext">
        <UseContext />
      </Route>
      <Route path="/useReducer">
        <UseReducer />
      </Route>
      <Route path="/useCustom">
        <UseCustom />
      </Route>
      <Route path="/react">
        <ReactFundamentals />
      </Route>
      <Route path="/docs">
        <ReactDocs />
      </Route>
      <Route exact path="/">
        <Inicio />
      </Route>
      <Route path="/error">
        <Error />
      </Route>
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  </main>
);

export default Content;
