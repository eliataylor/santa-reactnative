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
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  form: {
    flex: 1,
    justifyContent: "center"
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
