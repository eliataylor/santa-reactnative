import * as React from "react";
import { Image, StyleSheet, KeyboardAvoidingView, View } from "react-native";
import Button from "../components/Button";
import FormTextInput from "../components/FormTextInput";
import imageLogo from "../assets/images/logo.png";
import colors from "../config/colors";
import strings from "../config/strings";
import { connect } from 'react-redux';
import { verifyUser } from '../actions';

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
    code = code.trim();
    this.setState({ verificationCode: code });
  };

  handleLoginPress = () => {
    if (this.state.verificationCode.length < 8) {
        this.setState({verificationHelp:strings.VERIFICATION_REQUIRED});
        return false;
    }
    this.props.verifyUser(this.state.verificationCode);
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
            value={verificationCode}
            autoCorrect={false}
            returnKeyType='next'
            onChangeText={this.handleVerificationCode}
            placeholder={strings.VERIFICATION_HELP}
            error={verificationHelp}
          />
          <Button
            label={strings.SUBMIT}
            onPress={this.handleLoginPress}
            disabled={!verificationCode}
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
  verifyUser: (code) => verifyUser(code)
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps, mapDispatchToProps)(VerifyUser)
