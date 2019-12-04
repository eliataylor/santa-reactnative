import React from 'react';
import { connect } from 'react-redux';
import { NavigationActions, navigation } from 'react-navigation';
import { Linking, Alert, Platform, AppState, BackHandler, View, ActivityIndicator } from 'react-native';
import NavContainer from './screens/NavContainer';
import Snackbar from 'react-native-snackbar';
import {checkToken} from './redux/authActions';
import API from './utils/API';
import NotifService from './utils/NotifService';
import styles from './theme';
import colors from "./config/colors";

class App extends React.Component {

  constructor(props) {
    super(props);
    this.notif = false;
    this.state = {permissions:false};
    this.backHandler = null;
    this.navigator = false;
    this.tokens = API.getLocalTokens();
  }

  async componentDidMount() {
    console.log('APP DID MOUNT');
    AppState.addEventListener('change', this.handleAppStateChange);
    this.tokens = await API.getLocalTokens();

    if (this.tokens) {
      console.log('checking token', this.tokens);
      this.props.checkToken(this.tokens);
    } else {
      this.props.checkToken(false);
      console.log('no tokens found', this.tokens);
    }

    if (this.props.auth.appReady === true) {     // prevents race condition with return of 'me' from token
      this.applyListeners();
    }

  }

  componentDidUpdate(prevProps) {
    if (this.props.auth.appReady === true) {
      if (prevProps.auth.appReady === false) {     // prevents race condition with return of 'me' from token
        Alert.alert('applyingListeners on update');
        this.applyListeners();
      }
      if (!prevProps.auth.me && this.props.auth.me) {

        const obj = {};
        if (this.props.auth.me.isVerified === true) {
          obj.routeName = 'HomeScreen';
        } else {
          obj.routeName = 'VerifyUser';
          // obj.params = {code:parts[5], uid:parts[3]};
        }
        this.navigator._navigation.dispatch(NavigationActions.navigate(obj));

        if (this.notif === false) {
          this.notif = new NotifService(this.onRegister.bind(this), this.onNotif.bind(this));
        } else if (this.state.permissions === false) {
          console.log("componentDidUpdate CHECKING Permissions", this.state.permissions);
          this.notif.checkPermission(this.handlePerm.bind(this));
        }
      } else if (!prevProps.auth.signUpError && this.props.auth.signUpError && this.props.auth.signUpError.indexOf('your password') > -1) {
        console.log('init with signUpError', this.props.auth);
        this.navigator._navigation.dispatch(NavigationActions.navigate({routeName:'SignIn'}));
      } else {
        console.log('unknown update', this.props.auth);
      }
    } else {
      Alert.alert('not ready. was: ' + JSON.stringify(prevProps.auth.appReady));
      this.props.checkToken();
    }
  }

  applyListeners() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!this.navigator || !this.navigator._navState) {
        return console.log('no routes yet');
      };
      console.log("back button clicked", this.navigator._navState);
      var curScreen = this.navigator._navState.routes[this.navigator._navState.index].key;

      const obj = {};

      if (this.props.auth.me) {
          obj.key = "HomeScreen"; // TODO: check if modal is open?
      } else {
        if (curScreen === 'VerifyUser') {
          obj.key = "SignIn";
        } else {
          obj.key = "VerifyUser";
        }
      }
      const backAction = NavigationActions.back(obj);
      return this.navigator._navigation.dispatch(backAction);
    });

    if (Platform.OS === 'android') {
      Linking.getInitialURL().then(url => {
        this.parseUrl(url);
      });
      // this.notif.subscribeToTopic(topic: string)
    } else {
      Linking.addEventListener('url', this.handleOpenURL);
      // this.notif.getApplicationIconBadgeNumber(callback: Function)
    }
  }

  componentWillUnmount() {
    console.log('APP WILLUNMOUNT')
    AppState.removeEventListener('change', this.handleAppStateChange);
    if (Platform.OS !== 'android') {
      Linking.addEventListener('url', this.handleOpenURL);
    }
    this.backHandler.remove();
  }

  handleAppStateChange(appState) {
    Alert.alert('does this need to be bound?');
    console.log("React handleAppStateChange " + appState);
  }

  handleOpenURL = (event) => {
    this.parseUrl(event.url);
  }

  parseUrl = (url) => {
    if (!url) {
      console.log('no url on launch');
    } else if (this.navigator && this.navigator._navigation) {
      console.log("parsing url", this.navigator._navigation);
      const route = url.replace(/.*?:\/\//g, '');
      const pathname = route.substring(route.indexOf('/')); /*  santa-local.herokuapp.com:3000/api/users/ZZZ/verify/XXX  */
      console.log('load', url, route, pathname);

      const obj = {};

      if (pathname.indexOf('/api/users/') === 0) {
        var parts = pathname.split('/');
        obj.routeName = 'VerifyUser';
        obj.params = {code:parts[5], uid:parts[3]};
      } else if (pathname.indexOf('/api/wishes') === 0) {
        obj.routeName = 'Wishes';
      } else if (pathname.indexOf('/api/create-a-wish') === 0) {
        obj.routeName = 'CreateWish';
      }
      const navigateAction = NavigationActions.navigate(obj);
      this.navigator._navigation.dispatch(navigateAction);
    } else {
      Alert.alert('recalling parseUrl' +  url);
      setTimeout(e => this.parseUrl(url), 500);
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
      console.log('error logging in: ', msg);
      return err;
    });
  }

  onNotif(notif) {
    console.log(notif);
    // only need in background
  }

  handlePerm(perms) {
    this.setState({permissions:perms});
    console.log("Handling Permissions", perms);
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
    if (this.props.auth.appReady === false) {
      return <View style={styles.loading}><ActivityIndicator size='large' /></View>;
    }

    // TODO: snackbar success responses from server?
    return <NavContainer
        style={styles.root}
        onNavigationStateChange={this.onNavigationStateChange}
        ref={nav => this.navigator = nav} />;
  }
}

const mapDispatchToProps = {
  checkToken: (tokens) => checkToken(tokens),
  navigation: e => navigation(e)
}

const mapStateToProps = state => {
  return {
    auth:state.auth,
    lists:state.lists,
    entity:state.entity
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
