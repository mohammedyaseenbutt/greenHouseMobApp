import {View, Text, Image} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Login from '../Screens/Login';
import Splash from '../Screens/Splash';
import Home from '../Screens/Home';
import Trends from '../Screens/Trends';
import Profile from '../Screens/Profile';
import {colors} from '../constants/ColorsPallets';
import CustomDrawer from './CustomDrawer';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import {globalPath} from '../constants/globalpaths';
import changePassword from '../Screens/ChangePassword';
import Relays from '../Screens/Relays';
import RelayDetail from '../Screens/RelayDetail';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="splash"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="splash" component={Splash} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="changePassword" component={changePassword} />
      <Stack.Screen name="Drawer" component={DrawerNavigation} />
      <Stack.Screen name="RelayDetail" component={RelayDetail} />

    </Stack.Navigator>
  );
};

const DrawerNavigation = () => {
  return (
    <View style={{flex: 1, backgroundColor: '#000fff'}}>
      <Drawer.Navigator
        drawerContent={props => <CustomDrawer {...props} />}
        screenOptions={{
          headerShown: false,
          drawerActiveBackgroundColor: colors.light_green,
          drawerActiveTintColor: '#fff', // Active font color
          drawerInactiveTintColor: colors.dark_green, // Inactive font color
          drawerLabelStyle: {
            marginLeft: responsiveHeight(-2),
            fontSize: responsiveHeight(1.8),
          },
        }}>
        <Drawer.Screen
          name="Home"
          component={Home}
          options={{
            drawerIcon: ({focused}) => (
              <Image
              source={focused ? globalPath.Home_Active : globalPath.Home_Inactive}          
                style={{
                  height: responsiveHeight(3),
                  width: responsiveHeight(3),
                  marginLeft: responsiveHeight(4),
                }}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="Trends"
          component={Trends}
          options={{
            drawerIcon: ({focused}) => (
              <Image
              source={focused ? globalPath.Trends_Active : globalPath.Trends_Inactive}          
                style={{
                  height: responsiveHeight(3),
                  width: responsiveHeight(3),
                  marginLeft: responsiveHeight(4),
                  // backgroundColor: colors.red

                }}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="Relays"
          component={Relays}
          options={{
            drawerIcon: ({focused}) => (
              <Image
              source={focused ? globalPath.Relays_Active : globalPath.Relay_Inactive}          
                style={{
                  height: responsiveHeight(3),
                  width: responsiveHeight(3),
                  marginLeft: responsiveHeight(4),
                  // backgroundColor: colors.red
                }}
              />
            ),
          }}
        />
        
      </Drawer.Navigator>
    </View>
  );
};

export default AuthNavigator;
