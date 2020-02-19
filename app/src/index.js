import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css'
import './index.css';
import * as serviceWorker from './serviceWorker';
import ButtonComponents from "./components/ButtonComponents";
import {Provider} from "react-redux";
import store from "./store";
import {ThemeProvider} from "styled-components";
import {theme} from "./shared/theme";

ReactDOM.render(
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <ButtonComponents/>
        </ThemeProvider>
    </Provider>, document.getElementById('gallery'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();