import React from 'react';
// import logo from './logo.svg';
import './App.css';
import {TicTacToe} from "./tic-tac-toe/ticTacToe";
import {BrowserRouter as Router, Link, Route, Switch, useParams} from "react-router-dom";
import {StoneSheetCutter} from "./stone-sheet-cutter/stoneSheetCutter";

function App() {

    return (
        <Router>
            <div className="app-container overlap-container">
                <div className="navbar">
                    {routes.map(r => <button key={r.url}><Link to={`/${r.url}`}>{r.title}</Link></button>)}
                </div>

                <Switch>
                    <Route path="/:id" children={<Child/>}/>
                </Switch>
            </div>
        </Router>
    );
}

const routes = [
    {
        url: 'stone-sheet-cutters',
        title: 'Stone Sheet Cutters',
        component: <StoneSheetCutter></StoneSheetCutter>
    },
    {
        url: 'ones-and-zeroes',
        title: 'Ones and Zeroes',
        component: <TicTacToe></TicTacToe>
    }
];

function Child() {
    const {id} = useParams();
    const routeComponent = routes.find(route => route.url === id) || routes[0];

    return (
        routeComponent.component
    );
}

export default App;
