import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {colors} from '../constants/ColorsPallets';
import {globalPath} from '../constants/globalpaths';
import {Auth} from 'aws-amplify';

const CustomDrawer = props => {
  const navigation = useNavigation();

  const logout = () => {
    console.log('click');
    Alert.alert('Logout', 'Confirm Logout', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          // SetshowWarning(false);
          storeData();
          await Auth.signOut();
          navigation.replace('splash');
        },
      },
    ]);
  };

  const storeData = async () => {
    console.log('storing data');

    try {
      await AsyncStorage.setItem('@username', '');
      await AsyncStorage.setItem('@password', '');

      // getData();
    } catch (e) {
      console.log('error in storing data');
    }
  };

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <View style={styles.logoView}>
          <Image style={styles.logoImageView} source={globalPath.logo}></Image>
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: '#fff',
            marginTop: responsiveHeight(5),
          }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={styles.logoutBtnView}>
        <Image
          style={{height: responsiveHeight(3), width: responsiveHeight(3)}}
          source={globalPath.LogOut}
        />
        {/* <Ionicons name="exit-outline" size={22} /> */}
        <TouchableOpacity onPress={logout}>
          <Text
            style={{
              marginHorizontal: responsiveHeight(2),
              fontSize: responsiveHeight(1.7),
              color: colors.dark_green,
            }}>
            Log Out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  logoutBtnView: {
    flexDirection: 'row',
    marginLeft: responsiveHeight(5),
    paddingBottom: responsiveHeight(5),

    alignItems: 'center',
  },

  crossView: {
    height: responsiveHeight(3),
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  crossImgView: {
    height: responsiveHeight(3.5),
    width: responsiveHeight(3.5),
    marginRight: responsiveWidth(3),
    borderRadius: responsiveHeight(3.5) / 2,
  },
  logoView: {
    height: responsiveHeight(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImageView: {
    height: responsiveHeight(10),
    width: responsiveHeight(10),
   
   
  },
});
