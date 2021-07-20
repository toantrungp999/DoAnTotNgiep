import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import appReducers from './reducers/index';
import { Provider } from 'react-redux';
import './index.css';
import reportWebVitals from './reportWebVitals';

const middleware = applyMiddleware(thunk);
const store = createStore(appReducers, {}, composeWithDevTools(middleware));
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
reportWebVitals();
