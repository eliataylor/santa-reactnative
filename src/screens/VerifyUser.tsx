import * as React from "react";
import { Image, StyleSheet, ScrollView, Dimensions, Text, View, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
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
const { height } = Dimensions.get('window');

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
    if (this.props.navigation && this.props.navigation.state.params) {
      const { email } = this.props.navigation.state.params;
      return this.props.checkVerificationCode(this.state.verificationCode, null, email);
    } else {
      Alert.alert("You actually have to click the link for now");
    }
  };

  componentDidMount() {
    if (this.props.auth.me && this.props.auth.me.isVerified === true) {
      this.props.navigation.navigate('HomeScreen'); // reopened from link after already logged in
    } else if (this.props.navigation && this.props.navigation.state.params) {
      const { code, uid, email } = this.props.navigation.state.params;
      if (code && (uid || email)) {
        this.setState({verificationCode:code});
        console.log('test code from link', this.props.navigation.state.params);
        this.props.checkVerificationCode(code, uid, null);
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.auth.me && this.props.auth.me.isVerified === true) {
      this.props.navigation.navigate('HomeScreen');
    } else if (this.props.navigation && this.props.navigation.state.params) {
      const { code, uid, email } = this.props.navigation.state.params;
      if (code && (uid || email)) {
        if (!prevProps.navigation || !prevProps.navigation.state.params || code !== prevProps.navigation.state.params.code) {
          this.setState({verificationCode:code});
          console.log('test code from link', this.props.navigation.state.params);
          this.props.checkVerificationCode(code, uid, null);
        }
      }
    }
  }

  resendLink() {
    var email = false;
    if (this.props.auth && this.props.auth.me) {
      email = this.props.auth.me.email;
    } else if (this.props.navigation && this.props.navigation.state.params) {
      email = this.props.navigation.state.params.email;
    }

    if (!email) {
      Alert.alert('Enter your email where to send the link');
      return this.props.navigation.navigate('SignIn');
    }

    API.Post('/api/loginlink', {email:email})
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
      <ScrollView style={{height:height, backgroundColor:colors.ALMOST_WHITE}}>
      <View style={[styles.container]} >

        <Image source={logo} style={[styles.logo, {height:250}]} resizeMode="contain" />

        <View style={styles.form}>
          { (this.props.auth.loading === true) ?
            <View style={styles.loading}><ActivityIndicator size='large'/></View>
            :
            <View style={{width:'100%'}}>
              <Text style={styles.header} >Enter the verification code</Text>
              <Text style={styles.header} >sent to your email</Text>
            </View>
          }
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
      </ScrollView>
    );
  }
}


const mapDispatchToProps = {
  checkVerificationCode: (code, uid, email) => checkVerificationCode(code, uid, email)
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(VerifyUser))
