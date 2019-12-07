import API from '../utils/API';
import Config from '../Config';
import AsyncStorage from '@react-native-community/async-storage';

import {
  // events
  APP_READY,
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

function signUpSuccess(payload) {
  return {
    type: SIGNUP_SUCCESS,
    payload
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
    dispatch(signUpStart())
    var me = {};

    if (username) me['name.first'] = username;
    if (password) me.password = password;
    if (phone) me.phone = phone;
    if (email) me.email = email;

    return API.Post('/api/users/register', me)
    .then(res => {
      if (res.data.error) {
        console.log('signUp failed: ', res.data.error);
        dispatch(signUpFailure(res.data.error));
        // TODO: navigate to login with password?
      } else {
        return AsyncStorage.setItem(Config.api.tokName, JSON.stringify(res.data.token),  storage => {
            dispatch(signUpSuccess(res.data));
        });
      }
      return res.data;
    })
    .catch(err => {
      console.log('error creating User: ', err);
      dispatch(signUpFailure(err))
    });
  }
}

export function updateLocation(coords) {
  return (dispatch, getState) => {

    // TODO: stop if coords are < 10 meters away. requires updating auth.me.lastLocation which will fire more renders

    return API.Put('/api/users/'+getState().auth.me._id+'/location', coords)
    .then(res => {
      console.log('last location update: ', res.data);
    })
    .catch(err => {
      console.log('error updating location: ', err);
    });
  }
}

export function authenticate(credentials) {
  return (dispatch) => {
    dispatch(logInStart())

    API.Post('/oauth/token', credentials)
    .then(res => {
      if (res.data.error) {
        dispatch(logInFailure(res.data.error));
      } else {
        let me = res.data.me;
        let token = res.data.token;
        AsyncStorage.setItem(Config.api.tokName, JSON.stringify(token),  storage => {
            dispatch(logInSuccess(res.data))
            return res;
        });
      }
      return res.data;
    })
    .catch (err => {
      var msg = API.getErrorMsg(err);
      console.log('error logging in: ', msg)
      dispatch(logInFailure(msg))
      return err;
    })
  }
}


export function checkToken(token) {
  return (dispatch) => {
    API.Get('/api/users/me') // TODO: send through new axios instance without oauth interceptors
    .then(res => {
      return dispatch(logInSuccess(res.data));
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
export function checkVerificationCode(code, uid, email) {
  return (dispatch, getState) => {

    dispatch(verifyStart());

    const data = {};
    const state = getState();
    if (uid) {
      data.uid = uid;
    } else if (state.auth.me && state.auth.me._id) {
      data.uid = state.auth.me._id;
    } else if (email) {
      data.email;
    } else {
      return dispatch(verifyFailure('missing email or user id'));
    }

    API.Post('/api/verify/'+code, data)
      .then(res => {
        console.log("VERIFIED", res.data);
        if (typeof res.data.me !== 'undefined') {
          dispatch(verifySuccess());
          AsyncStorage.setItem(Config.api.tokName, JSON.stringify(res.data.token),  storage => {
              dispatch(logInSuccess(res.data))
              return res;
          });
        } else {
          var msg = res.data.error;
          return dispatch(verifyFailure(msg || 'unknown verification error'));
        }
      })
      .catch(err => {
        var msg = API.getErrorMsg(err);
        console.log('error logging in: ', msg)
        dispatch(verifyFailure(msg))
        return err;
      });
  }
}
