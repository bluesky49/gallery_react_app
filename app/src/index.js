import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import FullscreenComponent from "./components/FullscreenComponent";
import {Provider} from "react-redux";
import store from "./store";

ReactDOM.render(
    <Provider store={store}>
        <FullscreenComponent/>
    </Provider>, document.getElementById('grid_gallery'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();