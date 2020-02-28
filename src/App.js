import React from 'react';
import { connect } from 'react-redux';
import NavContainer from './screens/NavContainer';
import NotifService from './utils/NotifService';
import Snackbar from 'react-native-snackbar';
import API from './utils/API';
import styles from './theme';
import { Linking } from "react-native";
import Config from './Config';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.navigator = false;
    this.onRegister = this.onRegister.bind(this);
    this.onNotification = this.onNotification.bind(this);
    this.notifService = new NotifService(this.onRegister, this.onNotification);
  }

/*
  componentDidMount() {
    this.notifService = new NotifService(this.onRegister, this.onNotification);
  }

  componentWillUnmount() {
    console.log('APP WILLUNMOUNT')
    AppState.removeEventListener('change', this.handleAppStateChange);
  }
  handleAppStateChange(appState) {
    console.log("React handleAppStateChange " + appState);
  }
*/

  componentDidUpdate(prevProps, prevState) {
    var errors = {};

    errors[this.props.auth.signUpError] = prevProps.auth.signUpError;
    errors[this.props.auth.logInError] = prevProps.auth.logInError;
    errors[this.props.auth.verifyError] = prevProps.auth.verifyError;
    errors[this.props.lists.errors] = prevProps.lists.errors;
    errors[this.props.entity.errors] = prevProps.entity.errors;

    for(var e in errors) {
      if (e === errors[e] || typeof e !== 'string' || e === 'null' || e === 'undefined' || e === 'false') {
        continue;
      }
      Snackbar.show({
        title : e,
        duration : Snackbar.LENGTH_LONG,
        backgroundColor	: 'red',
        color : 'white'
      });
    }

    /* if (prevProps.auth.me === false && this.props.auth.me) {
      this.notifService = new NotifService(this.onRegister, this.onNotification);
    } */
  }

  onRegister(token) {
    if (!this.props.auth.me) return false;
    console.log('DEVICE TOKEN REGISTERED', token, this.props.auth.me);
    if (this.props.auth.me.devices) {
      try {
        var devices = (this.props.auth.me.devices) ? JSON.parse(this.props.auth.me.devices) : {};
      } catch(e) {
        console.log('bad devices for json', this.props.auth.me.devices);
        devices = {};
      }
      if (typeof devices[token.token] === 'string') {
        return console.log('device is already saved on server: ', devices);
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

  onNotification(notification) {
      console.log("NOTIFICATION OPENED", notification);
      // TODO: parse notification and send to proper Screen
      /* {"collapse_key": "org.bethesanta.react", "finish": [Function finish], "foreground": true, "google.delivered_priority": "normal", "google.message_id": "0:1582920592626927%48acde5a48acde5a", "google.original_priority": "normal", "google.sent_time": 1582920592609, "google.ttl": 2416371, "id": "1385619521",
      "message": "Insulin medication", "msgcnt": "2", "notification": {"badge": "2", "body": "Insulin medication", "sound": "ping", "title": "Someone has a wish near you"},
      "sender": "Santa", "sound": "ping.aiff", "title": "Someone has a wish near you", "userInteraction": false} */
  }


/*  onNavigationStateChange(prevState, newState, action) {
    console.log('onNavigationStateChange', prevState, newState, action);
  } */

  render() {
    //const prefix = Linking.makeUrl('/');
    //const prefix = 'santafulfills://';
    const prefix = Config.api.base + '/api';
    console.log('prefix', prefix);

    // TODO: snackbar success responses from server?
    return <NavContainer style={styles.root}
            uriPrefix={prefix}
//            onNavigationStateChange={this.onNavigationStateChange}
            ref={nav => this.navigator = nav} />;
  }
}

/* const mapDispatchToProps = {
  clearAuthErrors: () => clearAuthErrors()
} */

const mapStateToProps = state => {
  return {
    auth:state.auth,
    lists:state.lists,
    entity:state.entity
  }
}

export default connect(mapStateToProps, null)(App);
