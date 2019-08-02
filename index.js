import React from 'react'
import { AppRegistry } from 'react-native';
import App from './src/App';

// redux
const appName = require('./app.json');
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './src/redux/index'
import thunk from 'redux-thunk'
const store = createStore(rootReducer, applyMiddleware(thunk))

import { Provider } from 'react-redux'

const ReduxApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
)

AppRegistry.registerComponent(appName.name, () => ReduxApp);
