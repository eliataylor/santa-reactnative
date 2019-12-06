import React from 'react';
import { connect } from 'react-redux';
import NavContainer from './screens/NavContainer';
import Snackbar from 'react-native-snackbar';
import API from './utils/API';
import styles from './theme';
import { Linking } from "react-native";
import Config from './Config';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.navigator = false;
  }

/*
  componentDidMount() {
    console.log('APP DID MOUNT');
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    console.log('APP WILLUNMOUNT')
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange(appState) {
    console.log("React handleAppStateChange " + appState);
  }
*/

  onRegister(token) {
    console.log('DEVICE TOKEN REGISTERED', token, this.props.auth.me);
    if (this.props.auth.me.devices) {
      try {
        var devices = (this.props.auth.me.devices) ? JSON.parse(this.props.auth.me.devices) : {};
      } catch(e) {
        console.log('bad devices for json', this.props.auth.me.devices);
        devices = {};
      }
      if (typeof devices[token.token] === 'string') {
        return console.log('device is already saved on server');
      }
    }
    API.Put('/api/users/'+this.props.auth.me._id+'/devicetoken', token)
    .then(res => {
      console.log('stored device token', res.data);
      return res.data;
    })
    .catch(err => {
      var msg = API.getErrorMsg(err);
      console.log('error logging in: ', msg);
      return err;
    });
  }

  onNavigationStateChange(prevState, newState, action) {
    console.log('onNavigationStateChange', prevState, newState, action);
  }

  render() {
    var errors = [this.props.auth.signUpError, this.props.auth.logInError, this.props.auth.verifyError, this.props.lists.errors, this.props.entity.errors];

    for(var e in errors) {
      if (errors[e]) {
        Snackbar.show({
          title : errors[e],
          duration : (e === 0) ? Snackbar.LENGTH_INDEFINITE : Snackbar.LENGTH_LONG,
          backgroundColor	: 'red',
          color : 'white'
        });
      }
    }

    //const prefix = Linking.makeUrl('/');
    //const prefix = 'santafulfills://';
    const prefix = Config.api.base + '/api';
    console.log('prefix', prefix);

    // TODO: snackbar success responses from server?
    return <NavContainer style={styles.root}
            uriPrefix={prefix}
            onNavigationStateChange={this.onNavigationStateChange}
            ref={nav => this.navigator = nav} />;
  }
}

const mapDispatchToProps = {

}

const mapStateToProps = state => {
  return {
    auth:state.auth,
    lists:state.lists,
    entity:state.entity
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
