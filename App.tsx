import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Navigation from './source/Navigator/Navigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AuthNavigator from './source/Navigator/Navigation';
import {Amplify, Auth, API} from 'aws-amplify';
import awsconfig from './src/aws-exports';
import {LogBox} from 'react-native';
import {requestUserPermission} from './source/utils/FcmHelper';
import messaging from '@react-native-firebase/messaging';

Amplify.configure(awsconfig);


const App = () => {
  useEffect(() => {
    requestUserPermission();

    // checkToday_Job();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Navigation />
        {/* <AuthNavigator/> */}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;

LogBox.ignoreLogs(['Warning: ...']);

LogBox.ignoreAllLogs();
