import API from './API';

const UserAuth = {

  initApp : function() {
    return API.Get('/api/users/me');
  },

  signIn : function(username, password) {
    console.log(username, password);
  },

  confirmSignUp : function(username, authCode) {
    console.log(username, authCode);
  },

  confirmSignIn : function(username, authCode) {
    console.log(username, authCode);
  }

}

export default UserAuth;
