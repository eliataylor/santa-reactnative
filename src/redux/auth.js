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

export const NEXT_STEP_STARTED = 'NEXT_STEP_STARTED'
export const NEXT_STEP_SUCCESS = 'NEXT_STEP_SUCCESS' // an opportunity for the server to tell the client what to do next
export const NEXT_STEP_FAILURE = 'NEXT_STEP_FAILURE'

export const LOG_OUT = 'LOG_OUT' // generally async anyway (client kills token, doesn't need callback for revoking on server)

// default authentication object
const initialState = {
  me: false,
  token:false,

  signUpError: false,
  verifyError: false,
  logInError: false,

  nextSteps: []
}

export default (state = initialState, action) => {
  var newState = {...state};
  switch(action.type) {

    case LOGIN_STARTED:
      newState.logInError = false;
      return newState;
    case LOGIN_SUCCESS:
      newState.me = action.payload.user;
      let token = {...action.payload};
      delete token.user;
      newState.token = token;
      return newState;
    case LOGIN_FAILURE:
      newState.logInError = action.error;
      return newState;
    case SIGNUP_STARTED:
      newState.signUpError = false;
      return newState;
    case SIGNUP_SUCCESS:
      newState.signUpError = false;
      newState.me = action.user;
      delete action.user;
      newState.token = action;
      if (newState.me.isValid === false) {
        newState.nextSteps.push(VERIFY_STARTED);
      }
      return newState;
    case SIGNUP_FAILURE:
      newState.signUpError = action.error;
      return newState;
    case VERIFY_STARTED:
      newState.verifyError = false;
      return newState;
    case VERIFY_SUCCESS:
      newState.verifyError = false;
      newState.me = action.user;
      delete action.user;
      newState.token = action;
      return newState;
    case VERIFY_FAILURE:
      newState.verifyError = action.error;
      return newState;
    case NEXT_STEP_STARTED:
      newState.logInError = false;
      return newState;
    case NEXT_STEP_SUCCESS:
      newState.logInError = false;
      newState.me = action.user;
      delete action.user;
      newState.token = action;
      return newState;
    case NEXT_STEP_FAILURE:
      newState.logInError = action.error;
      return newState;

    case LOG_OUT:
      return {
        ...initialState,
      }
    default:
      return state
  }
}
