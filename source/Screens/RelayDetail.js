import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Vibration,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {colors} from '../constants/ColorsPallets';
import {globalPath} from '../constants/globalpaths';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {getApiUrl} from '../constants/apiConfig';
import {useNavigation} from '@react-navigation/native';
import {RefreshControl} from 'react-native-gesture-handler';
import {isReanimated3} from 'react-native-reanimated';

let deviceWidth = Dimensions.get('window').width;

const RelayDetail = ({route}) => {
  //Navigation constant
  const navigation = useNavigation();
  const textInputRef = useRef(null);

  // Data from Navigation
  const relayData = route.params;

  // Switch states
  const [r1, setR1] = useState({
    name: route.params.relayData.name1,
    status: route.params.relayData.r1 === 'On' ? true : false,
  });
  const [r2, setR2] = useState({
    name: route.params.relayData.name2,
    status: route.params.relayData.r2 === 'On' ? true : false,
  });
  const [r3, setR3] = useState({
    name: route.params.relayData.name3,
    status: route.params.relayData.r3 === 'On' ? true : false,
  });
  const [r4, setR4] = useState({
    name: route.params.relayData.name4,
    status: route.params.relayData.r4 === 'On' ? true : false,
  });
  const [r1Name, setR1Name] = useState(route.params.relayData.name1);
  const [r2Name, setR2Name] = useState(route.params.relayData.name2);
  const [r3Name, setR3Name] = useState(route.params.relayData.name3);
  const [r4Name, setR4Name] = useState(route.params.relayData.name4);
  const [buttonloader, setbuttonloader] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [apiData, setApiData] = useState([]);

  // year month and time states
  const [formattedDate, setFormattedDate] = useState('');
  const [year, setYear] = useState('');
  const [time, setTime] = useState('');

  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const getCurrentDate = () => {
      const apiDate = relayData.relayData.updated;
      const currentDate = new Date(apiDate);
      console.log('qwerty', currentDate);
      // Format: Tue, Jan 26
      const formattedDateString = currentDate.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });

      // Format: 2024
      const yearString = currentDate.getFullYear().toString();

      // Format: 9:50pm
      const timeString = currentDate.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });

      // Update states
      setFormattedDate(formattedDateString);
      setYear(yearString);
      setTime(timeString);
      console.log('qwerty', timeString);
    };

    getCurrentDate();
  }, []);

  // Put Api UseEffect
  useEffect(() => {
    putData();
    console.log(route.params.relayData);
  }, [r1, r2, r3, r4]);

  useEffect(() => {
    console.log('Current TExt', currentText);
  }, [currentText, r1Name, r2Name, r3Name, r4Name]);

  const toggleModal = relayName => {
    switch (relayName) {
      case 'r1':
        setR1Name(r1Name);
        console.log(r1Name);
        textInputRef.current = 'r1'; // Set the relay name for TextInput
        break;
      case 'r2':
        setR2Name(r2Name);
        textInputRef.current = 'r2'; // Set the relay name for TextInput
        break;
      case 'r3':
        setR3Name(r3Name);
        textInputRef.current = 'r3'; // Set the relay name for TextInput
        break;
      case 'r4':
        setR4Name(r4Name);
        textInputRef.current = 'r4'; // Set the relay name for TextInput
        break;
      default:
        break;
    }

    setModalVisible(!modalVisible);
  };

  // Toggle the status of the relay
  const handlePress = relayName => {
    switch (relayName) {
      case 'r1':
        setR1(prevState => ({
          ...prevState,
          status: !prevState.status,
          name: '1',
        }));
        break;
      case 'r2':
        setR2(prevState => ({
          ...prevState,
          status: !prevState.status,
          name: '2',
        }));
        break;
      case 'r3':
        setR3(prevState => ({
          ...prevState,
          status: !prevState.status,
          name: '3',
        }));
        break;
      case 'r4':
        setR4(prevState => ({
          ...prevState,
          status: !prevState.status,
          name: '4',
        }));
        break;
      default:
        break;
    }
  };
  const putNameData = async () => {
    try {
      const apiUrlRelay = getApiUrl('Relay', undefined, undefined);
      const id = relayData.relayData.id;
      const finalUrl = apiUrlRelay + id + '/';

      console.log(' PUT API IS ', currentText);

      const updatedData = {
        id: id,

        name1: textInputRef.current === 'r1' ? currentText : r1Name,
        name2: textInputRef.current === 'r2' ? currentText : r2Name,
        name3: textInputRef.current === 'r3' ? currentText : r3Name,
        name4: textInputRef.current === 'r4' ? currentText : r4Name,
        name: relayData.relayData.name,
      };
      console.log(
        'aserty==============================================>',
        r3Name,
      );

      const response = await fetch(finalUrl, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      console.log(
        'updated==============================================>',
        updatedData,
      );

      if (response.ok) {
        if (textInputRef.current === 'r1') {
          setR1Name(currentText);
        } else if (textInputRef.current === 'r2') {
          setR2Name(currentText);
        } else if (textInputRef.current === 'r3') {
          setR3Name(currentText);
        } else if (textInputRef.current === 'r4') {
          setR4Name(currentText);
        }
        setbuttonloader(false);
        console.log('Success', 'Values updated successfully');
        setRefreshing(false);
      } else {
        console.log('Error', 'Failed to update values');
        Alert.alert('Something went wrong');
        setRefreshing(false);
        setbuttonloader(false);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Something went wrong');
      setRefreshing(false);
    }
  };
  // Put Api Function
  // Put Api Function
  const putData = async (relayName, isButtonPress = false) => {
    try {
      const apiUrlRelay = getApiUrl('Relay', undefined, undefined);
      const id = relayData.relayData.id;
      const finalUrl = apiUrlRelay + id + '/';
      console.log(finalUrl);
      const updatedData = {
        id: id,
        r1: r1.status === true ? 'On' : 'Off',
        r2: r2.status === true ? 'On' : 'Off',
        r3: r3.status === true ? 'On' : 'Off',
        r4: r4.status === true ? 'On' : 'Off',

        name: relayData.relayData.name,
      };

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
        handlePress(relayName);
        setRefreshing(false);
        if (isButtonPress) {
          Vibration.vibrate();
        }
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

  const handleRefresh = () => {
    setRefreshing(true);

    // Fetch data here, for example:
    putData();
    putNameData();
  };
  const handleModalSubmit = async () => {
    setbuttonloader(true);

    // await changetext();
    await putNameData(); // Call the API when the submit button is pressed
    toggleModal(); // Close the modal after submitting
  };

  // const changetext = async () =>{
  //   console.log(" TEXT REFE " , textInputRef.current)
  //   if(textInputRef.current === 'r1'){
  //     setR1Name(currentText);
  //   }
  //   else if(textInputRef.current === 'r2'){
  //     setR2Name(currentText);
  //   }
  //   else if(textInputRef.current === 'r3'){
  //     setR3Name(currentText);
  //   }
  //   else if(textInputRef.current === 'r4'){
  //     setR4Name(currentText);
  //   }
  // }
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.headerMainView}>
          <TouchableOpacity
            style={styles.backBtnView}
            onPress={() => navigation.goBack()}>
            <Image style={styles.backBtnImgView} source={globalPath.Back} />
          </TouchableOpacity>
          <View style={styles.headerTextView}>
            <Text style={styles.headerText}>{relayData.relayData.name}</Text>
          </View>
          <View style={styles.backBtnView}>
            <Image style={styles.backBtnImgView} />
          </View>
        </View>

        <View style={styles.section1}>
          <View style={styles.timeView}>
            <Image style={styles.clockImg} source={globalPath.Clock} />
            <Text style={styles.timeText}>{time}</Text>
          </View>
          <View
            style={{
              flexDirection: 'column',
              paddingHorizontal: responsiveWidth(2),
            }}>
            <Text
              style={{
                color: colors.dark_green,
                fontWeight: '500',
                fontSize: responsiveFontSize(1.4),
              }}>
              {year}
            </Text>
            <Text style={styles.timeText}>{formattedDate}</Text>
          </View>
        </View>

        <View style={styles.mainView}>
          <View style={styles.cardView}>
            <View style={styles.onOffMainView}>
              <View style={styles.onOffView}>
                <Text
                  style={[
                    styles.onOffText,
                    {
                      color: r1.status ? colors.dark_green : colors.zinc,
                    },
                  ]}>
                  On
                </Text>
                <Text style={styles.onOffText}>/</Text>
                <Text
                  style={[
                    styles.onOffText,
                    {
                      color: r1.status ? colors.zinc : colors.dark_green,
                    },
                  ]}>
                  Off
                </Text>
              </View>
            </View>
            <View style={styles.imageView}>
              <TouchableOpacity onPress={() => putData('r1', true)}>
                <Image
                  style={styles.Image}
                  source={
                    r1.status ? globalPath.Switch_Green : globalPath.Switch_Grey
                  }
                />
              </TouchableOpacity>
            </View>
            <View style={styles.relayNameView}>
              <View style={styles.relayNameTextView}>
                <Text style={styles.relayNameText} numberOfLines={1}>
                  {r1Name}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.touchableOpacity}
                onPress={() => {
                  toggleModal('r1');
                  textInputRef.current = 'r1'; // Set the relay name for TextInput
                }}>
                <Image style={styles.editImg} source={globalPath.Edit} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.cardView}>
            <View style={styles.onOffMainView}>
              <View style={styles.onOffView}>
                <Text
                  style={[
                    styles.onOffText,
                    {
                      color: r2.status ? colors.dark_green : colors.zinc,
                    },
                  ]}>
                  On
                </Text>
                <Text style={styles.onOffText}>/</Text>
                <Text
                  style={[
                    styles.onOffText,
                    {
                      color: r2.status ? colors.zinc : colors.dark_green,
                    },
                  ]}>
                  Off
                </Text>
              </View>
            </View>
            <View style={styles.imageView}>
              <TouchableOpacity onPress={() => putData('r2', true)}>
                <Image
                  style={styles.Image}
                  source={
                    r2.status ? globalPath.Switch_Green : globalPath.Switch_Grey
                  }
                />
              </TouchableOpacity>
            </View>
            <View style={styles.relayNameView}>
              <View style={styles.relayNameTextView}>
                <Text
                  style={styles.relayNameText}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {r2Name}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.touchableOpacity}
                onPress={() => {
                  toggleModal('r2');
                  textInputRef.current = 'r2'; // Set the relay name for TextInput
                }}>
                <Image style={styles.editImg} source={globalPath.Edit} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.mainView}>
          <View style={styles.cardView}>
            <View style={styles.onOffMainView}>
              <View style={styles.onOffView}>
                <Text
                  style={[
                    styles.onOffText,
                    {
                      color: r3.status ? colors.dark_green : colors.zinc,
                    },
                  ]}>
                  On
                </Text>
                <Text style={styles.onOffText}>/</Text>
                <Text
                  style={[
                    styles.onOffText,
                    {
                      color: r3.status ? colors.zinc : colors.dark_green,
                    },
                  ]}>
                  Off
                </Text>
              </View>
            </View>
            <View style={styles.imageView}>
              <TouchableOpacity onPress={() => putData('r3', true)}>
                <Image
                  style={styles.Image}
                  source={
                    r3.status ? globalPath.Switch_Green : globalPath.Switch_Grey
                  }
                />
              </TouchableOpacity>
            </View>
            <View style={styles.relayNameView}>
              <View style={styles.relayNameTextView}>
                <Text
                  style={styles.relayNameText}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {r3Name}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.touchableOpacity}
                onPress={() => {
                  toggleModal('r3');
                  textInputRef.current = 'r3'; // Set the relay name for TextInput
                }}>
                <Image style={styles.editImg} source={globalPath.Edit} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.cardView}>
            <View style={styles.onOffMainView}>
              <View style={styles.onOffView}>
                <Text
                  style={[
                    styles.onOffText,
                    {
                      color: r4.status ? colors.dark_green : colors.zinc,
                    },
                  ]}>
                  On
                </Text>
                <Text style={styles.onOffText}>/</Text>
                <Text
                  style={[
                    styles.onOffText,
                    {
                      color: r4.status ? colors.zinc : colors.dark_green,
                    },
                  ]}>
                  Off
                </Text>
              </View>
            </View>
            <View style={styles.imageView}>
              <TouchableOpacity onPress={() => putData('r4', true)}>
                <Image
                  style={styles.Image}
                  source={
                    r4.status ? globalPath.Switch_Green : globalPath.Switch_Grey
                  }
                />
              </TouchableOpacity>
            </View>
            <View style={styles.relayNameView}>
              <View style={styles.relayNameTextView}>
                <Text
                  style={styles.relayNameText}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {r4Name}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.touchableOpacity}
                onPress={() => {
                  toggleModal('r4');
                  textInputRef.current = 'r4'; // Set the relay name for TextInput
                }}>
                <Image style={styles.editImg} source={globalPath.Edit} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modal */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          {/* Modal content */}
          <View style={styles.modalView}>
            <View style={styles.modalContent}>
              {/* Close button */}
              <View style={styles.modalHeader}>
                <Image style={styles.modalCloseBtn} />
                {/* View to align with clock image */}
                <View style={styles.modalTextHeaderView}>
                  <Text style={styles.modalHeaderText}>Update Name</Text>
                </View>
                <TouchableOpacity onPress={() => toggleModal()}>
                  <Image
                    style={styles.modalCloseBtn}
                    source={globalPath.Cross}
                  />
                </TouchableOpacity>
              </View>
              {/* TextInput */}
              <TextInput
                style={styles.modalTextInput}
                onChangeText={text => {
                  setCurrentText(text);

                  // switch (textInputRef.current) {
                  //   case 'r1':
                  //     setR1Name(text);
                  //     break;
                  //   case 'r2':
                  //     setR2Name(text);
                  //     break;
                  //   case 'r3':
                  //     setR3Name(text);
                  //     break;
                  //   case 'r4':
                  //     setR4Name(text);
                  //     break;
                  //   default:
                  //     break;
                  // }
                }}>
                {textInputRef.current === 'r1'
                  ? r1Name
                  : textInputRef.current === 'r2'
                  ? r2Name
                  : textInputRef.current === 'r3'
                  ? r3Name
                  : r4Name}
              </TextInput>
              {/* Submit Button */}
              <View style={styles.submitMainView}>
                <TouchableOpacity
                  onPress={handleModalSubmit}
                  style={styles.submitBtn}>
                  {buttonloader ? (
                    <Text style={styles.submitBtnText}>Loading ...</Text>
                  ) : (
                    <Text style={styles.submitBtnText}>Submit</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerMainView: {
    height: responsiveHeight(3),
    marginHorizontal: responsiveWidth(3),
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: responsiveHeight(2),
  },
  backBtnView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtnImgView: {
    height: responsiveHeight(3),
    width: responsiveHeight(3),
    tintColor: colors.dark_green,
  },
  headerTextView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: colors.dark_green,
  },
  timeView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    color: colors.dark_green,
    fontWeight: '700',
    fontSize: responsiveFontSize(1.8),
  },

  mainView: {
    height: responsiveHeight(30),
    flexDirection: 'row',
    // backgroundColor: "red",
    marginTop: responsiveHeight(2),
  },
  cardView: {
    height: responsiveHeight(28),
    width: (deviceWidth - responsiveWidth(2) * 4) / 2,
    borderWidth: 1,
    borderColor: colors.zinc,
    justifyContent: 'space-between',
    marginHorizontal: responsiveWidth(2),
    // marginTop: responsiveHeight(2),
    borderRadius: responsiveHeight(2),
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dateView: {
    height: responsiveHeight(5),
    borderWidth: 1,
    borderColor: colors.zinc,
    marginTop: responsiveHeight(2),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: responsiveWidth(2),
  },
  dateText: {
    color: colors.dark_green,
    fontSize: responsiveFontSize(1.5),
    fontWeight: 'bold',
  },
  touchableOpacity: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: responsiveWidth(1),
  },
  onOffMainView: {
    height: responsiveHeight(5),
    marginHorizontal: responsiveWidth(3),
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  onOffView: {
    height: responsiveHeight(3.5),
    flexDirection: 'row',
    width: responsiveWidth(15),
    backgroundColor: colors.light_zinc,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: responsiveHeight(1),
  },
  onOffText: {
    fontSize: responsiveFontSize(1.8),
    color: colors.zinc,
  },
  imageView: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  Image: {
    height: responsiveHeight(12),
    width: responsiveHeight(12),
  },
  relayNameView: {
    height: responsiveHeight(5),
    backgroundColor: colors.light_zinc,
    // borderRadius: responsiveHeight(2),
    borderBottomStartRadius: responsiveHeight(2),
    borderBottomEndRadius: responsiveHeight(2),
    flexDirection: 'row',
  },
  relayNameText: {
    fontSize: responsiveFontSize(2),
    fontWeight: '600',
    paddingHorizontal: responsiveWidth(2),
    color: colors.dark_green,
    borderColor: '#a9a9a9',

    textAlign: 'center',

    paddingHorizontal: responsiveWidth(2),
    paddingVertical: 5,
  },
  section1: {
    height: deviceWidth > 500 ? hp(7) : hp(5.5),
    width: wp(94),
    backgroundColor: colors.light_zinc,
    borderRadius: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(2),
    display: 'flex',
    borderWidth: 1,
    borderColor: colors.zinc,
    // paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    top: responsiveWidth(1.5),
    alignItems: 'center',
    marginTop: responsiveHeight(1),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    // backgroundColor:"red"
  },
  clockImg: {
    height: responsiveHeight(2),
    width: responsiveHeight(2),
    marginRight: responsiveWidth(2),
    tintColor: colors.dark_green,
  },
  relayNameTextView: {
    flex: 1,
    justifyContent: 'center',
  },
  editImg: {
    height: responsiveHeight(2),
    width: responsiveHeight(2),
  },

  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: responsiveHeight(2),
    width: responsiveWidth(90),
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: responsiveHeight(2),
  },
  modalTextHeaderView: {
    height: responsiveHeight(4),
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeaderText: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    color: colors.dark_green,
  },
  modalCloseBtn: {
    height: responsiveHeight(4),
    width: responsiveHeight(4),
    marginRight: responsiveWidth(3),
  },
  modalTextInput: {
    height: responsiveHeight(5),
    marginHorizontal: responsiveWidth(5),
    marginTop: responsiveHeight(2),
    borderWidth: 1,
    paddingHorizontal: responsiveWidth(4),
    borderRadius: responsiveHeight(1),
    borderColor: colors.zinc,
    color: colors.dark_green,
    fontSize: responsiveFontSize(2),
    fontWeight: '400',
  },
  submitMainView: {
    marginVertical: responsiveHeight(2),
    alignItems: 'center',
    justifyContent: 'center',
    height: responsiveHeight(4),
  },
  submitBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: responsiveHeight(4),
    backgroundColor: colors.light_zinc,
    paddingHorizontal: responsiveWidth(4),
    borderRadius: 10,
  },
  submitBtnText: {
    fontSize: responsiveFontSize(2),
    fontWeight: '500',
    color: colors.dark_green,
  },
});

export default RelayDetail;
