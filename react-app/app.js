// app.js
var React = require('react');
var ReactDOM = require('react-dom');
var Redux = require('redux');
var createStore = Redux.createStore;
var applyMiddleware = Redux.applyMiddleware;
var Provider = require('react-redux').Provider;
var thunkMiddleware = require('redux-thunk').default;

var App = require('./components/App.js');
var main = require('./reducer');

var store = createStore(
  main,
  applyMiddleware(thunkMiddleware)
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('react-root')
);
