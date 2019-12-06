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
import WishDetail from './WishDetail';
import AuthLoading from './AuthLoading';

import Config from '../Config';
import { Image } from "react-native";

const navigationConfig = {
  initialRouteName: 'SignIn',
  headerMode: 'float',
  defaultNavigationOptions: {
    headerStyle: { backgroundColor:colors.ALMOST_WHITE },
    cardStyle: { backgroundColor:colors.ALMOST_WHITE },
    headerTitleStyle: { color:colors.SOFT_RED },
    headerBackTitle : 'Go Back',
    headerBackImage: (style) => (<Image
          style={{tintColor:colors.SOFT_RED}}
          accessibilityLabel={'Go Back'}
          source={require('../assets/images/baseline_undo_black_18dp.png')}  />)
  }
}

const AuthStack = createStackNavigator({
  SignIn: {
    screen: SignIn,
    path:'signin',
    navigationOptions: {
      header:null,
      headerShown:false,
    }
  },
  SignUp: {
    screen: SignUp,
    path:'signup',
    navigationOptions: {
      header:null,
      headerShown:false,
    }
  }
}, navigationConfig)


navigationConfig.initialRouteName = 'HomeScreen';
const AppStack = createStackNavigator({
  HomeScreen : {
    screen: HomeScreen,
    path:'home',
    navigationOptions: {
      header:null,
      headerShown:false,
    }
  },
  VerifyUser : {
    screen: VerifyUser,
    path: Config.api.base + '/api/users/:uid/verify/:code',
    navigationOptions: {
      header:null,
      headerShown:false,
    }
  },
  Wishes: {
    screen: Wishes,
    path:'wishes',
    navigationOptions: {
      title : 'Santa Fulfills',
      headerBackTitle : 'Santa Fulfills',
    }
  },
  WishDetail: {
    screen: WishDetail,
    path:'wishes/:wish',
    navigationOptions: (navi) => {
      console.log(navi);
      return {
        title : 'Wish Details',
        headerBackTitle : 'Wish Details',
      }
    }
  },
  CreateWish: {
    screen: CreateWish,
    path:'wishes/add',
    navigationOptions: {
      title : 'Enter a Wish',
      headerBackTitle : 'Enter a Wish',
    }
  }
}, navigationConfig);

navigationConfig.initialRouteName = 'AuthLoading';
export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading:{
        screen: AuthLoading,
        path: Config.api.base + '/api/users/:uid/verify/:code',
        navigationOptions: (navi) => {
          console.log("AUTHLOADING NAVI", navi);
          return {
            title : 'Loading...',
          }
        }
      },
      App: AppStack,
      Auth: AuthStack,
    },navigationConfig
  )
);
