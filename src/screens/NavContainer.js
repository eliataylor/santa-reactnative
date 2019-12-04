import React from 'react'
import { createBottomTabNavigator, createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';

import colors from '../config/colors';
import SignIn from './SignIn';
import SignUp from './SignUp';
import VerifyUser from './VerifyUser';
import HomeScreen from './HomeScreen';
import Wishes from './Wishes';
import CreateWish from './CreateWish';
import strings from "../config/strings";

const AppNavigator = createSwitchNavigator({
  SignIn: SignIn,
  SignUp: SignUp,
  HomeScreen : HomeScreen,
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
