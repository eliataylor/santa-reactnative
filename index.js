import React from 'react'
import { AppRegistry } from 'react-native';
import App from './src/App';

// redux
const appName = require('./app.json');
import { compose, createStore, applyMiddleware } from 'redux'
import rootReducer from './src/redux/index';
import thunk from 'redux-thunk';
const middleware = [thunk];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(...middleware)));

import { Provider } from 'react-redux'

const ReduxApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
)

AppRegistry.registerComponent(appName.name, () => ReduxApp);
