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
} from 'react-native';

import { connect } from 'react-redux'
const logo = require('../assets/images/logo.png');
import strings from "../config/strings";
import { colors } from '../theme'
import { createUser } from '../redux/authActions'

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

  render() {
    const { signUpError, nextSteps } = this.props
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
      >
        { (this.props.auth.loading === true) ? <View style={styles.loading}><ActivityIndicator size='large'/></View> : null }
        <Image
          source={logo}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.form}>
          <Input
            value={this.state.email}
            placeholder="Email"
            type='email'
            keyboardType='email-address'
            onChangeText={this.onChangeText}
          />
          <Input
            value={this.state.firstname}
            placeholder="Optional First Name"
            type='firstname'
            onChangeText={this.onChangeText}
          />
          <Input
            placeholder="Optional Phone Number"
            type='phone_number'
            keyboardType='phone-pad'
            onChangeText={this.onChangeText}
            value={this.state.phone}
          />
          <Input
            value={this.state.password}
            placeholder="Optional Password"
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
  createUser: (firstname, password, email, phone) => createUser(firstname, password, email, phone)
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)

const styles = StyleSheet.create({
  form: {
    flex: 1,
    justifyContent: "center"
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width:'100%',
    height:'100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex:999999
  },
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    justifyContent: 'center',
    paddingHorizontal: 40
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
