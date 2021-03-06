import * as React from "react";
import { connect } from 'react-redux';
import { Image, Dimensions, StyleSheet, ScrollView, Keyboard, Alert, View, ActivityIndicator } from "react-native";
import Button from "../components/Button";
import FormTextInput from "../components/FormTextInput";
import VerifyUser from "./VerifyUser";
import logo from "../assets/images/logo.png";
import colors from "../config/colors";
import strings from "../config/strings";
import styles from "../theme";

import API from "../utils/API";
import { authenticate } from '../redux/authActions';

const { width, height } = Dimensions.get('window');

interface State {
  email: string;
  password: string;
  emailHelp: string;
  passwordHelp: string;
}

class SignIn extends React.Component<{}, State> {
  passwordInputRef = React.createRef<FormTextInput>();

  readonly state: State = {
    email: '',
    password: '',
    emailHelp:'',
    passwordHelp:''
  };

  handleEmailChange = (email: string) => {
    this.setState({ email: email.trim() });  // toLowerCase() throws odd error: https://github.com/facebook/react-native/issues/11068
  };

  handlePasswordChange = (password: string) => {
    this.setState({ password: password.trim() });
  };

  // When the "next" button is pressed, focus the password input
  handleEmailSubmitPress = () => {
    if (this.passwordInputRef.current) {
      this.passwordInputRef.current.focus();
    }
  };

  handleLoginPress = () => {
    if (this.state.email.length < 6 || this.state.email.indexOf("@") < 1) {
        this.setState({emailHelp:strings.EMAIL_REQUIRED});
    } else if (this.state.password.length < 4) {
        this.setState({passwordHelp:strings.PASSWORD_REQUIRED});
    } else {
      Keyboard.dismiss();
      var data = {grant_type:'password', password:this.state.password};
      if (this.state.phone) data.phone = this.state.phone;
      else data.email = this.state.email.toLowerCase();  // either work on front end (backend still doesn't send sms verification codes though)
      this.props.authenticate(data);
    }
  };

  componentDidUpdate(prevProps) {
    if (this.props.auth.me && this.props.auth.me.isVerified === true) {
      this.props.navigation.navigate('HomeScreen');
    } else if (this.props.auth.me && this.props.auth.me.isVerified === false) {
      this.props.navigation.navigate('VerifyUser');
    }
  }

  resendLink() {
    Keyboard.dismiss();
    const email = this.state.email;

    if (email === '') {
      return Alert.alert('Enter your email above', 'then click this again');
    } else if (email.indexOf('@') < 2) {
      return Alert.alert('Invalid email');
    }

    const that = this;
    API.Post('/api/loginlink', {email:email.toLowerCase()})
    .then(res => {
      console.log('loginlink', res.data);
      if (res.data.error) {
        Alert.alert(res.data.error);
      } else {
        that.props.navigation.navigate('VerifyUser', {email:email});
      }
      // that.setState({email:''}); // to prevent repeats
    })
    .catch(err => {
      var msg = API.getErrorMsg(err);
      console.log('error sending verification link: ', msg)
      Alert.alert('Error', error);
      return err;
    });
  }

  render() {
    if (this.props.auth.me) {
      if (this.props.auth.me.isVerified === false) {
        return <VerifyUser />;
      }
    }

    const {email, password, emailHelp, passwordHelp} = this.state;

    return (
      <ScrollView style={{height:height, backgroundColor:colors.ALMOST_WHITE}} >
      <View style={styles.container} >
        <Image
          source={logo}
          style={styles.logo}
        />
        <View style={styles.form}>
          <FormTextInput
            value={email}
            keyboardType='email-address'
            returnKeyType='next'
            onChangeText={this.handleEmailChange}
            onSubmitEditing={this.handleEmailSubmitPress}
            placeholder={strings.EMAIL_PLACEHOLDER}
            error={emailHelp}
          />
          <FormTextInput
            ref={this.passwordInputRef}
            value={password}
            onChangeText={this.handlePasswordChange}
            placeholder={strings.PASSWORD_PLACEHOLDER}
            secureTextEntry={true}
            returnKeyType="done"
            error={passwordHelp}
          />
          { (this.props.auth.loading === true) ? <View style={styles.loading}><ActivityIndicator size='large'/></View> : null }
          <View style={styles.row}>
              <Button
                label={strings.SIGNIN}
                style={{backgroundColor:colors.LIGHT_GREEN, color:colors.WHITE, width:'33%'}}
                onPress={this.handleLoginPress}
              />
              <Button
                label={'Forgot Password'}
                style={{backgroundColor:colors.LIGHT_GREY, color:colors.SOFT_RED, width:'33%'}}
                onPress={(e) => this.resendLink()}
              />
              <Button
                label={strings.SIGNUP}
                style={{backgroundColor:colors.LIGHT_GREY, color:colors.SILVER, width:'33%'}}
                onPress={e => this.props.navigation.navigate('SignUp')}
              />
          </View>
        </View>
      </View>
      </ScrollView>
    );
  }
}



const mapDispatchToProps = {
  authenticate: (username, password) => authenticate(username, password)
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)
