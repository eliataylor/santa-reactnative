import React from 'react'
import { Image, StyleSheet } from 'react-native'
import { createStackNavigator, createAppContainer } from 'react-navigation';

import { colors } from '../theme';
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

const routes = {
  HomeScreen : {
    screen: HomeScreen
  },
  Wishes: {
    screen: Wishes,
    path:'/wishes',
    navigationOptions: {
      title: 'Santa',
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={require('../assets/signInButton.png')}
          style={[styles.icon, { tintColor }]}
        />
      )
    }
  },
  CreateWish: {
    screen: CreateWish,
    path:'/create-a-wish',
    navigationOptions: {
      title: 'Elf',
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
  mode: 'modal',
  headerMode: 'none',
  initialRouteName : 'HomeScreen'
}

const RootStack = createStackNavigator(routes, routeConfig);
export default createAppContainer(RootStack);
