import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import configureStore from "./configureStore";
import {configureFlashMessages} from "redux-flash-messages/lib";
import {Provider} from "react-redux";

const store = configureStore();

configureFlashMessages({
  dispatch: store.dispatch
});

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
  document.getElementById('root')
);
