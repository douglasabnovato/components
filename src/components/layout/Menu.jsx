import React from "react";
import { Link } from "react-router-dom";
import "./Menu.css";

const Menu = (props) => (
  <aside className="MenuApp">
    <nav>
      <ul>
        <li>
          <Link to="/">Início</Link>
        </li>
        <li>
          <Link to="/param/1">Param #1</Link>
        </li>
        <li>
          <Link to="/param/2">Param #2</Link>
        </li>
        <li>
          <Link to="/param/3">Param #3</Link>
        </li>
        <li>
          <Link to="/hooks">Hooks</Link>
        </li>
        <li>
          <Link to="/useState">useState()</Link>
        </li>
        <li>
          <Link to="/useEffect">useEffect()</Link>
        </li>
        <li>
          <Link to="/useRef">useRef()</Link>
        </li>
        <li>
          <Link to="/useMemo">useMemo()</Link>
        </li>
        <li>
          <Link to="/useCallback">useCallback()</Link>
        </li>
        {/*<li>
          <Link to="/useContext">useContext()</Link>
        </li>*/}
        <li>
          <Link to="/useReducer">useReducer()</Link>
        </li>
        <li>
          <Link to="/useCustom">useMyHook()</Link>
        </li>
        <li>
          <Link to="/react">React Fundamentos</Link>
        </li>
        <li>
          <Link to="/docs">React Docs</Link>
        </li>
        <li>
          <Link to="/about">Sobre</Link>
        </li>
        <li>
          <Link to="/naoexiste">Não Existe</Link>
        </li>
      </ul>
    </nav>
  </aside>
);

export default Menu;
