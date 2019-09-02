import React from 'react';
import { connect } from 'react-redux';
import { StatusBar, Text, Linking, Platform, Alert, AppState } from 'react-native';
import NavContainer from './screens/NavContainer';
import Snackbar from 'react-native-snackbar';
import {checkToken} from './redux/authActions';
import API from './utils/API';
import NotifService from './utils/NotifService';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
    this.notif = false;
    this.state = {permissions:false}
  }

  async componentDidMount() {
    StatusBar.setHidden(true);
    AppState.addEventListener('change', this.handleAppStateChange);
    console.log('APP DID MOUNT');
    var tokens = await API.getLocalTokens();
    console.log(tokens);
    if (Platform.OS === 'android') {
      Linking.getInitialURL().then(url => {
        this.parseUrl(url);
      });
      // this.notif.subscribeToTopic(topic: string)
    } else {
      Linking.addEventListener('url', this.handleOpenURL);
      // this.notif.getApplicationIconBadgeNumber(callback: Function)
    }
    if (tokens) {
      this.props.checkToken();
    } else {
      console.log('no tokens found');
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
    Linking.removeEventListener('url', this.handleOpenURL);
  }

  handleAppStateChange(appState) {
    console.log("React handleAppStateChange " + appState);
    if (appState === 'background') {
      //
    }
  }


  handleOpenURL = (event) => {
    this.parseUrl(event.url);
  }


  // WARN: docs say use this.navigator.dispatch(NavigationActions.navigate({ routeName: someRouteName }));
  // but they don't explain NavigationActions
  parseUrl = (url) => {
    if (!url) return console.log('no url on launch', this.navigator._navigation);
    console.log("parsing url", this.navigator._navigation);
    const route = url.replace(/.*?:\/\//g, '');
    const pathname = route.substring(route.indexOf('/')); /*  santa-local.herokuapp.com:3000/api/users/ZZZ/verify/XXX  */
    console.log('load', url, route, pathname);
    if (pathname.indexOf('/api/users/') === 0) {
      var parts = pathname.split('/');
      this.navigator._navigation.navigate('VerifyUser', {code:parts[5], uid:parts[3]});
    } else if (pathname.indexOf('/api/wishes') === 0) {
      this.navigator._navigation.navigate('Wishes');
    } else if (pathname.indexOf('/api/create-a-wish') === 0) {
      this.navigator._navigation.navigate('CreateWish');
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.auth.me && this.props.auth.me) {
      if (this.props.auth.me.isVerified === true) {
        this.navigator._navigation.navigate('Wishes');
      } else {
        this.navigator._navigation.navigate('VerifyUser');
      }

      if (this.notif === false) {
        this.notif = new NotifService(this.onRegister.bind(this), this.onNotif.bind(this));
      } else if (this.state.permissions === false) {
        console.log("componentDidUpdate CHECKING Permissions", this.state.permissions);
        this.notif.checkPermission(this.handlePerm.bind(this));
      }
    }
  }

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
      console.log('error logging in: ', msg)
      return err;
    });
  }

  onNotif(notif) {
    console.log(notif);
    Alert.alert(notif.title, notif.message);
  }

  handlePerm(perms) {
    this.setState({permissions:perms});
    console.log("Handling Permissions", perms);
  }

  onNavigationStateChange(prevState, newState, action) {
    console.log('onNavigationStateChange', prevState, newState, action);
  }

  render() {
    var errors = [this.props.auth.logInError, this.props.auth.signUpError, this.props.auth.verifyError, this.props.lists.errors, this.props.entity.errors];
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
    // TODO: snackbar success responses from server?

    return <NavContainer
        onNavigationStateChange={this.handleNavigationChange}
        ref={nav => {this.navigator = nav;}} />;
  }
}

const mapDispatchToProps = {
  checkToken: () => checkToken()
}

const mapStateToProps = state => ({
  auth: state.auth,
  lists:state.lists,
  entity:state.entity,
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
