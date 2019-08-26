import React from 'react';
import { connect } from 'react-redux';
import { StatusBar, Text, Alert, SafeAreaView, TouchableOpacity } from 'react-native';
import LoginOrRegister from './screens/LoginOrRegister';
import Snackbar from 'react-native-snackbar';
import RoleSelection from './screens/RoleSelection';
import {checkToken} from './redux/authActions';
import API from './utils/API';
import NotifService from './utils/NotifService';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.notif = new NotifService(this.onRegister.bind(this), this.onNotif.bind(this), '629412147035');
    this.state = {permissions:false}
  }

  async componentDidMount() {
    StatusBar.setHidden(true);
    console.log('APP DID MOUNT');
    var tokens = await API.getLocalTokens();
    console.log(tokens);
    if (tokens) {
      this.props.checkToken();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.permissions !== false && this.props.auth.me && this.props.auth.me.isVerified === true) {
      this.notif.checkPermission(this.handlePerm.bind(this));
    }
    return true;
  }

  componentDidUpdate(prevProps) {
    if (this.state.permissions !== false && this.props.auth.me && this.props.auth.me.isVerified === true) {
      this.notif.checkPermission(this.handlePerm.bind(this));
    }
  }

  onRegister(token) {
    console.log('DEVICE TOKEN REGISTERED', token);
    this.setState({ registerToken: token.token, gcmRegistered: true });
    API.Post('/api/users/:id/devicetoken', {deviceToken:token.token})
    .then(res => {
      console.log('stored device token', res.data);
      return res.data
    })
    .catch(err => {
      var msg = API.getErrorMsg(err);
      console.log('error logging in: ', msg)
      return err;
    });
  }

  onNotif(notif) {
    console.log(notif);
    Alert.alert(notif.title, notif.message);
  }

  handlePerm(perms) {
    this.setState({permissions:perms});
    Alert.alert("Permissions", JSON.stringify(perms));
  }

  render() {
    /* if (true) {
      return (<SafeAreaView style={{paddingHorizontal:50, paddingVertical:40}}>
          <TouchableOpacity onPress={() => { this.notif.localNotif() }}><Text>Local Notification (now)</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => { this.notif.scheduleNotif() }}><Text>Schedule Notification in 30s</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => { this.notif.cancelNotif() }}><Text>Cancel last notification (if any)</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => { this.notif.cancelAll() }}><Text>Cancel all notifications</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => { this.notif.checkPermission(this.handlePerm.bind(this)) }}><Text>Check Permission</Text></TouchableOpacity>
        </SafeAreaView>)
    } */

    if (this.props.auth.me) {
      if (this.props.lists.error) {
        Snackbar.show({
          title : this.props.lists.error,
          duration : Snackbar.LENGTH_LONG,
          backgroundColor	: 'red',
          color : 'white'
        });
      }
      return <RoleSelection auth={this.props.auth} />;
    }

    var errors = [this.props.auth.logInError, this.props.auth.signUpError, this.props.auth.verifyError];
    for(var e in errors) {
      if (errors[e]) {
        Snackbar.show({
          title : errors[e],
          duration : Snackbar.LENGTH_LONG,
          backgroundColor	: 'red',
          color : 'white'
        });
      }
    }
    return <LoginOrRegister />;
  }
}

const mapDispatchToProps = {
  checkToken: () => checkToken()
}

const mapStateToProps = state => ({
  auth: state.auth,
  lists:state.lists
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
