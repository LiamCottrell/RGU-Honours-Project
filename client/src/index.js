import React from 'react';
import ReactDOM from 'react-dom';
import  { BrowserRouter, Route } from 'react-router-dom';

import App from './App';
import Home from './Home';
import * as serviceWorker from './serviceWorker';


const routes = (
    <BrowserRouter>
        <Route path="/" component={Home} exact={true}/>
        <Route path="/world" component={App}/>
    </BrowserRouter>
);
ReactDOM.render(routes, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
