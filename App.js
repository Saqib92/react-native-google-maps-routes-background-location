/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import MapPage from "./src/MapPage";
import Details from "./src/Details";

import {
  createStackNavigator,
  createSwitchNavigator,
  createDrawerNavigator,
  createAppContainer
} from "react-navigation";


const AppNavigator = createStackNavigator({
  Map: {screen: MapPage},
  Details: {screen: Details},
});

export default createAppContainer(AppNavigator);
