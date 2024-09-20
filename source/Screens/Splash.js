import {StyleSheet, Text, View, Image, StatusBar, Animated} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import {Easing} from 'react-native-reanimated';
import Background from '../components/Background';
import {globalPath} from '../constants/globalpaths';
import {Auth} from 'aws-amplify';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AnimatedImage = Animated.createAnimatedComponent(Image);
const Splash = ({navigation}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    getData();
    checkUser();
  }, []);
  const getData = async () => {
    console.log('getting data in splash');
    try {
      const emailId = await AsyncStorage.getItem('@username');
      const emailPassword = await AsyncStorage.getItem('@password');
      console.log('localEmail', emailId);
      console.log('localPassword', emailPassword);
    } catch (e) {
      console.log(' credential error', e);
    }
  };
  const checkUser = async () => {
    // console.log('checking user');
    try {
      const Authuser = await Auth.currentAuthenticatedUser({
        bypassCache: true,
      });
      // console.log(Authuser, 'Authuser');
      if (Authuser) {
        console.log(' ONE ');
        navigation.replace('Drawer');
      } else {
        console.log(' 2 ');
        // permissionAlert();
        // console.log('AUthuser', Authuser);
        setTimeout(() => {
          navigation.replace('Login');
        }, 2000);
      }
    } catch (error) {
      // permissionAlert();
      setTimeout(() => {
        navigation.replace('Login');
      }, 2000);
      console.log(error, 'errorrrr');
    }
  };

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.elastic(1.2),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  return (
    <Background>
      <SafeAreaView style={styles.SafeAreaView}>
        <StatusBar
          barStyle={'dark-content'}
          backgroundColor={'white'}
          translucent={false}></StatusBar>
        <View style={styles.container}>
          <AnimatedImage
            style={[
              styles.imagestyle,
              {
                opacity: fadeAnim,
                opacity: fadeAnim,
                transform: [{scale: scaleAnim}],
              },
            ]}
            source={globalPath.logo}
          />
        </View>
      </SafeAreaView>
    </Background>
  );
};

export default Splash;

const styles = StyleSheet.create({
  SafeAreaView: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagestyle: {
    width: responsiveWidth(50),
    height: responsiveWidth(50),
  },
});
