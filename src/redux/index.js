import { combineReducers } from 'redux'
import authReducer from './auth'
import listDataReducer from './listDataReducer';
import entityDataReducer from './entityDataReducer';

export default combineReducers({
  "auth": authReducer,
  "lists": listDataReducer,
  "entity": entityDataReducer
})
