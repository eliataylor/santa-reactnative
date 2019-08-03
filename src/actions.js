import API from './utils/API';
//import AsyncStorage from '@react-native-community/async-storage';
import {AsyncStorage} from 'react-native';

import {
  // events
  LOGIN_STARTED,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,

  SIGNUP_STARTED,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,

  VERIFY_STARTED,
  VERIFY_SUCCESS,
  VERIFY_FAILURE,

  NEXT_STEP_STARTED, // will hold verification
  NEXT_STEP_SUCCESS,
  NEXT_STEP_FAILURE,

  LOG_OUT,

} from './redux/auth'

export function logOut() {
  return {
    type: LOG_OUT
  }
}

function logInStart() {
  return {
    type: LOGIN_STARTED
  }
}

function logInSuccess(user) {
  return {
    type: LOGIN_SUCCESS,
    user
  }
}

function logInFailure(err) {
  return {
    type: LOGIN_FAILURE,
    error: err
  }
}

function signUpStart() {
  return {
    type: SIGNUP_STARTED
  }
}

function signUpSuccess(user) {
  return {
    type: SIGNUP_SUCCESS,
    user
  }
}

function signUpFailure(err) {
  return {
    type: SIGNUP_FAILURE,
    error: err
  }
}


function verifyStart() {
  return {
    type: VERIFY_STARTED
  }
}

function verifySuccess(user) {
  return {
    type: VERIFY_SUCCESS,
    user
  }
}

function verifyFailure(err) {
  return {
    type: VERIFY_FAILURE,
    error: err
  }
}

function nextStepStart() {
  return {
    type: NEXT_STEP_STARTED
  }
}

function nextStepSuccess(action) {
  return {
    type: NEXT_STEP_SUCCESS,
    action
  }
}

function nextStepFailure(err) {
  return {
    type: NEXT_STEP_FAILURE,
    error: err
  }
}


/** Actual functions **/
export function createUser(username, password, email, phone) {
  return (dispatch) => {
    dispatch(signUpStarted())
    var me = {};

    if (username) me['name.first'] = username;
    if (password) me.password = password;
    if (phone) me.phone = phone;
    if (email) me.email = email;

    API.Post('/api/users/register', me)
    .then(user => {
      console.log('signUp succeeded: ', user)
      AsyncStorage.setItem(Config.api.tokName, JSON.stringify(user.token),  storage => {
          dispatch(signUpSuccess(res.user));
          return res.user;
      });
    })
    .catch(err => {
      console.log('error creating User: ', err);
      dispatch(signUpFailure(err))
    });
  }
}

export function authenticate(credentials) {
  return (dispatch) => {
    dispatch(logInStart())

    API.Post('/oauth/token', credentials)
    .then(res => {
      let me = res.user;
      let token = res.token;
      return AsyncStorage.setItem(Config.api.tokName, JSON.stringify(res.token),  storage => {
          dispatch(logInSuccess(res));
          // load wishes
          return res;
      });
    })
    .catch (err => {
      console.log('error logging in: ', err)
      dispatch(logInFailure(err))
      return Promise.reject(err);
    })
  }
}


export function checkToken() {
  return (dispatch) => {
    API.Get('/api/users/me')
    .then(res => {
      let me = res.user;
      let token = res.token;
      return AsyncStorage.setItem(Config.api.tokName, JSON.stringify(res.token),  storage => {
          dispatch(logInSuccess(res));
          // load wishes
          return res;
      });
    })
    .catch (err => {
      console.log('error logging in: ', err)
      dispatch(logInFailure(err))
      return Promise.reject(err);
    })
  }
}

// updates isValid
export function verifyUser(credentials) {
  return (dispatch) => {
    dispatch(verifyStart())
    API.Put('/api/users/:id/verify/:code', credentials)
      .then(user => {
        let me = res.user;
        let token = res.token;
        AsyncStorage.setItem(Config.api.tokName, JSON.stringify(res.token),  storage => {
            dispatch(verifySuccess(user))
            return res;
        });
      })
      .catch(err => {
        console.log('error verifying user: ', err)
        dispatch(verifyFailure(err));
        return Promise.reject(err);
      });
  }
}
