import React from 'react';
import {connect} from 'react-redux';
// import { Linking, Alert, Platform, AppState, BackHandler, View, ActivityIndicator } from 'react-native';
import {
  Linking,
  ActivityIndicator,
  AsyncStorage,
  Alert,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import {withNavigation} from 'react-navigation';
//import Snackbar from 'react-native-snackbar';
import API from '../utils/API';
import styles from '../theme';
import colors from '../config/colors';
import {checkToken} from '../redux/authActions';

class AuthLoading extends React.Component {
  componentDidMount() {
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    var linkTest = await Linking.getInitialURL()
      .then(url => {
        if (url) {
          const route = url.replace(/.*?:\/\//g, '');
          const pathname = route.substring(
            route.indexOf('/'),
          ); /*  santa-local.herokuapp.com:3000/api/users/ZZZ/verify/XXX  */
          console.log('LOADING INIT URL _bootstrapAsync' + pathname);
          if (pathname.indexOf('/users/') === 0) {
            var parts = pathname.split('/');
            console.log(parts);
            return this.props.navigation.navigate('VerifyUser', {
              code: parts[4],
              uid: parts[2],
            });
          } else if (pathname.indexOf('/wishes') === 0) {
            return this.props.navigation.navigate('Wishes');
          } else if (pathname.indexOf('/create-a-wish') === 0) {
            return this.props.navigation.navigate('CreateWish');
          }
        }
        return false;
      })
      .catch(err => Alert.alert('Autologin Error', err));

    this.tokens = await API.getLocalTokens();
    if (this.tokens) {
      console.log('checking token', this.tokens);
      this.props.checkToken(this.tokens);
    } else {
      this.props.navigation.navigate('SignIn');
      console.log('no tokens found', this.tokens);
    }
  };

  componentDidUpdate(prevProps) {
    if (this.props.auth.me) {
      if (this.props.auth.me.isVerified === true) {
        this.props.navigation.navigate('HomeScreen');
      } else {
        this.props.navigation.navigate(
          'VerifyUser',
          this.props.navigation.state.params,
        ); // obj.params = {code:parts[5], uid:parts[3]};
      }
    } else if (this.props.auth.signUpError) {
      this.props.navigation.navigate('SignUp');
    } else if (this.props.auth.logInError) {
      this.props.navigation.navigate('SignIn');
    } else if (this.props.auth.verifyError) {
      this.props.navigation.navigate(
        'VerifyUser',
        this.props.navigation.state.params,
      );
    }
  }

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.SOFT_RED} />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const mapDispatchToProps = {
  checkToken: tokens => checkToken(tokens),
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withNavigation(AuthLoading));
