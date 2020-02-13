import React from 'react';
// import logo from './logo.svg';
import './App.scss';
import {TicTacToe} from "./tic-tac-toe/ticTacToe";
import {BrowserRouter as Router, Redirect, Route, Switch, useParams} from "react-router-dom";
import {StoneSheetCutter} from "./stone-sheet-cutter/stoneSheetCutter";
import {RouteMenu} from "./common/components/route-menu/route-menu";

function App() {

    return (
        <Router>
            <div className="app-container overlap-container">
                <RouteMenu routes={routes}/>
                <Switch>
                    <Redirect exact from="/" to={`/${routes[0].path}`}/>

                    <Route path="/:id" children={<Child/>}/>
                </Switch>
            </div>
        </Router>
    );
}

const routes = [
    {
        path: 'stone-sheet-cutters',
        title: 'Stone Sheet Cutters',
        component: <StoneSheetCutter></StoneSheetCutter>
    },
    {
        path: 'ones-and-zeroes',
        title: 'Ones and Zeroes',
        component: <TicTacToe></TicTacToe>
    }
];

function Child() {
    const {id} = useParams();
    const routeComponent = routes.find(route => route.path === id) || routes[0];

    return (
        routeComponent.component
    );
}

export default App;
