import API from '../utils/API';
import Config from '../Config';
import AsyncStorage from '@react-native-community/async-storage';

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

  LOG_OUT

} from './auth'

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

function logInSuccess(payload) {
  return {
    type: LOGIN_SUCCESS,
    payload
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

    return API.Post('/api/users/register', me)
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
      let me = res.data.me;
      let token = res.data.token;
      AsyncStorage.setItem(Config.api.tokName, JSON.stringify(token),  storage => {
          dispatch(logInSuccess(res.data))
          return res;
      });
    })
    .catch (err => {
      var msg = API.getErrorMsg(err);
      console.log('error logging in: ', msg)
      dispatch(logInFailure(msg))
      return err;
    })
  }
}


export function checkToken() {
  return (dispatch) => {
    API.Get('/api/users/me')
    .then(res => {
      return dispatch(logInSuccess(res.data))
    })
    .catch (err => {
      var msg = API.getErrorMsg(err);
      console.log('error logging in: ', msg)
      dispatch(logInFailure(msg))
      return err;
    })
  }
}

// updates isVerified
export function checkVerificationCode(code) {
  return (dispatch, getState) => {

    dispatch(verifyStart())

    var state = getState();
    // server verification is not complete yet
    API.Get('/api/verify/'+state.auth.me._id+'/' + code)
      .then(res => {
        console.log("VERIFIED", res.data);
        if (typeof res.data.success !== 'undefined') {
          dispatch(verifySuccess());
          // TODO run appstartup
          dispatch(checkToken());
        }
        var msg = res.data.error;
        return dispatch(verifyFailure(msg || 'unknown error'));
      })
      .catch(err => {
        var msg = API.getErrorMsg(err);
        console.log('error logging in: ', msg)
        dispatch(verifyFailure(msg))
        return err;
      });
  }
}
