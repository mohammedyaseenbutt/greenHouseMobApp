import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
} from 'react-native';
import React from 'react';
import Background from '../components/Background';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {colors} from '../constants/ColorsPallets';
import {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {ScrollView} from 'react-native-gesture-handler';

import {globalPath} from '../constants/globalpaths';
import {useEffect} from 'react';
import {signIn} from 'aws-amplify/auth';
import {Auth} from 'aws-amplify';

const ChangePassword = ({navigation, route}) => {
  const user = route.params;

  console.log(' USER DATA IN CHANGE PASSWORD SCREEN ', user);

  const [Password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [errorString, seterrorString] = useState('');
  const [Loading, setLoading] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(prevState => !prevState);
  };

  const Validation = async item => {
    console.log('ErrorMessage: ', errorString);
    seterrorString('');
    setLoading(true);
    const {requiredAttributes} = user.challengeParam; // the array of required attributes, e.g ['email', 'phone_number']
    Auth.completeNewPassword(
      user, // the Cognito User Object
      Password, // the new password
    )
      .then(user => {
        // at this time the user is logged in if no MFA required
        setLoading(false);

        navigation.replace('login');
        console.log(user, 'user');
      })
      .catch(e => {
        setLoading(false);

        seterrorString(e.message);
        console.log(e);
      });
  };

  const storeData = async () => {
    console.log('storing data');

    try {
      await AsyncStorage.setItem('@username', Email);
      await AsyncStorage.setItem('@password', Password);

      // getData();
    } catch (e) {
      console.log('error in storing data');
    }
  };

  //   const submit = async () => {
  //     if (Email == '') {
  //       Alert.alert('Email  can not be empty');
  //       seterrorSting('Email  can not be empty');
  //       return false;
  //     } else if (Password == '') {
  //       Alert.alert('Password can not be empty');

  //       seterrorSting('Password can not be empty');
  //       return false;
  //     }
  //     try {
  //       const response = await Auth.signIn(Email, Password);
  //       console.log(' AUTH RESPONSE IS ', response);
  //       if (response.challengeName === 'NEW_PASSWORD_REQUIRED') {
  //         navigation.navigate('Drawer');
  //       }
  //     } catch (error) {
  //       console.log('error', error.message);
  //     }
  //   };

  return (
    <Background>
      <SafeAreaView>
        <ScrollView>
          <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            style={styles.SafeAreaView}>
            <StatusBar
              barStyle={'dark-content'}
              backgroundColor={'white'}
              translucent={false}></StatusBar>
            <View style={styles.imageview}>
              <Image style={styles.imagestyle} source={globalPath.logo} />
            </View>
            <Text style={styles.headtextstyle}>Change Password</Text>
            {/* <Text style={styles.textstyle}>
              Stay signed in with your account to {'\n'}
            </Text> */}
            {/* <Text style={styles.lowtextstyle}>make searching easier.</Text> */}

            {/* <View style={{marginTop: responsiveWidth(10)}}>
              <Text style={styles.emailtext}>Username</Text>
              <TextInput
                style={styles.TextInput}
                placeholder="Enter your username"
                placeholderTextColor={colors.zinc}
                keyboardType="email-address"
                onChangeText={e => setEmail(e)}
              />
              <Text style={styles.emailtext}>Password</Text>
            </View> */}
            <View
              style={{
                flexDirection: 'row',
                left: responsiveWidth(8),
                // backgroundColor: 'pink',
                alignItems: 'center',
                // marginHorizontal: 10,
              }}>
              <TextInput
                style={[styles.TextInput]}
                placeholder="Enter your password"
                placeholderTextColor={colors.zinc}
                keyboardType="default"
                secureTextEntry={!showPassword}
                onChangeText={e => setPassword(e)}
              />
              <TouchableOpacity
                onPress={toggleShowPassword}
                style={styles.eyeIconContainer}>
                <Image
                  style={styles.eyeIcon}
                  resizeMode="contain"
                  source={
                    showPassword
                      ? globalPath.open_eye // Replace with your eye-open image source
                      : globalPath.eye // Replace with your eye-closed image source
                  }
                />
              </TouchableOpacity>
            </View>

            {/* <View style={styles.checkboxview}> */}
            {/* <TouchableOpacity
              onPress={() => setCheck(!Check)}
              style={styles.checkbox}>
              {Check ? (
                <Image
                  style={styles.checkboximage}
                  resizeMode="contain"
                  source={require('../Assets/check-mark.png')}
                />
              ) : null}
            </TouchableOpacity>
            <Text style={styles.signintext}>Keep me signed in</Text> */}

            {/* </View> */}
            <TouchableOpacity
              // onPress={() => navigation.navigate('Drawer')}
              onPress={Validation}>
              <LinearGradient
                colors={[colors.light_green, colors.dark_green]} // Specify your gradient colors
                style={styles.button}
                start={{x: 0.2, y: 0}}
                end={{x: 1, y: 0}}>
                <Text style={{color: 'white'}}>Change Passowrd </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              // onPress={() => navigation.navigate('Drawer')}
              onPress={() => navigation.goBack()}>
              <LinearGradient
                colors={[colors.light_green, colors.dark_green]} // Specify your gradient colors
                style={styles.button}
                start={{x: 0.2, y: 0}}
                end={{x: 1, y: 0}}>
                <Text style={{color: 'white'}}>Back to Login</Text>
              </LinearGradient>
            </TouchableOpacity>
            {/* <View style={styles.borderContainer}>
            <View style={styles.border} />
            <Text style={styles.textBetweenBorders}>Or continue with</Text>
            <View style={styles.border} />
          </View> */}

            <View style={styles.lastview}>
              <Text style={{bottom: responsiveHeight(1)}}>Powered By</Text>
              <TouchableOpacity>
                <Image style={styles.stampa} source={globalPath.stampalogo2} />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaView>
    </Background>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  SafeAreaView: {
    flex: 1,
  },
  imageview: {
    // backgroundColor: 'pink',
    justifyContent: 'center',
  },
  imagestyle: {
    width: responsiveWidth(22),
    height: responsiveWidth(22),
    // backgroundColor: 'red',
    // justifyContent: 'center',
    alignSelf: 'center',
    marginTop: responsiveHeight(5),
    marginBottom: responsiveWidth(6),
  },
  headtextstyle: {
    alignSelf: 'center',
    color: colors.dark_green,
    fontSize: 26,
  },
  textstyle: {
    alignSelf: 'center',
    marginTop: responsiveWidth(5),
    color: colors.dark_blue,
  },
  lowtextstyle: {
    alignSelf: 'center',
    bottom: responsiveWidth(4),
    color: colors.dark_blue,
  },
  TextInput: {
    borderBottomColor: colors.light_green,
    borderBottomWidth: 1.2,
    paddingVertical: responsiveWidth(1),
    alignSelf: 'center',
    width: '84%',
    marginBottom: responsiveWidth(5),
    // backgroundColor: 'red',
  },
  emailtext: {
    marginLeft: responsiveWidth(8.8),
    color: colors.dark_green,
  },
  checkboximage: {
    height: responsiveWidth(3.6),
    width: responsiveWidth(3.6),
    tintColor: colors.dark_green,
  },
  checkbox: {
    // width: 16,
    height: responsiveWidth(4.5),
    width: responsiveWidth(4.5),
    // alignItems: 'center',
    // justifyContent: 'center',
    // height: 16,
    // backgroundColor: '#dbd3d3',
    borderRadius: 3,
    // padding: 2,
    // marginLeft: 30,
    borderWidth: 1.2,
    borderColor: colors.light_green,
    // marginBottom: 70,
    // marginRight: responsiveWidth(2),
    top: responsiveWidth(0.5),
  },
  checkboxview: {
    flexDirection: 'row',
    // backgroundColor: 'red',
    marginLeft: responsiveWidth(8.5),
    width: responsiveWidth(83),
    justifyContent: 'space-around',
  },
  Passwordtext: {
    // justifyContent: 'flex-end',
    color: colors.dark_green,
    // backgroundColor: 'red',
    // alignItems: 'flex-end',
  },
  signintext: {
    color: colors.zinc,
    // right: responsiveWidth(4),
  },
  button: {
    alignItems: 'center',
    // backgroundColor: colors.light_green,
    padding: responsiveWidth(4),
    width: responsiveWidth(82),
    alignSelf: 'center',
    marginTop: responsiveWidth(10),
    borderRadius: responsiveWidth(3),
  },
  borderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: responsiveWidth(7),
    alignSelf: 'center',
    // backgroundColor: 'red',
  },
  border: {
    // flex: 1,
    height: 1.2,
    backgroundColor: colors.dark_green,
    width: '20%',
    justifyContent: 'center',
    // alignSelf: 'center',
    // marginStart: responsiveWidth(9),
  },
  textBetweenBorders: {
    marginHorizontal: responsiveWidth(3.5),
    color: colors.dark_green,
  },
  forgotpassview: {
    flex: 1,
    alignItems: 'flex-end',
    // width: responsiveWidth(85),
    marginHorizontal: responsiveHeight(4),
    // backgroundColor: 'red',
  },
  lastview: {
    // height:hp
    // backgroundColor: 'red',
    // flex: 1,
    height: hp(25),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    // backgroundColor: 'red',
    paddingVertical: responsiveWidth(2), // Add padding if needed
    alignItems: 'flex-end',
    paddingBottom: 30,
  },
  stampa: {
    width: responsiveWidth(20),
    height: responsiveWidth(8.5),
    marginLeft: responsiveWidth(2),
  },
  gradient: {
    borderRadius: responsiveWidth(10),
    overflow: 'hidden',
  },
  eyeIconContainer: {
    marginLeft: responsiveWidth(2),
    // alignSelf: 'center',
  },
  eyeIcon: {
    height: responsiveWidth(5.2),
    width: responsiveWidth(5.2),
    tintColor: colors.dark_green,
    // alignSelf: 'center',
    right: responsiveHeight(5),
    bottom: responsiveHeight(1),
    // backgroundColor: 'red',
  },
});
