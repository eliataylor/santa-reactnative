// events
export const LOGIN_STARTED = 'LOGIN_STARTED' // for modals / navigation
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS' //
export const LOGIN_FAILURE = 'LOGIN_FAILURE'

export const SIGNUP_STARTED = 'SIGNUP_STARTED'
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS' // an opportunity for the client to route what's next
export const SIGNUP_FAILURE = 'SIGNUP_FAILURE'

export const VERIFY_STARTED = 'VERIFY_STARTED'
export const VERIFY_SUCCESS = 'VERIFY_SUCCESS' // an opportunity for the client to route what's next
export const VERIFY_FAILURE = 'VERIFY_FAILURE'

export const CLEAR_ERRORS = 'CLEAR_ERRORS'
export const DEVICE_TOKEN = 'DEVICE_TOKEN'
export const LOG_OUT = 'LOG_OUT' // generally async anyway (client kills token, doesn't need callback for revoking on server)

// default authentication object
const initialState = {
  me: false,

  loading:false,
  signUpError: false,
  verifyError: false,
  logInError: false,
}

export default (state = initialState, action) => {
  var newState = {...state};
  switch(action.type) {
    case LOGIN_STARTED:
      newState.loading = true;
      newState.logInError = false;
      return newState;
    case LOGIN_SUCCESS:
      newState.loading = false;
      if (action.payload.me) {
        newState.me = action.payload.me; // from checkToken
      } else {
        newState.me = action.payload.user;
      }
      newState.categories = action.payload.categories;
      newState.me.offers = action.payload.offers;
      return newState;
    case LOGIN_FAILURE:
      newState.loading = false;
      newState.logInError = action.error;
      return newState;
    case SIGNUP_STARTED:
      newState.loading = true;
      newState.signUpError = false;
      return newState;
    case SIGNUP_SUCCESS:
      newState.loading = false;
      newState.signUpError = false;
      newState.me = action.payload.me; // from registration
      newState.categories = action.payload.categories;
      newState.me.offers = action.payload.offers;
      return newState;
    case SIGNUP_FAILURE:
      newState.loading = false;
      newState.signUpError = action.error;
      return newState;
    case VERIFY_STARTED:
      newState.loading = true;
      newState.verifyError = false;
      return newState;
    case VERIFY_SUCCESS:
      newState.loading = false;
      newState.verifyError = false;
      return newState;
    case VERIFY_FAILURE:
      newState.loading = false;
      newState.verifyError = action.error;
      return newState;
    case CLEAR_ERRORS:
      newState.logInError = false;
      newState.signUpError = false;
      newState.verifyError = false;
      return newState;
    case DEVICE_TOKEN:
      newState.deviceToken = action.token;
      return newState;
    case LOG_OUT:
      return {
        ...initialState,
      }
    default:
      return state
  }
}
