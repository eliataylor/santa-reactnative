import * as React from "react";
import { Image, StyleSheet, SafeAreaView, Text, View, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { withNavigation } from 'react-navigation';
import Button from "../components/Button";
import FormTextInput from "../components/FormTextInput";
import colors from "../config/colors";
import strings from "../config/strings";
import { connect } from 'react-redux';
import API from '../utils/API';
import { checkVerificationCode } from '../redux/authActions';
import styles from '../theme';
const logo = require("../assets/images/logo.png");


interface State {
  verificationCode: string;
  verificationHelp: string;
}

class VerifyUser extends React.Component<{}, State> {

  readonly state: State = {
    verificationCode: '', verificationHelp: ''
  };

  handleVerificationCode = (code: string) => {
    code = code.trim();
    this.setState({ verificationCode: code });
  };

  checkCode = () => {
    if (this.state.verificationCode.length < 8) {
        this.setState({verificationHelp:strings.VERIFICATION_REQUIRED});
        return false;
    }
    var uid = null;
    if (this.props.navigation && this.props.navigation.state.params) {
      uid = this.props.navigation.state.params.uid;
    }
    return this.props.checkVerificationCode(this.state.verificationCode, uid);
  };

  componentDidMount() {
    if (this.state.verificationCode === '') {
      if (this.props.navigation && this.props.navigation.state.params) {
        const { code, uid } = this.props.navigation.state.params;
        console.log('test code from link', this.props.navigation.state.params);
        this.props.checkVerificationCode(code, uid);
        this.setState({verificationCode:code});
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.auth.me && this.props.auth.me.isVerified === true) {
      this.props.navigation.navigate('HomeScreen');
    }
  }

  resendLink() {
    if (!this.props.auth.me) {
      Alert.alert('Enter your email where to send the link');
      return this.props.navigation.navigate('SignIn');
    }
    API.Post('/api/loginlink', {email:this.props.auth.me.email})
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
    const {verificationCode, verificationHelp} = this.state;

    return (
      <View style={[styles.container, {height:'100%', paddingVertical:20}]} >
        { (this.props.auth.loading === true) ? <View style={styles.loading}><ActivityIndicator size='large'/></View> : null }

        <Image source={logo} style={[styles.logo, {height:250}]} resizeMode="contain" />

        <View style={styles.form}>
          <View style={{width:'100%'}}>
            <Text style={styles.header} >Enter the verification code</Text>
            <Text style={styles.header} >sent to your email</Text>
          </View>
          <FormTextInput
            value={verificationCode}
            autoCorrect={false}
            onChangeText={this.handleVerificationCode}
            placeholder={strings.VERIFICATION_HELP}
            error={verificationHelp}
          />
          <Button
            label={strings.SUBMIT}
            onPress={(e) => this.checkCode()}
            disabled={!verificationCode}
          />
        </View>

        <TouchableOpacity onPress={(e) => this.resendLink()} style={{marginTop:40}} >
          <Text>Resend Link</Text>
        </TouchableOpacity>

      </View>
    );
  }
}


const mapDispatchToProps = {
  checkVerificationCode: (code, uid) => checkVerificationCode(code, uid)
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(VerifyUser))
