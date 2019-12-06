import React from 'react'
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import strings from "../config/strings";
import colors from '../config/colors';
import SignIn from './SignIn';
import SignUp from './SignUp';
import VerifyUser from './VerifyUser';
import HomeScreen from './HomeScreen';
import Wishes from './Wishes';
import CreateWish from './CreateWish';
import AuthLoading from './AuthLoading';

import { Image } from "react-native";

const AuthStack = createStackNavigator({
  SignIn: {
    screen: SignIn,
    path:'/signin',
    navigationOptions: {
      header:null,
      headerShown:false,
    }
  },
  SignUp: {
    screen: SignUp,
    path:'/signup',
    navigationOptions: {
      header:null,
      headerShown:false,
    }
  }
})


const navigationConfig = {
  initialRouteName: 'HomeScreen',
  headerMode: 'float',
  defaultNavigationOptions: {
    headerStyle: { backgroundColor:colors.ALMOST_WHITE },
    headerTitleStyle: { color:colors.SOFT_RED },
    headerBackTitle : 'Go Back',
    headerBackImage: (style) => (<Image
          style={{tintColor:colors.SOFT_RED}}
          accessibilityLabel={'Go Back'}
          source={require('../assets/images/baseline_undo_black_18dp.png')}  />)
  }
}

const AppStack = createStackNavigator({
  HomeScreen : {
    screen: HomeScreen,
    path:'/home',
    navigationOptions: {
      header:null,
      headerShown:false,
    }
  },
  VerifyUser : {
    screen: VerifyUser,
    path: 'api/users/:uid/verify/:code',
    navigationOptions: {
      header:null,
      headerShown:false,
    }
  },
  Wishes: {
    screen: Wishes,
    path:'/wishes',
    navigationOptions: {
      title : 'Santa Fulfills',
      headerBackTitle : 'Santa Fulfills',
    }
  },
  CreateWish: {
    screen: CreateWish,
    path:'/create-a-wish',
    navigationOptions: {
      title : 'Enter a Wish',
      headerBackTitle : 'Enter a Wish',
    }
  }
}, navigationConfig);

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoading,
      App: AppStack,
      Auth: AuthStack,
    },
    {initialRouteName: 'AuthLoading'}
  )
);
