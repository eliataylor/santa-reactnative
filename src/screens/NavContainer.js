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
// import WishDetail from './WishDetail';
import AuthLoading from './AuthLoading';

import { Image } from "react-native";

const navigationConfig = {
  initialRouteName: 'SignIn',
  headerMode: 'float',
  defaultNavigationOptions: {
    headerStyle: { backgroundColor:colors.ALMOST_WHITE },
    cardStyle: { backgroundColor:colors.ALMOST_WHITE },
    headerTitleStyle: { color:colors.SOFT_RED },
    headerBackTitleStyle: {
         color:colors.SOFT_RED
    },
//    headerBackTitle : 'Back',
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
    path: 'users/:uid/verify/:code',
    navigationOptions: {
      title : 'Account Verification',
      // headerBackTitle : 'Account Verification',
    }
  },
  Wishes: {
    screen: Wishes,
    path:'wishes',
    navigationOptions: {
      title : strings.WISHES_SECTION,
      // headerBackTitle : 'Santa Fulfills',
    }
  },
  /* ,
  WishDetail: { // only via notifications
    screen: WishDetail,
    path:'wishes/:wish',
    navigationOptions: (navi) => {
      console.log(navi);
      return {
        title : 'Wish Details',
        headerBackTitle : 'Wish Details',
      }
    }
  }, */
  CreateWish: {
    screen: CreateWish,
    path:'wishes/add',
    navigationOptions: {
      title : 'Enter a Wish',
      // headerBackTitle : 'Enter a Wish',
    }
  }
}, navigationConfig);

navigationConfig.initialRouteName = 'AuthLoading';
export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading:{
        screen: AuthLoading,
        path: 'users/:uid/verify/:code'
      },
      App: AppStack,
      Auth: AuthStack,
    },navigationConfig
  )
);
