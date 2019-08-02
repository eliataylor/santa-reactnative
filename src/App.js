import React from 'react';
import { StatusBar } from 'react-native';

import { connect } from 'react-redux';
import API from './utils/API';

import LoginOrRegister from './screens/LoginOrRegister';
import { Text } from 'react-native';

class App extends React.Component {
  state = {
    me: false,
    isLoading: true
  }
  async componentDidMount() {
    StatusBar.setHidden(true);
    var tokens = await API.getLocalTokens();
    if (!tokens) {
        return this.setState({ isLoading: false });
    }
    console.warn(tokens);
    API.Get('/api/users/me')
    .then(res => {
      this.setState({ user, isLoading: false })
      return user;
    })
    .catch (err => {
      this.setState({ isLoading: false })
      return Promise.reject(err);
    })
  }

  render() {
    if (this.state.isLoading) return null
    if (this.state.me) {
      if (this.state.me.offers && this.state.me.offers.length > 0) {
        return (
          <Text>Show my pending offer to cancel or fullfil</Text>
        );
      }
      return (
        <Text>Show nearby wishes</Text>
      )
    }
    return (<LoginOrRegister />);
  }
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps)(App)