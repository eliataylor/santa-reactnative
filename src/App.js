import React from 'react';
import {connect} from 'react-redux';
import NavContainer from './screens/NavContainer';
import {setDeviceToken} from './redux/authActions';
//import NotifService from './utils/NotifService';
import Snackbar from 'react-native-snackbar';
import API from './utils/API';
import styles from './theme';
import {Linking, Alert} from 'react-native';
import Config from './Config';
import messaging from '@react-native-firebase/messaging';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.navigator = false;
    this.onRegister = this.onRegister.bind(this);
    this.onNotification = this.onNotification.bind(this);
    // this.notifService = new NotifService(this.onRegister, this.onNotification);
    this.handleDeepLink = this.handleDeepLink.bind(this);
    this.registerDeviceForRemoteMessages();
    this.initializePushNotifications();
  }

  // must be called on each app boot
  registerDeviceForRemoteMessages = async () =>
    await messaging().registerDeviceForRemoteMessages();

  componentDidMount() {
    // this.notifService = new NotifService(this.onRegister, this.onNotification);
    Linking.addEventListener('url', this.handleDeepLink);
  }

  initializePushNotifications = async () => {
    await this.checkPermission();
    this.messageListener();
  };

  checkPermission = async () => {
    const enabled = await messaging().hasPermission();
    enabled > 0
      ? await this.saveFcmTokenToAsyncStorage()
      : await this.requestPermission();
  };

  saveFcmTokenToAsyncStorage = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      this.onRegister(fcmToken);
      console.log(fcmToken);
    }
  };

  requestPermission = async () => {
    try {
      await messaging().requestPermission({
        sound: false,
        announcement: true,
        alert: true,
      });
      // User has authorised
      await this.saveFcmTokenToAsyncStorage();
    } catch (error) {
      // User has rejected permissions
      console.log(error);
    }
  };

  messageListener = async () => {
    messaging().onNotificationOpenedApp(notification => {
      this.onNotification(notification.data);
      console.log(notification.data);
    });

    const notification = await messaging().getInitialNotification();
    if (notification) {
      this.onNotification(notification.data);
      console.log(notification.data);
    }

    // This method will redirect with push notification when app is in foreground
    messaging().onMessage(async notification => {
      const enabled = await messaging().hasPermission();
      if (enabled > 0 && notification) this.onNotification(notification.data);
    });
  };

  componentWillUnmount() {
    console.log('App WILLUNMOUNT');
    Linking.removeEventListener('url', this.handleDeepLink);
    // AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleDeepLink(appState) {
    console.log('React App handleDeepLink ', appState);
    if (typeof appState === 'string') appState = {url: appState}; // restructures from getInitialURL();
    if (typeof appState.url !== 'undefined') {
      const route = appState.url.replace(/.*?:\/\//g, '');
      const pathname = route.substring(
        route.indexOf('/'),
      ); /*  santa-local.herokuapp.com:3000/users/ZZZ/verify/XXX  */
      console.log('LOADING INIT URL ' + pathname);
      if (pathname.indexOf('/users/') === 0) {
        var parts = pathname.split('/');
        console.log(parts);
        return this.navigator._navigation.navigate('VerifyUser', {
          code: parts[4],
          uid: parts[2],
        });
      } else if (pathname.indexOf('/wishes') === 0) {
        return this.navigator._navigation.navigate('Wishes');
      } else if (pathname.indexOf('/create-a-wish') === 0) {
        return this.navigator._navigation.navigate('CreateWish');
      }
    }
  }

  /*
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

    for (var e in errors) {
      if (
        e === errors[e] ||
        typeof e !== 'string' ||
        e === 'null' ||
        e === 'undefined' ||
        e === 'false'
      ) {
        continue;
      }
      Snackbar.show({
        title: e,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'red',
        color: 'white',
      });
    }

    if (prevProps.auth.me === false && this.props.auth.me) {
      if (this.props.auth.deviceToken) {
        this.props.setDeviceToken(
          this.props.auth.me._id,
          this.props.auth.deviceToken,
        );
      }
    } else if (!prevProps.auth.deviceToken && this.props.auth.deviceToken) {
      this.props.setDeviceToken(
        this.props.auth.me._id,
        this.props.auth.deviceToken,
      );
    }
  }

  onRegister(token) {
    console.log('ONREGISTERED!', token);
    if (!this.props.auth.me) {
      this.props.setDeviceToken(false, token);
    } else {
      this.props.setDeviceToken(this.props.auth.me._id, token);
    }
  }

  onNotification(notification) {
    console.log('NOTIFICATION OPENED', notification);
    // TODO: parse notification for single wish ID
    /*
      {"collapse_key": "org.bethesanta.react", "finish": [Function finish], "foreground": true, "google.delivered_priority": "normal", "google.message_id": "0:1582920592626927%48acde5a48acde5a", "google.original_priority": "normal", "google.sent_time": 1582920592609, "google.ttl": 2416371, "id": "1385619521",
      "message": "Insulin medication", "msgcnt": "2", "notification": {"badge": "2", "body": "Insulin medication", "sound": "ping", "title": "Someone has a wish near you"},
      "sender": "Santa", "sound": "ping.aiff", "title": "Someone has a wish near you", "userInteraction": false}
      if (typeof notification.alert === 'object' && typoef typeof notification.alert.wish_ids === 'object' && notification.alert.wish_ids.length > 0) {
          return this.navigator._navigation.navigate('WishDetail');
      }
      */

    //return this.navigator._navigation.navigate('Wishes');
  }

  /* onNavigationStateChange(prevState, newState, action) {
    console.log('onNavigationStateChange', prevState, newState, action);
  } */

  render() {
    const prefix = Config.api.base;
    //console.log('prefix', prefix);

    // TODO: snackbar success responses from server?
    return (
      <NavContainer
        style={styles.root}
        uriPrefix={prefix}
        // onNavigationStateChange={this.onNavigationStateChange}
        ref={nav => (this.navigator = nav)}
      />
    );
  }
}

const mapDispatchToProps = {
  setDeviceToken: (uid, token) => setDeviceToken(uid, token),
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
    lists: state.lists,
    entity: state.entity,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
