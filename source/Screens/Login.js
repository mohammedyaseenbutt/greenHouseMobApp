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
  ActivityIndicator,
  Dimensions,
  Linking,
} from 'react-native';
import React from 'react';
import Background from '../components/Background';
import {
  responsiveFontSize,
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
import {useNavigation} from '@react-navigation/native';
import {globalPath} from '../constants/globalpaths';
import {useEffect} from 'react';
import {signIn} from 'aws-amplify/auth';
import {Auth} from 'aws-amplify';
import AsyncStorage from '@react-native-async-storage/async-storage';

let deviceWidth = Dimensions.get('window').width;

const screenHeight = Dimensions.get('window').height;
const Login = ({}) => {
  const navigation = useNavigation();

  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [Check, setCheck] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorSting, seterrorSting] = useState('');
  const [loader, setLoader] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isScrollEnabled, setScrollEnabled] = useState(false);
  // useEffect(() => {
  //   const keyboardDidShowListener = Keyboard.addListener(
  //     'keyboardDidShow',
  //     () => {
  //       setKeyboardVisible(true);
  //     },
  //   );

  //   return () => {
  //     keyboardDidShowListener.remove();
  //   };
  // }, []);
  const handleScroll = () => {
    setScrollEnabled(true);
  };

  const keyboardDidHide = () => {
    setScrollEnabled(false);
  };
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      handleScroll,
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      keyboardDidHide,
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  const toggleShowPassword = () => {
    setShowPassword(prevState => !prevState);
  };

  const getData = async () => {
    console.log('getting data');
    try {
      const emailId = await AsyncStorage.getItem('@username');
      const emailPassword = await AsyncStorage.getItem('@password');
      setlocalEmail(emailId);
      setlocalpasseword(emailPassword);
      // console.log('localEmail', emailId);
      // console.log('localPassword', emailPassword);
    } catch (e) {
      console.log(' credential error', e);
    }
  };

  const submit = async () => {
    if (Email == '') {
      // Alert.alert('Username  can not be empty');
      seterrorSting('Username  can not be empty');
      return false;
    } else if (Password == '') {
      // Alert.alert('Password can not be empty');

      seterrorSting('Password can not be empty');
      return false;
    }
    try {
      setLoader(true);
      const response = await Auth.signIn(Email, Password);
      console.log(' AUTH RESPONSE IS ', response);
      if (response.challengeName === 'NEW_PASSWORD_REQUIRED') {
        console.log(' RUN IN THE IF BLOCK');
        setLoader(false);
        navigation.replace('changePassword', response);
      } else {
        storeData();
        setLoader(false);
        navigation.replace('Drawer');
      }
    } catch (error) {
      setLoader(false);

      if (error.message.toString() == 'Incorrect username or password.') {
        seterrorSting('Incorrect Password');
      } else {
        seterrorSting(error.message.toString());
      }
      console.log('error', error.message);
    }
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

  const StampaLink = () => {
    const url = 'https://stampasolutions.com/'; // Replace with your desired URL
    Linking.openURL(url);
  };

  return ( 
    <Background>
      <SafeAreaView style={{flex: 1}}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          style={{flex: 1}}>
          <ScrollView
            scrollEnabled={isScrollEnabled}
            keyboardShouldPersistTaps="handled"
            // onScroll={handleScroll}
            contentContainerStyle={{
              flexGrow: 1,
              height: deviceWidth > 500 ? responsiveHeight(85) : responsiveHeight(78)
              // height: Platform.OS ===  'ios'  ? responsiveHeight(80) : responsiveHeight(80),
            }}>
            <StatusBar
              barStyle={'dark-content'}
              backgroundColor={'white'}
              translucent={false}></StatusBar>
            <View style={styles.imageview}>
              <Image style={styles.imagestyle} source={globalPath.logo} />
            </View>
            <Text style={styles.headtextstyle}>Welcome Back !</Text>
            <Text style={styles.textstyle}>
              Stay signed in with your account to {'\n'}
            </Text>
            <Text style={styles.lowtextstyle}>make searching easier.</Text>
            {errorSting ? (
              <Text
                style={{
                  alignSelf: 'center',
                  margin: 8,
                  bottom: responsiveWidth(4),
                  fontWeight: 'bold',
                  fontSize: responsiveFontSize(1.5),
                  color: colors.red,
                }}>
                {errorSting}
              </Text>
            ) : (
              <Text></Text>
            )}

            <View
              style={{
                marginTop:
                  deviceWidth > 500 ? responsiveHeight(1) : responsiveHeight(4),
              }}>
              <Text style={styles.emailtext}>Username</Text>
              <TextInput
                style={[styles.TextInput,{fontSize: responsiveFontSize(1.8)}]}
                placeholder="Enter your username"
                placeholderTextColor={colors.zinc}
                keyboardType="email-address"
                onChangeText={e => setEmail(e)}
              />
            </View>

            
            <Text style={styles.emailtext}>Password</Text>

            <View
              style={styles.passview}>
              <TextInput
                style={{fontSize: responsiveFontSize(1.8),color:"black", flex:1, height: responsiveHeight(5)}}
                placeholder="Enter your password"
                placeholderTextColor={colors.zinc}
                keyboardType="default"
                secureTextEntry={!showPassword}
                onChangeText={e => setPassword(e)}
              />
              <TouchableOpacity onPress={toggleShowPassword}>
                <Image
                  style={{
                    height: responsiveHeight(3),
                    width: responsiveHeight(3),
                  }}
                  resizeMode="contain"
                  source={
                    showPassword
                      ? globalPath.open_eye // Replace with your eye-open image source
                      : globalPath.eye // Replace with your eye-closed image source
                  }></Image>
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
            {/* <View style={styles.forgotpassview}>
              <TouchableOpacity>
                <Text
                  style={{
                    fontSize: responsiveFontSize(2),
                    color: colors.dark_green,
                  }}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View> */}

            {/* </View> */}

            <TouchableOpacity
              // onPress={() => navigation.navigate('Drawer')}
              onPress={loader ? null : submit}
              >
              <LinearGradient
                colors={[colors.light_green, colors.dark_green]} // Specify your gradient colors
                style={styles.button}
                start={{x: 0.2, y: 0}}
                end={{x: 1, y: 0}}>
                {loader ? (
                  <ActivityIndicator color="#dbd3d3" />
                ) : (
                  <Text
                    style={{
                      color: 'white',
                      fontSize:
                        deviceWidth > 500 ? responsiveFontSize(1.5) : undefined,
                    }}>
                    Sign In
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* <View style={styles.borderContainer}>
          <View style={styles.border} />
          <Text style={styles.textBetweenBorders}>Or continue with</Text>
          <View style={styles.border} />
        </View> */}

            <View style={styles.lastview}>
              <Text style={{color: 'black', bottom: responsiveHeight(1)}}>
                Powered By
              </Text>
              <TouchableOpacity onPress={StampaLink}>
                <Image style={styles.stampa} source={globalPath.stampalogo2} />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Background>
  );
};

export default Login;

const styles = StyleSheet.create({
  SafeAreaView: {},
  imageview: {
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: deviceWidth > 500 ? responsiveFontSize(2) : responsiveFontSize(3),
  },
  textstyle: {
    alignSelf: 'center',
    fontSize:
      deviceWidth > 500 ? responsiveFontSize(1.7) : responsiveFontSize(2),
    marginTop: responsiveWidth(5),
    color: colors.dark_blue,
  },
  lowtextstyle: {
    alignSelf: 'center',
    fontSize:
      deviceWidth > 500 ? responsiveFontSize(1.7) : responsiveFontSize(2),
    bottom: responsiveWidth(4),
    color: colors.dark_blue,
  },

  emailtext: {
    fontSize:
      deviceWidth > 500 ? responsiveFontSize(1.5) : responsiveFontSize(2),
    marginLeft: responsiveWidth(8.8),
    marginBottom: responsiveHeight(1.5),
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
    width: deviceWidth > 500 ? responsiveWidth(80) : responsiveWidth(82),
    alignSelf: 'center',
    marginTop: deviceWidth > 500 ? responsiveHeight(5) : responsiveHeight(5),
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

  lastview: {
    marginTop: deviceWidth > 500 ? responsiveHeight(1) : responsiveHeight(7),
    height: Platform.OS === 'ios' || deviceWidth > 500 ? hp(25) : hp(20),
    flexDirection: 'column',
    justifyContent: 'center', // Align at the bottom
    alignItems: 'center', // Center horizontally

    flexDirection: 'row',
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
    marginBottom: deviceWidth > 500 ? 20 : undefined,
    backgroundColor: 'red',
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
  passview:{
    flexDirection: 'row',
    width: '84%',
    alignItems: 'center',
    borderBottomColor: colors.light_green,
    borderBottomWidth: 1,
    justifyContent: 'space-between',
    fontSize: responsiveFontSize(1.8),
    alignSelf: 'center',
    // backgroundColor:'pink',
    height:responsiveHeight(5)
    
  },
  TextInput: {
    borderBottomColor: colors.light_green,
    color: 'black',
    borderBottomWidth: 1,
    paddingVertical: responsiveWidth(1),
    alignSelf: 'center',
    width: '84%',
    marginBottom: responsiveWidth(5),
    fontSize:
      deviceWidth > 500 ? responsiveFontSize(1.5) : responsiveFontSize(2),
      // backgroundColor:'red',
    height:responsiveHeight(5)

  },
});
