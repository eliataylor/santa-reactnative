import React from 'react';
import { connect } from 'react-redux';
//import { Linking, Alert, Platform, AppState, BackHandler, View, ActivityIndicator } from 'react-native';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import { NavigationActions } from 'react-navigation';
//import Snackbar from 'react-native-snackbar';
import API from '../utils/API';
import styles from '../theme';
import colors from "../config/colors";
import {checkToken} from '../redux/authActions';

class AuthLoading extends React.Component {

  constructor(props) {
    super(props);
    this.navigator = false;
  }

  componentDidMount() {
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    this.tokens = API.getLocalTokens();
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
        this.props.navigation.navigate('VerifyUser');
        // obj.params = {code:parts[5], uid:parts[3]};
      }
    } else if (!prevProps.auth.signUpError && this.props.auth.signUpError) {
      console.log('init with signUpError', this.props.auth);
      this.props.navigation.navigate('SignIn');
    }
  }

  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator color={colors.SOFT_RED} />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}


const mapDispatchToProps = {
  checkToken: (tokens) => checkToken(tokens)
}

const mapStateToProps = state => {
  return {
    auth:state.auth
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthLoading);
