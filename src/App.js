import React from 'react';
import { connect } from 'react-redux';
import { StatusBar, Text, Alert } from 'react-native';
import LoginOrRegister from './screens/LoginOrRegister';
import Snackbar from 'react-native-snackbar';
import RoleSelection from './screens/RoleSelection';
import {checkToken} from './redux/authActions';
import API from './utils/API';
import NotifService from './utils/NotifService';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.notif = new NotifService(this.onRegister.bind(this), this.onNotif.bind(this));
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

  onRegister(token) {
    console.log(token);
    Alert.alert("Registered !", JSON.stringify(token));
    //this.setState({ registerToken: token.token, gcmRegistered: true });
  }

  onNotif(notif) {
    console.log(notif);
    Alert.alert(notif.title, notif.message);
  }

  render() {

    if (true) {
      return (<View>
          <TouchableOpacity style={styles.button} onPress={() => { this.notif.localNotif() }}><Text>Local Notification (now)</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => { this.notif.scheduleNotif() }}><Text>Schedule Notification in 30s</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => { this.notif.cancelNotif() }}><Text>Cancel last notification (if any)</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => { this.notif.cancelAll() }}><Text>Cancel all notifications</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => { this.notif.checkPermission(this.handlePerm.bind(this)) }}><Text>Check Permission</Text></TouchableOpacity>
        </View>)
    }

    if (this.props.auth.me) {
      if (this.props.auth.me.isVerified === false) {
        return <LoginOrRegister />;
      }
      if (this.props.lists.error) {
        Snackbar.show({
          title : this.props.lists.error,
          duration : Snackbar.LENGTH_LONG,
          backgroundColor	: 'red',
          color : 'white'
        });
      }
      return <RoleSelection />;
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
