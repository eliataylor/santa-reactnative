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

import { colors } from '../theme'
import { createUser, confirmUserSignUp } from '../actions'

import Input from '../components/FormTextInput'
import Button from '../components/Button'

const initialState = {
  firstname: '',
  password: '',
  email: '',
  phone: '',
  authCode: ''
}

class SignUp extends Component<{}> {
  state = initialState

  onChangeText = (key, value) => {
    this.setState({
      [key]: value
    })
  }

  signUp() {
    const { firstname, password, email, phone } = this.state
    this.props.dispatchCreateUser(firstname, password, email, phone)
  }

  confirm() {
    const { authCode, firstname } = this.state
    this.props.dispatchConfirmUser(firstname, authCode)
  }

//  getDerivedStateFromProps(nextProps) {
  componentWillReceiveProps(nextProps) {
    const { auth: { showSignUpConfirmationModal }} = nextProps
    if (!showSignUpConfirmationModal && this.props.auth.showSignUpConfirmationModal) {
      this.setState(initialState)
    }
  }

  render() {
    const { auth: {
      showSignUpConfirmationModal,
      isAuthenticating,
      signUpError,
      signUpErrorMessage
    }} = this.props
    return (
      <KeyboardAvoidingView style={styles.container}>
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
            onChangeText={this.onChangeText}
          />
          <Input
            placeholder="Phone Number"
            type='phone_number'
            keyboardType='numeric'
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
          title='Sign Up'
          onPress={this.signUp.bind(this)}
          isLoading={isAuthenticating}
        />
        <Text style={[styles.errorMessage, signUpError && { color: 'black' }]}>Error logging in. Please try again.</Text>
        <Text style={[styles.errorMessage, signUpError && { color: 'black' }]}>{signUpErrorMessage}</Text>
        {
          showSignUpConfirmationModal && (
            <Modal>
              <View style={styles.modal}>
                <Input
                  placeholder="Authorization Code"
                  type='authCode'
                  keyboardType='numeric'
                  onChangeText={this.onChangeText}
                  value={this.state.authCode}
                  keyboardType='numeric'
                />
                <Button
                  title='Confirm'
                  onPress={this.confirm.bind(this)}
                  isLoading={isAuthenticating}
                />
              </View>
            </Modal>
          )
        }
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
})

const mapDispatchToProps = {
  dispatchConfirmUser: (firstname, authCode) => confirmUserSignUp(firstname, authCode),
  dispatchCreateUser: (firstname, password, email, phone) => createUser(firstname, password, email, phone)
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
