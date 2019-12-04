import React, { Component } from 'react';
import {
  Platform,
  Text,
  Alert,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image
} from 'react-native';

import { connect } from 'react-redux'
const logo = require('../assets/images/logo.png');
import strings from "../config/strings";
import colors from '../config/colors'
import { createUser } from '../redux/authActions'

import FormTextInput from '../components/FormTextInput'
import Button from '../components/Button'
import styles from "../theme";

interface State {
  firstname: string;
  password: string;
  email: string;
  phone: string;
}

class SignUp extends React.Component<{}, State> {
  readonly state: State = {
    firstname: '',
    password: '',
    email: '',
    phone: ''
  };

  signUp() {
    const { firstname, password, email, phone } = this.state;
    if (email.indexOf("@") < 3) {
      return Alert.alert("Invalid Form", 'Only an email address is required');
    }
    this.props.createUser(firstname, password, email, phone)
  }

  render() {
    return (
      <View
        style={styles.container}
      >
        { (this.props.auth.loading === true) ? <View style={styles.loading}><ActivityIndicator size='large'/></View> : null }
        <Image
          source={logo}
          style={styles.logo}
        />
        <View style={styles.form} >
          <FormTextInput
            value={this.state.email}
            placeholder="Email"
            type='email'
            keyboardType='email-address'
            onChangeText={(text) => this.setState({email:text.toLowerCase().trim()})}
          />
          <FormTextInput
            value={this.state.firstname}
            placeholder="Optional Name"
            type='firstname'
            onChangeText={(text) => this.setState({firstname:text.trim()})}
          />
          <FormTextInput
            placeholder="Optional Cellular"
            type='phone_number'
            keyboardType='phone-pad'
            onChangeText={(text) => this.setState({phone:text.trim()})}
          />
          <FormTextInput
            value={this.state.password}
            placeholder="Optional Password"
            secureTextEntry
            type='password'
            onChangeText={(text) => this.setState({password:text.trim()})}
          />

          <View style={styles.row}>
              <Button
                label={strings.SIGNIN}
                style={{backgroundColor:colors.LIGHT_GREY, color:colors.SILVER, width:'50%'}}
                onPress={e => this.props.navigation.navigate('SignIn')}
              />
              <Button
                label={strings.SIGNUP}
                style={{backgroundColor:colors.LIGHT_GREEN, color:colors.WHITE, width:'50%'}}
                onPress={this.signUp.bind(this)}
              />
          </View>
        </View>
      </View>
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
