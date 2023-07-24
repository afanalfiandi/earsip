import * as React from 'react';
import { View, BackHandler, StyleSheet, Text, Image, StatusBar, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFonts } from 'expo-font';
import { MenuProvider } from 'react-native-popup-menu';
import { navigationRef } from './function/navigationRef';

import SplashScreen from './page/SplashScreen';
import Auth from './page/Auth';
import Home from './page/Home';
import Intro from './page/Intro';
import Wajib from './page/Wajib';
import Pribadi from './page/Pribadi';
import Profile from './page/Profile';
import { colors } from './component/colors';
const App = () => {
  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("./assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("./assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Medium": require("./assets/fonts/Poppins-Medium.ttf"),
    "Aldrich-Regular": require("./assets/fonts/Aldrich-Regular.ttf"),
    "OdibeeSans-Regular": require("./assets/fonts/OdibeeSans-Regular.ttf"),
    "Quantico-Bold": require("./assets/fonts/Quantico-Bold.ttf"),
    "Poppins-LightItalic": require("./assets/fonts/Poppins-LightItalic.ttf"),
  });
  if (!fontsLoaded) {
    return null;
  }
  const Tab = createBottomTabNavigator();
  return (
    <NavigationContainer ref={navigationRef}>
      <MenuProvider>
        <StatusBar
          animated={true}
          backgroundColor={colors.light}
          barStyle='dark-content'
        />
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarHideOnKeyboard: true,
            tabBarShowLabel: false,
            tabBarStyle: {
              backgroundColor: colors.red,
              elevation: 0,
              height:55
            },
          }}
          initialRouteName='SplashScreen'>
          <Tab.Screen
            name="SplashScreen"
            component={SplashScreen}
            options={{ tabBarStyle: { display: 'none' }, tabBarButton: () => null }}
          />
          <Tab.Screen
            name="Intro"
            component={Intro}
            options={{ tabBarStyle: { display: 'none' }, tabBarButton: () => null }}
          />
          <Tab.Screen
            name="Auth"
            component={Auth}
            ref={navigationRef}
            options={{ tabBarStyle: { display: 'none' }, tabBarButton: () => null }}
          />
          <Tab.Screen
            name="Home"
            component={Home}
            options={{
              headerShown: false,
              headerTransparent: true,
              title: " Home",
              tabBarIcon: ({ focused }) => {
                return (
                  <View style={[styles.buttonicon, { opacity: focused ? 1 : 0.5 }]}>
                    <Image
                      source={
                        focused
                          ? require("./assets/img/home-white.png")
                          : require("./assets/img/home-white.png")
                      }
                      resizeMode="contain"
                      style={{
                        alignItems: "center",
                        width: 25,
                        height: 25,
                        tintColor: focused ? "#FFFFFF" : "#B2B6C1",
                      }}
                    />
                  </View>
                );
              },
            }}
          />
          <Tab.Screen
            name="Wajib"
            component={Wajib}
            options={{
              headerShown: false,
              headerTransparent: true,
              title: " Wajib",
              tabBarIcon: ({ focused }) => {
                return (
                  <View style={[styles.buttonicon, { opacity: focused ? 1 : 0.5 }]}>
                    <Image
                      source={
                        focused
                          ? require("./assets/img/file-white.png")
                          : require("./assets/img/file-white.png")
                      }
                      resizeMode="contain"
                      style={{
                        alignItems: "center",
                        width: 25,
                        height: 25,
                        tintColor: focused ? "#FFFFFF" : "#B2B6C1",
                      }}
                    />
                  </View>
                );
              },
            }}
          />
          <Tab.Screen
            name="Pribadi"
            component={Pribadi}
            options={{
              headerShown: false,
              headerTransparent: true,
              title: " Pribadi",
              tabBarIcon: ({ focused }) => {
                return (
                  <View style={[styles.buttonicon, { opacity: focused ? 1 : 0.5 }]}>
                    <Image
                      source={
                        focused
                          ? require("./assets/img/bag-white.png")
                          : require("./assets/img/bag-white.png")
                      }
                      resizeMode="contain"
                      style={{
                        alignItems: "center",
                        width: 25,
                        height: 25,
                        tintColor: focused ? "#FFFFFF" : "#B2B6C1",
                      }}
                    />
                  </View>
                );
              },
            }}
          />
          <Tab.Screen
            name="Profile"
            component={Profile}
            options={{
              headerShown: false,
              headerTransparent: true,
              title: " Profile",
              tabBarIcon: ({ focused }) => {
                return (
                  <View style={[styles.buttonicon, { opacity: focused ? 1 : 0.5 }]}>
                    <Image
                      source={
                        focused
                          ? require("./assets/img/person-white.png")
                          : require("./assets/img/person-white.png")
                      }
                      resizeMode="contain"
                      style={{
                        alignItems: "center",
                        width: 25,
                        height: 25,
                        tintColor: focused ? "#FFFFFF" : "#B2B6C1",
                      }}
                    />
                  </View>
                );
              },
            }}
          />
        </Tab.Navigator>
      </MenuProvider>
    </NavigationContainer>
  )
}

export default App
const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#7F5DF0",
    shadowOffset: {
      width: 50,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  buttonicon: {
    alignItems: "center",
  },
});