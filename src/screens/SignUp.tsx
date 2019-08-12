import React, { Component } from 'react';
import {
  Platform,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal
} from 'react-native';

import { connect } from 'react-redux'

import strings from "../config/strings";
import { colors } from '../theme'
import { createUser, verifyUser } from '../redux/authActions'

import Input from '../components/FormTextInput'
import Button from '../components/Button'

interface State {
  firstname: string;
  password: string;
  email: string;
  phone: string;
  authCode: string;
}

class SignUp extends React.Component<{}, State> {
  readonly state: State = {
    firstname: '',
    password: '',
    email: '',
    phone: '',
    authCode: ''
  };

  onChangeText = (key, value) => {
    this.setState({
      [key]: value
    })
  }

  signUp() {
    const { firstname, password, email, phone } = this.state
    this.props.createUser(firstname, password, email, phone)
  }

  confirm() {
    const { authCode, firstname } = this.state
    this.props.verifyUser(firstname, authCode)
  }

//  getDerivedStateFromProps(nextProps) {
/*  componentWillReceiveProps(nextProps) {
    const {nexSteps} = nextProps.auth;
    if (nexSteps && this.props.auth.nexSteps != nexSteps) { // test deep
      // this.setState(initialState)
    }
  } */

  render() {
    const { signUpError, nextSteps } = this.props
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
      >
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.form}>
          <Input
            value={this.state.firstname}
            placeholder="First Name"
            type='firstname'
            onChangeText={this.onChangeText}
          />
          <Input
            value={this.state.email}
            placeholder="Email"
            type='email'
            keyboardType='email-address'
            onChangeText={this.onChangeText}
          />
          <Input
            placeholder="Phone Number"
            type='phone_number'
            keyboardType='phone-pad'
            onChangeText={this.onChangeText}
            value={this.state.phone}
          />
          <Input
            value={this.state.password}
            placeholder="Password"
            secureTextEntry
            type='password'
            onChangeText={this.onChangeText}
          />
        </View>
        <Button
          label={strings.SIGNUP}
          onPress={this.signUp.bind(this)}
        />
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = state => ({
  auth: {...state.auth}
})

const mapDispatchToProps = {
  verifyUser: (firstname, authCode) => verifyUser(firstname, authCode),
  createUser: (firstname, password, email, phone) => createUser(firstname, password, email, phone)
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  form: {
    flex: 1,
    justifyContent: "center",
    width: "80%"
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 40
  },
  greeting: {
    marginTop: 20,
    // fontFamily: fonts.light,
    fontSize: 24
  },
  greeting2: {
    //fontFamily: fonts.light,
    color: '#666',
    fontSize: 24,
    marginTop: 5
  },
  heading: {
    flexDirection: 'row'
  },
  logo: {
    flex: 1,
    width: "100%",
    resizeMode: "contain",
    alignSelf: "center"
  },
  errorMessage: {
    // fontFamily: fonts.base,
    fontSize: 12,
    marginTop: 10,
    color: 'transparent'
  }
});
