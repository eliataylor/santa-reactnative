import React from 'react'
import { Image, StyleSheet } from 'react-native'
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';

import { colors } from '../theme';
import SignIn from './SignIn';
import SignUp from './SignUp';
import strings from "../config/strings";

const styles = StyleSheet.create({
  icon: {
    width: 26,
    height: 26
  }
})

const routes = {
  SignIn: {
    screen: SignIn,
    navigationOptions: {
      title: strings.SIGNIN,
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={require('../assets/signInButton.png')}
          style={[styles.icon, { tintColor }]}
        />
      )
    }
  },
  SignUp: {
    screen: SignUp,
    navigationOptions: {
      title: strings.SIGNUP,
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={require('../assets/signUpButton.png')}
          style={[styles.icon, { tintColor }]}
        />
      )
    }
  }
}

const routeConfig = {
  tabBarPosition: 'bottom',
  tabBarOptions: {
    showLabel: true,
    activeTintColor: colors.primary,
    inactiveTintColor: colors.secondary,
    indicatorStyle: { backgroundColor: colors.secondary },
    labelStyle: {
      fontSize: 12
    },
    style: {
      backgroundColor: 'white',
      borderTopWidth: 0,
      paddingBottom: 3
    },
  }
}

const LoginOrRegister = createBottomTabNavigator(routes, routeConfig);
export default createAppContainer(LoginOrRegister);
