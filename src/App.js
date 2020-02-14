import React from 'react';
import './App.scss';
import {OnesAndZeroesGame} from "./ones-and-zeroes/onesAndZeroesGame";
import {BrowserRouter as Router, Redirect, Route, Switch, useParams} from "react-router-dom";
import {StoneSheetCutterGame} from "./stone-sheet-cutter/stoneSheetCutterGame";
import {RouteMenu} from "./common/components/route-menu/route-menu";
import {LimblessLizardGame} from "./limbless-lizard/limblessLizardGame";

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
        component: <StoneSheetCutterGame/>
    },
    {
        path: 'ones-and-zeroes',
        title: 'Ones and Zeroes',
        component: <OnesAndZeroesGame/>
    },
    {
        path: 'limbless-lizard',
        title: 'Limbless Lizard',
        component: <LimblessLizardGame/>
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
