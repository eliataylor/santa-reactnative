import * as React from "react";
import { connect } from 'react-redux';
import { Image, StyleSheet, KeyboardAvoidingView, Alert, View } from "react-native";
import Button from "../components/Button";
import FormTextInput from "../components/FormTextInput";
import VerifyUser from "./VerifyUser";
import logo from "../assets/images/logo.png";
import colors from "../config/colors";
import strings from "../config/strings";
import API from "../utils/API";
import { authenticate } from '../redux/authActions'

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
    email = email.toLowerCase().trim();
    this.setState({ email: email });
  };

  handlePasswordChange = (password: string) => {
    password = password.trim();
    this.setState({ password: password });
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
      var data = {grant_type:'password', password:this.state.password};
      if (this.state.phone) data.phone = this.state.phone;
      else data.email = this.state.email;  // either work on front end (backend still doesn't send sms verification codes though)
      this.props.authenticate(data);
    }
  };

  resendLink() {
    API.Post('/api/loginlink', {email:this.state.email})
    .then(res => {
      console.log('loginlink', res.data);
      Alert.alert('Check your email', 'and click your login link');
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
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding" >
        <Image source={logo} style={styles.logo} />
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
          <Button
            label={strings.SIGNIN}
            onPress={this.handleLoginPress}
            disabled={email.indexOf("@") < 2 || password.length < 4}
          />
        </View>
        <Button
          label={'Email Login Link'}
          style={{backgroundColor:colors.LIGHT_GREY, color:colors.SILVER}}
          onPress={(e) => this.resendLink()}
          disabled={email.indexOf('@') < 2}
        />
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    alignItems: "center",
    justifyContent: "space-between"
  },
  logo: {
    flex: 1,
    width: "100%",
    resizeMode: "contain",
    alignSelf: "center"
  },
  form: {
    flex: 1,
    justifyContent: "center",
    width: "80%"
  },
  errorMessage: {
    fontSize: 12,
    color: 'red',
  },
});


const mapDispatchToProps = {
  authenticate: (username, password) => authenticate(username, password)
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)
