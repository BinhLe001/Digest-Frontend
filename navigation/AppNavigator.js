import React from "react";
import { createAppContainer, createStackNavigator } from "react-navigation";

import HomeScreen from "../screens/HomeScreen";
import CameraScreen from "../screens/CameraScreen";
import DishesScreen from "../screens/DishesScreen";
import PreferencesScreen from "../screens/PreferencesScreen";

export default createAppContainer(
  createStackNavigator({
    HomeScreen: {
      screen: HomeScreen
    },
    CameraScreen: {
      screen: CameraScreen
    },
    DishesScreen: {
      screen: DishesScreen
    },
    PreferencesScreen: {
      screen: PreferencesScreen
    }
  })
);
