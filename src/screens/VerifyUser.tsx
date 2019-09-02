import * as React from "react";
import { Image, StyleSheet, SafeAreaView, Text, View, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import Button from "../components/Button";
import FormTextInput from "../components/FormTextInput";
import colors from "../config/colors";
import strings from "../config/strings";
import { connect } from 'react-redux';
import API from '../utils/API';
import { checkVerificationCode } from '../redux/authActions';
const logo = require("../assets/images/logo.png");

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

  checkCode = () => {
    if (this.state.verificationCode.length < 8) {
        this.setState({verificationHelp:strings.VERIFICATION_REQUIRED});
        return false;
    }
    const { uid } = this.props.navigation.state.params;
    return this.props.checkVerificationCode(this.state.verificationCode, uid);
  };

  componentDidMount() {
    const { code, uid } = this.props.navigation.state.params;
    if (this.state.verificationCode === '') {
      console.log('test code from link', this.props.navigation.state.params);
      this.props.checkVerificationCode(code, uid);
      this.setState({verificationCode:code});
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.auth.me && this.props.auth.me.isVerified === true) {
      this.props.navigation.navigate('Visitor');
    }
  }

  resendLink() {
    if (!this.props.auth.me) {
      console.log('enter your email where to send the link'); // TODO: snackbar
      return this.props.navigation.navigate('Visitor');
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
      <SafeAreaView
        style={styles.pageContainer}
        behavior="padding" >
        { (this.props.auth.loading === true) ? <View style={styles.loading}><ActivityIndicator size='large'/></View> : null }
        <Image source={logo}
               style={styles.logo}
               resizeMode="contain" />

        <View>
          <Text style={styles.header} >Enter the verification code</Text>
          <Text style={styles.header} >sent to your email</Text>
        </View>

        <View style={styles.form}>
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

        <TouchableOpacity onPress={(e) => this.resendLink()}  >
          <Text>Resend Link</Text>
        </TouchableOpacity>

      </SafeAreaView>
    );
  }
}


const styles = StyleSheet.create({
  pageContainer: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding:10,
    height:'100%'
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
  logo: {
    width: "100%",
    maxHeight:150,
    resizeMode: "contain",
  },
  form: {
    paddingHorizontal:30
  },
  header : {
    fontWeight:'bold',
    textAlign:'center',
    fontSize:20
  }
})


const mapDispatchToProps = {
  checkVerificationCode: (code, uid) => checkVerificationCode(code, uid)
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps, mapDispatchToProps)(VerifyUser)
