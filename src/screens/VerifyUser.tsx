import * as React from "react";
import { Image, StyleSheet, KeyboardAvoidingView, View } from "react-native";
import Button from "../components/Button";
import FormTextInput from "../components/FormTextInput";
import imageLogo from "../assets/images/logo.png";
import colors from "../config/colors";
import strings from "../config/strings";
import { connect } from 'react-redux';
import { authenticate } from '../actions'

interface State {
  verificationCode: string;
  verificationHelp: string;
}

class VerifyUser extends React.Component<{}, State> {

  readonly state: State = {
    verificationCode: '',
    verificationHelp: ''
  };

  handleVerificationCode = (code: string) => {
    this.setState({ verificationCode: code });
  };

  handleLoginPress = () => {
    if (this.state.verificationCode.length < 8) {
        this.setState({verificationHelp:strings.VERIFICATION_REQUIRED});
    } else {
      var data = {grant_type:'password', password:this.state.password};
      if (this.state.phone) data.phone = this.state.phone;
      else data.email = this.state.email;  // either work on front end (backend still doesn't send sms verification codes though)
      this.props.authenticate(data);
    }
  };

  render() {
    const {verificationCode, verificationHelp} = this.state;

    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding" >
        <Image source={imageLogo} style={styles.logo} />
        <View style={styles.form}>
          <FormTextInput
            value={email}
            autoCorrect={false}
            keyboardType='email-address'
            returnKeyType='next'
            onChangeText={this.handleVerificationCode}
            placeholder={strings.EMAIL_PLACEHOLDER}
            error={verificationHelp}
          />
          <Button
            label={strings.LOGIN}
            onPress={this.handleLoginPress}
            disabled={!email || !password}
          />
        </View>
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
  verifyUser: (username, password) => verifyUser(username, password)
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps, mapDispatchToProps)(VerifyUser)
