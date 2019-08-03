import React from 'react';
import { connect } from 'react-redux';
import { StatusBar, Text } from 'react-native';
import LoginOrRegister from './screens/LoginOrRegister';

class App extends React.Component {

  async componentDidMount() {
    StatusBar.setHidden(true);
    var tokens = await API.getLocalTokens();
    if (tokens) {
        this.props.checkToken();
    }

  }

  render() {
    if (this.props.auth.me) {
      if (this.props.auth.me.isValid === false) {
        return (<LoginOrRegister />);
      }
      if (this.props.auth.me.offers && this.props.auth.me.offers.length > 0) {
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

const mapDispatchToProps = {
  checkToken: () => checkToken()
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
