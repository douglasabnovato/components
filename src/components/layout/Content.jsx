import React from 'react';
import { Switch, Route } from 'react-router-dom';
import './Content.css';
import About from "../../views/ReactRouter/About";
import Home from "../../views/ReactRouter/Home";
import Param from '../../views/ReactRouter/Param';
import NotFound from '../../views/ReactRouter/NotFound';

const Content = props => (
    <main className="ContentApp">
        <Switch>
            <Route path="/about">
                <About/>
            </Route> 
            <Route path="/param/:id">
                <Param/>
            </Route> 
            <Route exact path="/">
                <Home/>
            </Route>
            <Route path="*">
                <NotFound/>
            </Route> 
        </Switch> 
    </main>
)
 
export default  Content