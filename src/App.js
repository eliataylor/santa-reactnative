import React from 'react';
import { connect } from 'react-redux';
import { StatusBar, Text } from 'react-native';
import LoginOrRegister from './screens/LoginOrRegister';
import Snackbar from 'react-native-snackbar';
import RoleSelection from './screens/RoleSelection';
import {checkToken} from './redux/authActions';
import API from './utils/API';

class App extends React.Component {

  async componentDidMount() {
    StatusBar.setHidden(true);
    console.log('APP DID MOUNT');
    var tokens = await API.getLocalTokens();
    console.log(tokens);
    if (tokens) {
      this.props.checkToken();
    }
  }

  render() {

    if (this.props.auth.me) {
      if (this.props.auth.me.isVerified === false) {
        return <LoginOrRegister />;
      }
      if (this.props.lists.error) {
        Snackbar.show({
          title : this.props.lists.error,
          duration : Snackbar.LENGTH_LONG,
          backgroundColor	: 'red',
          color : 'white'
        });
      }
      return <RoleSelection />;
    }

    var errors = [this.props.auth.logInError, this.props.auth.signUpError, this.props.auth.verifyError];
    for(var e in errors) {
      if (errors[e]) {
        Snackbar.show({
          title : errors[e],
          duration : Snackbar.LENGTH_LONG,
          backgroundColor	: 'red',
          color : 'white'
        });
      }
    }
    return <LoginOrRegister />;
  }
}

const mapDispatchToProps = {
  checkToken: () => checkToken()
}

const mapStateToProps = state => ({
  auth: state.auth,
  lists:state.lists
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
