import React from 'react'
import { Image, StyleSheet } from 'react-native'
import { createBottomTabNavigator, createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';

import { colors } from '../theme';
import SignIn from './SignIn';
import SignUp from './SignUp';
import VerifyUser from './VerifyUser';
import HomeScreen from './HomeScreen';
import Wishes from './Wishes';
import CreateWish from './CreateWish';
import strings from "../config/strings";

const styles = StyleSheet.create({
  icon: {
    width: 26,
    height: 26
  }
})

const visitorRoutes = {
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

const visitorRouteConfig = {
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

const LoginOrRegister = createBottomTabNavigator(visitorRoutes, visitorRouteConfig);

const AppNavigator = createSwitchNavigator({
  Visitor: LoginOrRegister,
  HomeScreen : {
    screen: HomeScreen
  },
  Wishes: {
    screen: Wishes,
    path:'/wishes',
    navigationOptions: {
      title: 'Fulfills Wishes'
    }
  },
  CreateWish: {
    screen: CreateWish,
    path:'/create-a-wish',
    navigationOptions: {
      title: 'Create A Wish'
    }
  },
  VerifyUser : {
    screen: VerifyUser
  }
});

export default createAppContainer(AppNavigator);
