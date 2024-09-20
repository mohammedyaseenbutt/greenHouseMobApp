import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ScrollView,
  Alert,
  Vibration,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {globalPath} from '../constants/globalpaths';
import {colors} from '../constants/ColorsPallets';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {getApiUrl} from '../constants/apiConfig';
import {useFocusEffect} from '@react-navigation/native';
import Lottie from 'lottie-react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RefreshControl} from 'react-native-gesture-handler';
import {namespace} from 'd3';
import {Amplify, Auth, Storage, API} from 'aws-amplify';

let deviceWidth = Dimensions.get('window').width;

const Relays = ({navigation}) => {
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Fetch data from API
    fetchData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Place your useEffect logic here
      console.log('Screen A is focused');
      fetchData();

      // Your useEffect logic here

      return () => {
        // Cleanup function (if needed)
      };
    }, []),
  );
  const handleRefresh = () => {
    setRefreshing(true);

    // Fetch data here, for example:
    fetchData();
  };
  const putData = item => {
    try {
      const apiUrlRelay = getApiUrl('Relay', undefined, undefined);
      const id = item.id;
      const finalUrl = apiUrlRelay + id + '/';
      console.log(item);

      // Define the updatedData object
      let updatedData = {
        id: item.id,
        name: item.name,
        r1: item.r1,
        r2: item.r2,
        r3: item.r3,
        r4: item.r4,
      };

      // Check the conditions for updating the relay statuses
      if (
        item.r1 === 'Off' &&
        item.r2 === 'Off' &&
        item.r3 === 'Off' &&
        item.r4 === 'Off'
      ) {
        updatedData = {
          ...updatedData,
          r1: 'On',
          r2: 'On',
          r3: 'On',
          r4: 'On',
        };
        makePutRequest(updatedData, finalUrl);
        Vibration.vibrate();
      } else if (
        item.r1 === 'On' &&
        item.r2 === 'On' &&
        item.r3 === 'On' &&
        item.r4 === 'On'
      ) {
        updatedData = {
          ...updatedData,
          r1: 'Off',
          r2: 'Off',
          r3: 'Off',
          r4: 'Off',
        };
        makePutRequest(updatedData, finalUrl);
        Vibration.vibrate(); // Vibrate after changing the button image
      } else {
        // Handle the case when neither all off nor all on
        Alert.alert(
          'Confirmation',
          'Please Select Option',
          [
            {
              text: 'On',
              onPress: () => {
                updatedData = {
                  ...updatedData,
                  r1: 'On',
                  r2: 'On',
                  r3: 'On',
                  r4: 'On',
                };
                makePutRequest(updatedData, finalUrl);
                Vibration.vibrate(); // Vibrate after changing the button image
              },
            },
            {
              text: 'Off',
              onPress: () => {
                updatedData = {
                  ...updatedData,
                  r1: 'Off',
                  r2: 'Off',
                  r3: 'Off',
                  r4: 'Off',
                };
                makePutRequest(updatedData, finalUrl);
                Vibration.vibrate(); // Vibrate after changing the button image
              },
            },
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
          ],
          {cancelable: true},
        );
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Something went wrong');
      setRefreshing(false);
    }
  };

  const makePutRequest = async (updatedData, finalUrl) => {
    try {
      const response = await fetch(finalUrl, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        console.log('Success', 'Values updated successfully');
        setRefreshing(false);
        fetchData();
      } else {
        console.log('Error', 'Failed to update values');
        Alert.alert('Something went wrong');
        setRefreshing(false);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Something went wrong');
      setRefreshing(false);
    }
  };

  const fetchData = async () => {
    try {
      const apiUrlRelay = getApiUrl('Relay', undefined, undefined);
      console.log('Apiurl with ', apiUrlRelay);
      const response = await fetch(apiUrlRelay);
      const data = await response.json();

      // Sort the data based on the id property in ascending order
      const sortedData = data.results.sort((a, b) => a.id - b.id);
      setLoading(false);
      setRefreshing(false);
      // console.log('sorted data', sortedData);
      setApiData(sortedData);
      console.log('sorted data', sortedData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setRefreshing(false);
    }
  };
  const getImageForRelay = (r1, r2, r3, r4) => {
    if (r1 === 'Off' && r2 === 'Off' && r3 === 'Off' && r4 === 'Off') {
      return globalPath.Switch_Red;
    } else if (r1 === 'On' && r2 === 'On' && r3 === 'On' && r4 === 'On') {
      return globalPath.Switch_Green;
    } else {
      return globalPath.Switch_Yellow;
    }
  };
  const handleCardPress = item => {
    // Navigate to another screen when item is pressed
    navigation.navigate('RelayDetail', {relayData: item});
  };
  const handleAlert = item => {
    let alertTitle, alertMessage;

    if (
      item.r1 === 'Off' &&
      item.r2 === 'Off' &&
      item.r3 === 'Off' &&
      item.r4 === 'Off'
    ) {
      alertTitle = 'Confirmation';
      alertMessage = 'Are you sure you want to turn On all switches?';
    } else if (
      item.r1 === 'On' &&
      item.r2 === 'On' &&
      item.r3 === 'On' &&
      item.r4 === 'On'
    ) {
      alertTitle = 'Confirmation';
      alertMessage = 'Are you sure you want to turn Off all switches?';
    } else {
      putData(item);
      return;
    }

    Alert.alert(
      alertTitle,
      alertMessage,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => putData(item),
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerMainView}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Image style={styles.imagestyle} source={globalPath.Menu} />
        </TouchableOpacity>

        <View style={styles.headerTextView}>
          <Text style={styles.headerText}>All Devices</Text>
        </View>
        <View>
          <Image style={styles.imagestyle} />
        </View>
      </View>
      {loading ? (
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
          <Lottie
            source={require('../assets/animations/loader.json')}
            style={styles.loader}
            speed={2}
            autoPlay
            loop
          />
        </View>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              bounces={false}
              alwaysBounceVertical={false}
              directionalLockEnabled={true}
              colors={[colors.light_green, colors.yellow, colors.red]} // Set your desired refresh indicator colors
            />
          }>
          <FlatList
            data={apiData}
            renderItem={({item}) => {
              console.log('aaaaaaa========>', item); // Log the item data
              return (
                <TouchableOpacity onPress={() => handleCardPress(item)}>
                  <View style={styles.cardView}>
                    <Image
                      style={[styles.Image, {justifyContent: 'flex-end'}]}
                      source={globalPath.Switch}
                    />
                    <Text style={styles.text}>{item.name}</Text>
                    <TouchableOpacity onPress={() => handleAlert(item)}>
                      <Image
                        style={[styles.Image, {justifyContent: 'flex-end'}]}
                        source={getImageForRelay(
                          item.r1,
                          item.r2,
                          item.r3,
                          item.r4,
                        )}
                      />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item, index) => index.toString()}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Relays;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardView: {
    height: responsiveHeight(8),
    marginHorizontal: responsiveWidth(7),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.zinc,
    borderRadius: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(4),
    marginVertical: responsiveHeight(1),
    backgroundColor: '#fff',
    marginTop: responsiveHeight(2),
  },
  Image: {
    height: responsiveHeight(5.5),
    width: responsiveHeight(5.5),
  },
  text: {
    flex: 1,
    marginHorizontal: responsiveWidth(4),
    fontSize: responsiveFontSize(2.5),
    fontWeight: '600',
    color: colors.dark_green,
  },
  loader: {
    width: responsiveWidth(30),
    height: responsiveHeight(30),
  },
  headerMainView: {
    height: responsiveHeight(3),
    marginHorizontal: responsiveWidth(3),
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: responsiveHeight(2),
    marginBottom: responsiveHeight(5),
  },

  headerTextView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    color: colors.dark_green,
  },
  imagestyle: {
    width: deviceWidth > 500 ? responsiveWidth(4) : responsiveWidth(6),
    height: deviceWidth > 500 ? responsiveHeight(4) : responsiveWidth(6),
    marginLeft: responsiveHeight(2),
    marginTop: responsiveHeight(0.6),
  },
});
