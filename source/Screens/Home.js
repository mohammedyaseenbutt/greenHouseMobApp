import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {SafeAreaView} from 'react-native-safe-area-context';
import RNSpeedometer from 'react-native-speedometer';
import {LiquidGauge} from 'react-native-liquid-gauge';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {globalPath} from '../constants/globalpaths';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {colors} from '../constants/ColorsPallets';
import {set} from 'date-fns';
import {Auth} from 'aws-amplify';
import {RefreshControl} from 'react-native';
import Lottie from 'lottie-react-native';
import {color} from 'd3';
import {requestUserPermission} from '../utils/FcmHelper';

let deviceWidth = Dimensions.get('window').width;

const Home = ({navigation}) => {
  //

  //Design States:
  const [selectedButton, setSelectedButton] = useState('GH1');
  const [meterValue, setMeterValue] = useState('');
  const [greenhouseTemp, setGreenhouseTemp] = useState('');
  const [outdoorTemp, setOutdoorTemp] = useState('');
  const [nurserytemp, setNurseryTemp] = useState('');
  const [tankLevel, setTankLevel] = useState(0);
  const [currentuser, setcurrentuser] = useState('');
  const [loader, setLoader] = useState(false);
  const [outloader, setOutLoader] = useState(false);

  //refreshcontrol state:
  const [refreshing, setRefreshing] = useState(false);

  //States for showing gauge has data or not:
  const [DataForOutDoor, setDataForOutDoor] = useState(true);
  const [DataForNursery, setDataForNursery] = useState(true);
  const [DataForGreenHouse, setDataForGreenHouse] = useState(true);
  const [DataForWaterTank, setDataForWaterTank] = useState(true);

  const [outdoorDate, setOutdoordate] = useState('');
  const [outdoorTime, setOutdoorTime] = useState();
  //OutDoor States:

  const [OutdoorTempC, setOutdoorTempC] = useState(0);
  const [OutdoorHumidity, setOutdoorHumidity] = useState(0);
  const [OutdoorError, setOutdoorError] = useState(null);

  //Nursery States:
  const [nurseryTempC, setNurseryTempC] = useState(0);
  const [nurseryHumidity, setNurseryHumidity] = useState(0);
  const [nurseryError, setNurseryError] = useState(null);
  const [nurseryDate, setNurserydate] = useState('');
  const [nurseryTime, setNurseryTime] = useState();
  // GreeenHouse States:

  const [selectedGreenhouse, setSelectedGreenhouse] = useState('GH-1');
  const [tempC, setTempC] = useState(0);
  const [tempF, setTempF] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [error, setError] = useState(null);
  const [greenHouseDate, setGreenHousedate] = useState('');
  const [greenHouseTime, setGreenHouseTime] = useState();

  //WaterTank States:
  const [TankTempC, setTankTempC] = useState(0);
  const [TankDistance, setTankDistance] = useState(7);
  const [TankError, setTankError] = useState(null);
  const [tankDate, setTankDate] = useState('');
  const [tankTime, setTankTime] = useState();
  // Current Date and Time

  const [formattedDate, setFormattedDate] = useState('');
  const [year, setYear] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    requestUserPermission();

    // checkToday_Job();
  }, []);

  useEffect(() => {
    const getCurrentDate = () => {
      const currentDate = new Date();

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
    };

    getCurrentDate();

    // Update every minute
    const intervalId = setInterval(getCurrentDate, 60000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array to run only once on mount

  useEffect(() => {
    fetchOutdoorData();
    fetchNurseryData();

    fetchTankData();
  }, []);

  useEffect(() => {
    fetchGHData(selectedGreenhouse);
  }, [selectedGreenhouse]);

  //Fetch Outdoor data:

  const fetchOutdoorData = async () => {
    try {
      setOutLoader(true);
      const currentDate = new Date();
      const nextDate = new Date();
      nextDate.setDate(currentDate.getDate() + 1);

      const formattedCurrentDate = currentDate.toISOString().split('T')[0];
      const formattedNextDate = nextDate.toISOString().split('T')[0];

      const outdoorResponse = await fetch(
        `https://api.sabzorganics.com/live/?name=Outdoor-01`,
      );

      const countData = await outdoorResponse.json();
      const totalCount = countData.count;
      console.log('Count of Outdoor:', totalCount);

      const DataResponse = await fetch(
        `https://api.sabzorganics.com/live/?name=Outdoor-01&limit=${totalCount}`,
      );

      const OutdoorData = await DataResponse.json();

      console.log('Outdoor DATA:', OutdoorData.results.length);
      const lengthOutDoor = OutdoorData.results.length;
      if (lengthOutDoor > 0) {
        setDataForOutDoor(true);
        const mostRecentData = OutdoorData.results[0]; // Get the first item directly

        console.log('Most Recent Data of outdoor', mostRecentData);

        // const tempCValue =  NaN;
        const tempCValue = parseFloat(mostRecentData.temp_c);
        const humidityValue = parseFloat(mostRecentData.humidity);
        // const humidityValue = NaN;

        const timestamp = new Date(mostRecentData.timestamp);
        const day = timestamp.getDate();
        const month = timestamp.getMonth() + 1; // Months are zero-based
        const year = timestamp.getFullYear();
        const outdoorDate = `${day}/${month}/${year}`;

        // const outdoorDate = timestamp.toLocaleDateString(); // Extract date
        const hours = timestamp.getHours();
        const minutes = timestamp.getMinutes().toString().padStart(2, '0'); // Pad minutes with leading zero if necessary
        const period = hours >= 12 ? 'pm' : 'am';
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
        const outdoorFormattedTime = `${formattedHours}:${minutes} ${period}`;
        console.log('temp_c:', tempCValue);
        console.log('humidity:', humidityValue);

        setOutdoorTempC(tempCValue);
        setOutdoorHumidity(humidityValue);
        setOutdoordate(outdoorDate);
        setOutdoorTime(outdoorFormattedTime);
        setOutdoorError(null);
        setOutLoader(false);
      } else {
        setOutLoader(false);
        setDataForOutDoor(false);
        setOutdoorError('Temperature data not found for the Outdoor.');
      }
    } catch (error) {
      setOutLoader(false);
      setDataForOutDoor(false);
      setOutdoorError(`Error fetching data for the Outdoor: ${error.message}`);
    }
  };

  // Fetch Nursery Data:

  const fetchNurseryData = async () => {
    try {
      setOutLoader(true);
      setDataForNursery(true);
      const currentDate = new Date();
      const nextDate = new Date();
      nextDate.setDate(currentDate.getDate() + 1);

      const formattedCurrentDate = currentDate.toISOString().split('T')[0];
      const formattedNextDate = nextDate.toISOString().split('T')[0];

      const nurseryResponse = await fetch(
        `https://api.sabzorganics.com/live/?name=Nursery-01`,
      );

      const countData = await nurseryResponse.json();
      const totalCount = countData.count;
      console.log('Count of Nursery:', totalCount);

      const DataResponse = await fetch(
        `https://api.sabzorganics.com/live/?name=Nursery-01&limit=${totalCount}`,
      );

      const NurseryData = await DataResponse.json();
      console.log('Nursery DATA:', NurseryData.results.length);

      if (NurseryData.results.length > 0) {
        const mostRecentData = NurseryData.results[0]; // Get the first item directly

        console.log('Most Recent Data of nursery', mostRecentData);

        const tempCValue = parseFloat(mostRecentData.temp_c);
        // const tempCValue=NaN
        const humidityValue = parseFloat(mostRecentData.humidity);

        const timestamp = new Date(mostRecentData.timestamp);
        const day = timestamp.getDate();
        const month = timestamp.getMonth() + 1; // Months are zero-based
        const year = timestamp.getFullYear();
        const nurseryDate = `${day}/${month}/${year}`;
        // const nurseryDate = timestamp.toLocaleDateString(); // Extract date
        const hours = timestamp.getHours();
        const minutes = timestamp.getMinutes().toString().padStart(2, '0'); // Pad minutes with leading zero if necessary
        const period = hours >= 12 ? 'pm' : 'am';
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
        const nurseryFormattedTime = `${formattedHours}:${minutes} ${period}`;
        console.log('temp_c:', tempCValue);
        console.log('humidity:', humidityValue);

        setNurseryTempC(tempCValue);
        console.log('nurseryTempc', tempCValue);
        setNurseryHumidity(humidityValue);
        setNurserydate(nurseryDate), setNurseryTime(nurseryFormattedTime);
        setNurseryError(null);
        setOutLoader(false);
      } else {
        setOutLoader(false);
        setDataForNursery(false);
        setNurseryError('Temperature data not found for the nursery.');
      }
    } catch (error) {
      setOutLoader(false);
      setDataForNursery(false);
      setNurseryError(`Error fetching data for the nursery: ${error.message}`);
    }
  };

  // Fetch Green House Data:
  const fetchGHData = async greenhouse => {
    try {
      setLoader(true);
      setDataForGreenHouse(true);
      const currentDate = new Date();
      const nextDate = new Date();
      nextDate.setDate(currentDate.getDate() + 1);

      const formattedCurrentDate = currentDate.toISOString().split('T')[0];
      const formattedNextDate = nextDate.toISOString().split('T')[0];

      let apiUrl;

      if (greenhouse === 'GH-1') {
        apiUrl = `https://api.sabzorganics.com/live/?name=GH-01`;
      } else if (greenhouse === 'GH-2') {
        apiUrl = `https://api.sabzorganics.com/live/?name=GH-02`;
      } else if (greenhouse === 'GH-3') {
        apiUrl = `https://api.sabzorganics.com/live/?name=GH-03`;
      }

      const countResponse = await fetch(apiUrl);
      const countData = await countResponse.json();
      const totalCount = countData.count;
      console.log('Count of Green House:', totalCount);

      const DataResponse = await fetch(`${apiUrl}&limit=${totalCount}`);

      const greenhouseData = await DataResponse.json();
      console.log('Green House Data:', greenhouseData.results.length);

      if (greenhouseData.results.length > 0) {
        const mostRecentData = greenhouseData.results[0]; // Get the first item directly

        console.log('Most Recent Data of green house', mostRecentData);

        const tempCValue = parseFloat(mostRecentData.temp_c);
        const humidityValue = parseFloat(mostRecentData.humidity);
        // const humidityValue = NaN;

        const timestamp = new Date(mostRecentData.timestamp);
        const day = timestamp.getDate();
        const month = timestamp.getMonth() + 1; // Months are zero-based
        const year = timestamp.getFullYear();
        const greenHouseDate = `${day}/${month}/${year}`;
        // const greenHouseDate = timestamp.toLocaleDateString(); // Extract date
        const hours = timestamp.getHours();
        const minutes = timestamp.getMinutes().toString().padStart(2, '0'); // Pad minutes with leading zero if necessary
        const period = hours >= 12 ? 'pm' : 'am';
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
        const greenHouseFormattedTime = `${formattedHours}:${minutes} ${period}`;
        console.log('temp_c:', tempCValue);
        console.log('humidity:', humidityValue);

        setTempC(tempCValue);

        setHumidity(humidityValue);
        setGreenHousedate(greenHouseDate);
        setGreenHouseTime(greenHouseFormattedTime);
        setLoader(false);
        setError(null);
      } else {
        setLoader(false);
        setDataForGreenHouse(false);
        setError(`Temperature data not found for ${greenhouse}.`);
      }
    } catch (error) {
      setLoader(false);
      setDataForGreenHouse(false);
      setError(`Error fetching data for ${greenhouse}: ${error.message}`);
    }
  };

  //Function to handle touchableOpacity:
  const handleGreenhouseChange = async greenhouse => {
    setSelectedGreenhouse(greenhouse);
    await fetchGHData(greenhouse);
  };

  //Fetch Tank Data:

  const fetchTankData = async () => {
    try {
      setOutLoader(true);
      setDataForWaterTank(true);
      const currentDate = new Date();
      const nextDate = new Date();
      nextDate.setDate(currentDate.getDate() + 1);

      const formattedCurrentDate = currentDate.toISOString().split('T')[0];
      const formattedNextDate = nextDate.toISOString().split('T')[0];

      const tankResponse = await fetch(
        `https://api.sabzorganics.com/live/?name=Tank00`,
      );

      const countData = await tankResponse.json();
      const totalCount = countData.count;
      console.log('Count of Tank:', totalCount);

      const DataResponse = await fetch(
        `https://api.sabzorganics.com/live/?name=Tank00&limit=${totalCount}`,
      );

      const TankData = await DataResponse.json();
      console.log('Tank DATA:', TankData.results.length);

      if (TankData.results.length > 0) {
        const mostRecentData = TankData.results[0]; // Get the first item directly

        console.log('Most Recent Data of Tank', mostRecentData);

        const tempCValue = parseFloat(mostRecentData.temp_c);
        const distanceValue = parseFloat(mostRecentData.distance);
        const timestamp = new Date(mostRecentData.timestamp);
        const day = timestamp.getDate();
        const month = timestamp.getMonth() + 1; // Months are zero-based
        const year = timestamp.getFullYear();
        const tankDate = `${day}/${month}/${year}`;
        // const tankDate = timestamp.toLocaleDateString(); // Extract date
        const hours = timestamp.getHours();
        const minutes = timestamp.getMinutes().toString().padStart(2, '0'); // Pad minutes with leading zero if necessary
        const period = hours >= 12 ? 'pm' : 'am';
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
        const tankFormattedTime = `${formattedHours}:${minutes} ${period}`;

        // const tankFormattedTime = `${hours}:${minutes}`;
        console.log('temp_c:', tempCValue);
        console.log('humidity:', distanceValue);

        setTankTempC(tempCValue);
        setTankDistance(distanceValue);
        setTankDate(tankDate);
        setTankTime(tankFormattedTime);
        setTankError(null);
        setOutLoader(false);
      } else {
        setOutLoader(false);
        setDataForWaterTank(false);
        setTankError('Temperature data not found for the Tank.');
      }
    } catch (error) {
      setOutLoader(false);
      setDataForWaterTank(false);
      setTankError(`Error fetching data for the Tank: ${error.message}`);
    }
  };

  //On Refresh Control:

  const handleRefresh = () => {
    setRefreshing(true);

    // Fetch data here, for example:
    fetchOutdoorData();
    fetchNurseryData();
    fetchGHData(selectedGreenhouse);
    fetchTankData();

    setRefreshing(false);
  };

  const handleButtonPress = buttonName => {
    setSelectedButton(buttonName);
  };
  const getButtonImage = buttonName => {
    // Return the appropriate image source based on the selected button
    switch (buttonName) {
      case 'GH1':
        return selectedButton === 'GH1'
          ? globalPath.Gh_white
          : globalPath.Gh_grey;
      case 'GH2':
        return selectedButton === 'GH2'
          ? globalPath.Gh_white
          : globalPath.Gh_grey;
      case 'GH3':
        return selectedButton === 'GH3'
          ? globalPath.Gh_white
          : globalPath.Gh_grey;
      default:
        return globalPath.Gh_grey; // Default image
    }
  };

  const outdoorTemperature = () => {
    if (OutdoorTempC <= 10) {
      setOutdoorTemp('Harsh');
    } else if (OutdoorTempC > 10 && OutdoorTempC <= 18) {
      setOutdoorTemp('Warning');
    } else if (OutdoorTempC > 18 && OutdoorTempC <= 31) {
      setOutdoorTemp('Optimal');
    } else if (OutdoorTempC > 31 && OutdoorTempC <= 39) {
      setOutdoorTemp('Warning');
    } else {
      setOutdoorTemp('Harsh');
    }
  };
  useEffect(() => {
    outdoorTemperature();
  }, [OutdoorTempC]);

  const nurseryTemperature = () => {
    if (nurseryTempC <= 10) {
      setNurseryTemp('Harsh');
    } else if (nurseryTempC > 10 && nurseryTempC <= 18) {
      setNurseryTemp('Warning');
    } else if (nurseryTempC > 18 && nurseryTempC <= 31) {
      setNurseryTemp('Optimal');
    } else if (nurseryTempC > 31 && nurseryTempC <= 39) {
      setNurseryTemp('Warning');
    } else {
      setNurseryTemp('Harsh');
    }
  };
  useEffect(() => {
    nurseryTemperature();
  }, [nurseryTempC]);

  const greenhouseTemperature = () => {
    if (tempC <= 10) {
      setGreenhouseTemp('Harsh');
    } else if (tempC > 10 && tempC <= 18) {
      setGreenhouseTemp('Warning');
    } else if (tempC > 18 && tempC <= 31) {
      setGreenhouseTemp('Optimal');
    } else if (tempC > 31 && tempC <= 39) {
      setGreenhouseTemp('Warning');
    } else {
      setGreenhouseTemp('Harsh');
    }
  };
  useEffect(() => {
    greenhouseTemperature();
  }, [tempC]);

  // const valueChange = () => {
  //   if (tempC <= 10) {
  //     setMeterValue('Too Cold');
  //   } else if (tempC > 11 && tempC < 36) {
  //     setMeterValue('Moderate');
  //   } else if (tempC >= 36) {
  //     setMeterValue('Too Hot');
  //   }
  // };
  // useEffect(() => {
  //   valueChange();
  // }, [tempC]);
  onChange = value => this.setState({value: parseInt(value)});
  useEffect(() => {
    CurrentLogin();
  }, []);

  const CurrentLogin = async () => {
    const cuser = await Auth.currentAuthenticatedUser();

    const current = cuser.attributes.name;
    const id = cuser.attributes.email;
    setcurrentuser(current);
    console.log(' CURENT USER IS ', current);
    console.log(' CURENT USER email IS ', id);
  };
  const tankPercent = () => {
    const minDistance = 7;
    const maxDistance = 44;

    const emptyPercentage =
      ((TankDistance - minDistance) / (maxDistance - minDistance)) * 100;
    const fillPerecntage = 100 - emptyPercentage;
    setTankLevel(fillPerecntage);
  };
  useEffect(() => {
    tankPercent();
  }, [TankDistance]);

  const generateViewsArray = (
    startIndex,
    endIndex,
    baseName,
    labelColor,
    colors,
  ) => {
    const viewsArray = [];
    for (let i = startIndex; i <= endIndex; i++) {
      let activeBarColor;

      if (i <= 10) {
        activeBarColor = colors.red;
      } else if (i <= 18) {
        activeBarColor = colors.yellow;
      } else if (i <= 31) {
        activeBarColor = colors.light_green;
      } else if (i <= 39) {
        activeBarColor = colors.yellow;
      } else {
        activeBarColor = colors.red;
      }

      viewsArray.push({
        name: baseName,
        labelColor,
        activeBarColor,
      });
    }
    return viewsArray;
  };

  const outdoorArray = generateViewsArray(
    1,
    100,
    outdoorTemp,
    colors.dark_green,
    colors,
  );

  const nurseryArray = generateViewsArray(
    1,
    100,
    nurserytemp,
    colors.dark_green,
    colors,
  );
  const greenhouseArray = generateViewsArray(
    1,
    100,
    greenhouseTemp,
    colors.dark_green,
    colors,
  );
  return (
    <SafeAreaView style={styles.container}>
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
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Image style={styles.imagestyle} source={globalPath.Menu} />
          </TouchableOpacity>

          <View style={styles.userInfoContainer}>
            <Image
              style={styles.userimagestyle}
              source={globalPath.User}
              resizeMode="contain"
            />
            <Text style={styles.userstyle}>{currentuser}</Text>
          </View>
        </View>

        {/* <View style={styles.section1}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image style={styles.clockImg} source={globalPath.Clock} />
            <Text
              style={{
                fontWeight: '600',
                fontSize: responsiveFontSize(1.8),
                color: colors.dark_green,
              }}>
              {time}
            </Text>
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
            <Text
              style={{
                color: colors.dark_green,
                fontWeight: '700',
                fontSize: responsiveFontSize(1.8),
              }}>
              {formattedDate}
            </Text>
          </View>
        </View> */}
        {/* <View style={styles.colourview}>
          <View style={styles.rowContainer}>
            <View
              style={[
                styles.smallview,
                {backgroundColor: colors.light_green},
              ]}></View>
            <Text style={styles.rangetextcolour}>0 - 10</Text>
          </View>
          <View style={styles.rowContainer}>
            <View
              style={[
                styles.smallview,
                {backgroundColor: colors.yellow},
              ]}></View>
            <Text style={styles.rangetextcolour}>11 - 35</Text>
          </View>
          <View style={styles.rowContainer}>
            <View style={styles.smallview}></View>
            <Text style={styles.rangetextcolour}>36 - 100</Text>
          </View>
        </View> */}
        <View style={styles.main}>
          <View style={styles.section2}>
            <View
              style={[
                styles.outerview,
                {height: Platform.OS === 'ios' ? hp(23) : hp(26.5)},
              ]}>
              {outloader ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Lottie
                    source={require('../assets/animations/loader.json')}
                    style={styles.loader}
                    speed={2}
                    autoPlay
                    loop
                  />
                </View>
              ) : DataForOutDoor ? (
                <>
                  <View style={styles.humidityMainView}>
                    <View style={styles.humidityView}>
                      <Text style={styles.humidityText}>Outdoor</Text>
                    </View>
                    {isNaN(OutdoorHumidity) ? (
                      <Image
                        style={{
                          height: responsiveHeight(2),
                          width: responsiveHeight(2),
                          tintColor: colors.zinc,
                        }}
                        source={globalPath.NoDropIcon}
                      />
                    ) : (
                      <View style={[styles.humidityView]}>
                        <Image
                          style={{
                            height: responsiveHeight(1.9),
                            width: responsiveHeight(1.9),
                            marginLeft: responsiveWidth(2),
                            tintColor:
                              OutdoorHumidity &&
                              typeof OutdoorHumidity === 'number'
                                ? OutdoorHumidity < 50
                                  ? colors.red
                                  : OutdoorHumidity >= 50 &&
                                    OutdoorHumidity <= 60
                                  ? colors.yellow
                                  : OutdoorHumidity > 60 &&
                                    OutdoorHumidity <= 79
                                  ? colors.light_green
                                  : OutdoorHumidity > 79 &&
                                    OutdoorHumidity <= 90
                                  ? colors.yellow
                                  : OutdoorHumidity > 90
                                  ? colors.red
                                  : colors.light_zinc
                                : colors.light_zinc,
                          }}
                          source={globalPath.HumidityIcon}
                          resizeMode="contain"
                        />
                        <Text style={styles.humidityText}>
                          {OutdoorHumidity}
                        </Text>
                      </View>
                    )}
                  </View>

                  {!isNaN(OutdoorTempC) ? (
                    <View
                      style={[
                        styles.sppedoview,
                        {marginTop: responsiveHeight(1)},
                      ]}>
                      <RNSpeedometer
                        value={OutdoorTempC}
                        size={responsiveHeight(15)}
                        minValue={0}
                        maxValue={100}
                        allowedDecimals={4}
                        minMaxFont={{
                          fontSize: responsiveScreenFontSize(1.8),
                          color: colors.zinc,
                        }}
                        imageStyle={{
                          height: responsiveHeight(15.5),
                          width: responsiveHeight(15),
                        }}
                        labels={outdoorArray}
                        labelStyle={{
                          fontSize:
                            deviceWidth > 500
                              ? responsiveFontSize(1.5)
                              : Platform.OS === 'ios'
                              ? responsiveFontSize(2)
                              : responsiveFontSize(2.5),
                          color: colors.dark_green,
                        }}
                        labelNoteStyle={{
                          fontSize:
                            deviceWidth > 500
                              ? responsiveFontSize(1)
                              : Platform.OS === 'ios'
                              ? responsiveFontSize(2)
                              : responsiveFontSize(2),
                          // backgroundColor:"red"
                        }}
                      />
                    </View>
                  ) : (
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        // flex: 1,
                        // backgroundColor:"red"
                      }}>
                      <Image
                        source={globalPath.NoDataImg}
                        style={{
                          height: responsiveHeight(15),
                          width: responsiveHeight(15),
                          resizeMode: 'contain',
                        }}
                      />
                    </View>
                  )}

                  <View
                    style={[
                      styles.sppedoview,
                      {
                        marginTop:
                          Platform.OS === 'ios'
                            ? responsiveHeight(7)
                            : responsiveHeight(9),
                      },
                    ]}></View>
                </>
              ) : (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                  }}>
                  <Image
                    source={globalPath.NoDataImg}
                    style={{
                      height: responsiveHeight(15),
                      width: responsiveHeight(15),
                      resizeMode: 'contain',
                    }}
                  />
                </View>
              )}
            </View>
            <View
              style={{
                // height: responsiveHeight(2),
                height: responsiveHeight(3.5),
                marginHorizontal: responsiveWidth(2),
                marginTop: responsiveHeight(1),
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                // borderWidth: 1,
                // borderColor: colors.dark_green,
                paddingHorizontal: responsiveWidth(2),
                backgroundColor: '#fff',
                borderRadius: responsiveHeight(0.5),
                // paddingVertical: responsiveHeight(0.04)
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    fontWeight: '600',
                    fontSize: responsiveFontSize(1.5),
                    color: colors.dark_green,
                  }}>
                  {outdoorTime}
                </Text>
              </View>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',

                  height: responsiveHeight(2),
                }}>
                <Text
                  style={{
                    fontWeight: '600',
                    fontSize: responsiveFontSize(1.5),
                    color: colors.dark_green,
                  }}>
                  {outdoorDate}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section2}>
            <View
              style={[
                styles.outerview,
                {height: Platform.OS === 'ios' ? hp(23) : hp(26.5)},
              ]}>
              {outloader ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Lottie
                    source={require('../assets/animations/loader.json')}
                    style={styles.loader}
                    speed={2}
                    autoPlay
                    loop
                  />
                </View>
              ) : DataForNursery ? (
                <>
                  <View style={styles.humidityMainView}>
                    <View style={styles.humidityView}>
                      <Text style={styles.humidityText}>Nursery</Text>
                    </View>
                    {!isNaN(nurseryHumidity) ? (
                      <View style={styles.humidityView}>
                        <Image
                          style={{
                            height: responsiveHeight(1.9),
                            width: responsiveHeight(1.9),
                            marginLeft: responsiveWidth(2),
                            tintColor:
                              nurseryHumidity &&
                              typeof nurseryHumidity === 'number'
                                ? nurseryHumidity < 50
                                  ? colors.red
                                  : nurseryHumidity >= 50 &&
                                    nurseryHumidity <= 60
                                  ? colors.yellow
                                  : nurseryHumidity > 60 &&
                                    nurseryHumidity <= 79
                                  ? colors.light_green
                                  : nurseryHumidity > 79 &&
                                    nurseryHumidity <= 90
                                  ? colors.yellow
                                  : nurseryHumidity > 90
                                  ? colors.red
                                  : colors.light_zinc
                                : colors.light_zinc,
                          }}
                          source={globalPath.HumidityIcon}
                          resizeMode="contain"
                        />
                        <Text style={styles.humidityText}>
                          {nurseryHumidity}
                        </Text>
                      </View>
                    ) : (
                      <Image
                        style={{
                          height: responsiveHeight(2),
                          width: responsiveHeight(2),
                          tintColor: colors.zinc,
                        }}
                        source={globalPath.NoDropIcon}
                      />
                    )}
                  </View>
                  {!isNaN(nurseryTempC) ? (
                    <View
                      style={[
                        styles.sppedoview,
                        {marginTop: responsiveHeight(1)},
                      ]}>
                      <RNSpeedometer
                        value={nurseryTempC}
                        size={responsiveHeight(15)}
                        minValue={0}
                        maxValue={100}
                        allowedDecimals={4}
                        minMaxFont={{
                          fontSize: responsiveScreenFontSize(1.8),
                          color: colors.zinc,
                        }}
                        imageStyle={{
                          height: responsiveHeight(15.5),
                          width: responsiveHeight(15),
                        }}
                        labels={nurseryArray}
                        labelStyle={{
                          fontSize:
                            deviceWidth > 500
                              ? responsiveFontSize(1.5)
                              : Platform.OS === 'ios'
                              ? responsiveFontSize(2)
                              : responsiveFontSize(2.5),
                          color: colors.dark_green,
                        }}
                        labelNoteStyle={{
                          fontSize:
                            deviceWidth > 500
                              ? responsiveFontSize(1)
                              : Platform.OS === 'ios'
                              ? responsiveFontSize(2)
                              : responsiveFontSize(2),
                        }}
                      />
                    </View>
                  ) : (
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        // flex: 1,
                        // backgroundColor:"red"
                      }}>
                      <Image
                        source={globalPath.NoDataImg}
                        style={{
                          height: responsiveHeight(15),
                          width: responsiveHeight(15),
                          resizeMode: 'contain',
                        }}
                      />
                    </View>
                  )}

                  <View
                    style={[
                      styles.sppedoview,
                      {
                        marginTop:
                          Platform.OS === 'ios'
                            ? responsiveHeight(7)
                            : responsiveHeight(9),
                      },
                    ]}></View>
                </>
              ) : (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                  }}>
                  <Image
                    source={globalPath.NoDataImg}
                    style={{
                      height: responsiveHeight(15),
                      width: responsiveHeight(15),
                      resizeMode: 'contain',
                    }}
                  />
                </View>
              )}
            </View>
            <View
              style={{
                // height: responsiveHeight(2),
                height: responsiveHeight(3.5),
                marginHorizontal: responsiveWidth(2),
                marginTop: responsiveHeight(1),
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                // borderWidth: 1,
                // borderColor: colors.dark_green,
                paddingHorizontal: responsiveWidth(2),
                backgroundColor: '#fff',
                borderRadius: responsiveHeight(0.5),
                // paddingVertical: responsiveHeight(0.04)
                // backgroundColor:'red',
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    fontWeight: '600',
                    fontSize: responsiveFontSize(1.5),
                    color: colors.dark_green,
                  }}>
                  {nurseryTime}
                </Text>
              </View>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',

                  height: responsiveHeight(2),
                }}>
                <Text
                  style={{
                    fontWeight: '600',
                    fontSize: responsiveFontSize(1.5),
                    color: colors.dark_green,
                  }}>
                  {nurseryDate}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section4}>
          <TouchableOpacity
            style={[
              styles.touchableOpacity,
              selectedButton === 'GH1' && {backgroundColor: colors.light_green},
            ]}
            onPress={() => {
              setLoader(true);
              handleButtonPress('GH1');
              handleGreenhouseChange('GH-1');
            }}>
            <Image
              source={getButtonImage('GH1')}
              style={{
                height: responsiveHeight(2),
                width: responsiveHeight(2),
                marginRight: responsiveWidth(3),
              }}
            />
            <Text
              style={{
                color: selectedButton === 'GH1' ? 'white' : colors.dark_green,
                fontSize:
                  deviceWidth > 500
                    ? responsiveFontSize(1)
                    : responsiveFontSize(1.6),
              }}>
              GH - 1
            </Text>
          </TouchableOpacity>
          <View
            style={{
              height: responsiveHeight(3),
              width: 1,
              backgroundColor: colors.zinc,
            }}></View>
          <TouchableOpacity
            style={[
              styles.touchableOpacity,
              selectedButton === 'GH2' && {backgroundColor: colors.light_green},
            ]}
            onPress={() => {
              setLoader(true);
              handleButtonPress('GH2');
              handleGreenhouseChange('GH-2');
            }}>
            <Image
              source={getButtonImage('GH2')}
              style={{
                height: responsiveHeight(2),
                width: responsiveHeight(2),
                marginRight: responsiveWidth(3),
              }}
            />
            <Text
              style={{
                color: selectedButton === 'GH2' ? 'white' : colors.dark_green,
                fontSize:
                  deviceWidth > 500
                    ? responsiveFontSize(1)
                    : responsiveFontSize(1.6),
              }}>
              GH - 2
            </Text>
          </TouchableOpacity>
          <View
            style={{
              height: responsiveHeight(3),
              width: 1,
              backgroundColor: colors.zinc,
            }}></View>

          <TouchableOpacity
            style={[
              styles.touchableOpacity,
              selectedButton === 'GH3' && {backgroundColor: colors.light_green},
            ]}
            onPress={() => {
              setLoader(true);
              handleButtonPress('GH3');
              handleGreenhouseChange('GH-3');
            }}>
            <Image
              source={getButtonImage('GH3')}
              style={{
                height: responsiveHeight(2),
                width: responsiveHeight(2),
                marginRight: responsiveWidth(3),
              }}
            />
            <Text
              style={{
                color: selectedButton === 'GH3' ? 'white' : colors.dark_green,
                fontSize:
                  deviceWidth > 500
                    ? responsiveFontSize(1)
                    : responsiveFontSize(1.6),
              }}>
              GH - 3
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section5}>
          <View
            style={[
              styles.outerview,
              {
                width: responsiveWidth(90),
                height:
                  Platform.OS === 'ios'
                    ? responsiveHeight(24)
                    : responsiveHeight(25.5),
                marginHorizontal: responsiveWidth(5),
              },
            ]}>
            {loader ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Lottie
                  source={require('../assets/animations/loader.json')}
                  style={styles.loader}
                  speed={2}
                  autoPlay
                  loop
                />
              </View>
            ) : DataForGreenHouse ? (
              <>
                <View style={styles.humidityMainView}>
                  <View style={styles.humidityView}>
                    <Text style={styles.humidityText}>Green House</Text>
                  </View>
                  {!isNaN(humidity) ? (
                    <View style={styles.humidityView}>
                      <Image
                        style={{
                          height: responsiveHeight(1.9),
                          width: responsiveHeight(1.9),
                          marginLeft: responsiveWidth(2),
                          tintColor:
                            humidity && typeof humidity === 'number'
                              ? humidity < 50
                                ? colors.red
                                : humidity >= 50 && humidity <= 60
                                ? colors.yellow
                                : humidity > 60 && humidity <= 79
                                ? colors.light_green
                                : humidity > 79 && humidity <= 90
                                ? colors.yellow
                                : humidity > 90
                                ? colors.red
                                : colors.light_zinc
                              : colors.light_zinc,
                        }}
                        source={globalPath.HumidityIcon}
                        resizeMode="contain"
                      />
                      <Text style={styles.humidityText}>{humidity}</Text>
                    </View>
                  ) : (
                    <Image
                      style={{
                        height: responsiveHeight(2),
                        width: responsiveHeight(2),
                        tintColor: colors.zinc,
                      }}
                      source={globalPath.NoDropIcon}
                    />
                  )}
                </View>
                {!isNaN(tempC) ? (
                  <View
                    style={[
                      styles.sppedoview,
                      {marginTop: responsiveHeight(1.5)},
                    ]}>
                    <View
                      style={{
                        width: wp(83),
                        alignItems: 'flex-end',
                      }}></View>

                    <RNSpeedometer
                      value={tempC}
                      size={responsiveHeight(15)}
                      minValue={0}
                      maxValue={100}
                      allowedDecimals={3}
                      minMaxFont={{
                        fontSize: responsiveScreenFontSize(1.8),
                        color: colors.zinc,
                      }}
                      imageStyle={{
                        height: responsiveHeight(15.5),
                        width: responsiveHeight(15),
                      }}
                      labels={greenhouseArray}
                      labelStyle={{
                        fontSize:
                          deviceWidth > 500
                            ? responsiveFontSize(1.5)
                            : Platform.OS === 'ios'
                            ? responsiveFontSize(2)
                            : responsiveFontSize(3),
                        color: colors.dark_green,
                      }}
                      labelNoteStyle={{
                        fontSize:
                          deviceWidth > 500
                            ? responsiveFontSize(1.5)
                            : Platform.OS === 'ios'
                            ? responsiveFontSize(2)
                            : responsiveFontSize(2),
                      }}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      flex: 1,
                      // backgroundColor:"red"
                    }}>
                    <Image
                      source={globalPath.NoDataImg}
                      style={{
                        height: responsiveHeight(15),
                        width: responsiveHeight(15),
                        resizeMode: 'contain',
                      }}
                    />
                  </View>
                )}
                <View
                  style={{
                    // height: responsiveHeight(2),

                    height: responsiveHeight(3.5),

                    marginTop: isNaN(tempC)
                      ? responsiveHeight(0)
                      : responsiveHeight(5),
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    // borderWidth: 1,
                    // borderColor: colors.dark_green,
                    paddingHorizontal: responsiveWidth(2),
                    // backgroundColor:'pink',

                    borderRadius: responsiveHeight(0.5),
                    // paddingVertical: responsiveHeight(0.04)
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text
                      style={{
                        fontWeight: '600',
                        fontSize: responsiveFontSize(1.5),
                        color: colors.dark_green,
                      }}>
                      {greenHouseTime}
                    </Text>
                  </View>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',

                      height: responsiveHeight(2),
                    }}>
                    <Text
                      style={{
                        fontWeight: '700',
                        fontSize: responsiveFontSize(1.5),
                        color: colors.dark_green,
                      }}>
                      {greenHouseDate}
                    </Text>
                  </View>
                </View>
              </>
            ) : (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                }}>
                <Image
                  source={globalPath.NoDataImg}
                  style={{
                    height: responsiveHeight(15),
                    width: responsiveHeight(15),
                    resizeMode: 'contain',
                  }}
                />
              </View>
            )}
          </View>
        </View>

        <View style={styles.section6}>
          <View
            style={[
              styles.outerview,
              {
                width: responsiveWidth(90),
                height:
                  Platform.OS === 'ios'
                    ? responsiveHeight(24)
                    : responsiveHeight(25),
                marginHorizontal: responsiveWidth(5),
              },
            ]}>
            {outloader ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Lottie
                  source={require('../assets/animations/loader.json')}
                  style={styles.loader}
                  speed={2}
                  autoPlay
                  loop
                />
              </View>
            ) : DataForWaterTank ? (
              <>
                <View style={styles.humidityMainView}>
                  {isNaN(TankTempC) ? (
                    <View style={styles.humidityView}>
                      <Text style={styles.humidityText}>No Temperature</Text>
                    </View>
                  ) : (
                    <View style={styles.humidityView}>
                      <Text style={styles.humidityText}>{TankTempC} °C</Text>
                    </View>
                  )}

                  {isNaN(TankDistance) ? (
                    <View style={styles.humidityView}>
                      <Text style={styles.humidityText}>No Distance</Text>
                    </View>
                  ) : (
                    <View style={styles.humidityView}>
                      <Text style={styles.humidityText}>
                        Distance: {TankDistance}
                      </Text>
                    </View>
                  )}
                </View>
                {isNaN(TankDistance) ? (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      flex: 1,
                    }}>
                    <Image
                      source={globalPath.NoTankData}
                      style={{
                        height: responsiveHeight(15),
                        width: responsiveHeight(15),
                        resizeMode: 'contain',
                      }}
                    />
                  </View>
                ) : (
                  <View
                    style={{alignItems: 'center', justifyContent: 'center'}}>
                    <LiquidGauge
                      config={{
                        minValue: 0,
                        maxValue: 100,
                        circleColor: '#064273',
                        textColor: '#1da2d8',
                        waveTextColor: '#064273',
                        waveColor: '#9fcffb',
                        circleThickness: 0.1,
                        circleFillGap: 0.05,
                        waveRiseTime: 2000,
                        waveAnimateTime: 1000,

                        waveHeight: 0.07,
                        waveCount: 4,
                        textVertPosition: 0.7,
                        textSize: 0.7,
                        waveHeight: 0.2,
                      }}
                      value={tankLevel}
                      width={responsiveHeight(14)}
                      height={responsiveHeight(14)}
                    />
                  </View>
                )}

                <View
                  style={{
                    // height: responsiveHeight(2),
                    height: responsiveHeight(3.5),
                 
                    marginTop: responsiveHeight(2),
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    // borderWidth: 1,
                    // borderColor: colors.dark_green,
                    paddingHorizontal: responsiveWidth(3),

                    borderRadius: responsiveHeight(0.5),
                    // paddingVertical: responsiveHeight(0.04)
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text
                      style={{
                        fontWeight: '600',
                        fontSize: responsiveFontSize(1.5),
                        color: colors.dark_green,
                      }}>
                      {tankTime}
                    </Text>
                  </View>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',

                      height: responsiveHeight(2),
                    }}>
                    <Text
                      style={{
                        fontWeight: '700',
                        fontSize: responsiveFontSize(1.5),
                        color: colors.dark_green,
                      }}>
                      {tankDate}
                    </Text>
                  </View>
                </View>
              </>
            ) : (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                }}>
                <Image
                  source={globalPath.NoTankData}
                  style={{
                    height: responsiveHeight(15),
                    width: responsiveHeight(15),
                    resizeMode: 'contain',
                  }}
                />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: deviceWidth > 500 ? hp(6) : hp(4),
    // marginTop: Platform.OS === 'ios' ? undefined : 10,

    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor:"pink"
  },
  section1: {
    height: deviceWidth > 500 ? hp(7) : hp(5.5),
    width: wp(94),
    backgroundColor: colors.light_zinc,
    borderRadius: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(2),
    display: 'flex',
    // paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    top: responsiveWidth(1.5),
    alignItems: 'center',
    marginTop: responsiveHeight(1),
    // backgroundColor:"red"
  },
  main: {
    height: Platform.OS === 'ios' ? hp(29) : hp(30),
    marginTop: responsiveHeight(1),
    display: 'flex',
    flexDirection: 'row',
    // backgroundColor: "pink"
    // paddingHorizontal: responsiveWidth(0.5),
  },
  section2: {
    width: wp(50),
    //  backgroundColor:'yellow',

    height: Platform.OS === 'ios' ? hp(29) : hp(30),
  },
  section4: {
    ...(Platform.OS === 'ios'
      ? {
          // borderRadius: res,
          height: hp(3),
          marginTop: responsiveHeight(1),
          alignItems: 'center',
          justifyContent: 'center',
          // display: 'flex',
          flexDirection: 'row',
          marginBottom: responsiveHeight(0.5),
          // marginHorizontal: 60,
          // backgroundColor: colors.red
        }
      : {
          // borderRadius: 10,
          height: hp(5.5),
          // backgroundColor:'red',
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'row',
          marginBottom: responsiveHeight(0.5),
          // marginHorizontal: 10,
          marginTop: responsiveHeight(3),
        }),
  },

  section5: {
    height: Platform.OS === 'ios' ? hp(25) : hp(27),

    // backgroundColor:'green'
  },
  section6: {
    height: Platform.OS === 'ios' ? hp(29) : hp(29),
    // backgroundColor:'skyblue'
  },
  imagestyle: {
    width: deviceWidth > 500 ? responsiveWidth(4) : responsiveWidth(6),
    height: deviceWidth > 500 ? responsiveHeight(4) : responsiveWidth(6),
    marginLeft: responsiveHeight(2),
    marginTop: responsiveHeight(0.6),
  },
  outerview: {
    backgroundColor: 'white',
    // flex: 1,
    width: responsiveWidth(46),
    height: Platform.OS === 'ios' ? hp(22) : hp(24.5),

    marginHorizontal: responsiveWidth(2),
    marginTop: responsiveWidth(2),
    borderRadius: responsiveWidth(5),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  touchableOpacity: {
    ...(Platform.OS === 'ios'
      ? {
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 7,
          backgroundColor: colors.light_zinc,
          width: responsiveWidth(31.5),
          height: responsiveHeight(3),
        }
      : {
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 7,
          backgroundColor: colors.light_zinc,
          width: responsiveWidth(31.5),
          height: responsiveHeight(4),
        }), // Conditional styling for iOS
  },
  sppedoview: {
    alignSelf: 'center',
    marginTop: Platform.OS === 'ios' ? hp(4) : hp(4),
  },
  humidityText: {
    fontSize: deviceWidth > 500 ? responsiveFontSize(1.5) : undefined,
    paddingHorizontal: responsiveWidth(2),
    paddingVertical: responsiveHeight(0.5),
    color: colors.dark_green,
    fontWeight: '600',
  },
  humidityView: {
    backgroundColor: colors.light_zinc,
    borderRadius: responsiveHeight(0.8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clockImg: {
    height: responsiveHeight(2),
    width: responsiveHeight(2),
    marginRight: responsiveWidth(2),
    tintColor: colors.dark_green,
  },
  humidityMainView: {
    marginTop: responsiveHeight(1.5),
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginHorizontal: responsiveWidth(2),
  },
  loader: {
    width: responsiveWidth(30),
    height: responsiveHeight(30),
  },
  colourview: {
    height: deviceWidth > 500 ? hp(4) : hp(3),
    width: wp(94),
    backgroundColor: 'white',
    borderRadius: responsiveHeight(0.5),
    paddingHorizontal: responsiveWidth(2),
    display: 'flex',
    // paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginHorizontal: responsiveWidth(4),
    marginHorizontal: responsiveWidth(3),

    top: responsiveWidth(1.5),
    alignItems: 'center',
    marginTop: responsiveHeight(1),
    elevation: 3,
  },

  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginVertical: 5,
  },
  smallview: {
    backgroundColor: colors.red,
    height: responsiveWidth(2.2),
    width: responsiveWidth(3.5),
    marginRight: 5,
  },
  rangetextcolour: {
    color: colors.dark_green,
    fontSize:
      deviceWidth > 500 ? responsiveFontSize(1) : responsiveFontSize(1.6),
  },
  userstyle: {
    color: colors.dark_green,
    // marginTop:
    //   Platform.OS === 'ios'
    //     ? responsiveHeight(1)
    //     : responsiveHeight(1),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: responsiveWidth(5),
    fontSize: responsiveFontSize(2),
  },

  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor:"red",
    height: deviceWidth > 500 ? hp(6) : hp(4),
  },
  userimagestyle: {
    width: deviceWidth > 500 ? responsiveWidth(4) : responsiveWidth(5),
    height: deviceWidth > 500 ? responsiveHeight(4) : responsiveWidth(5),
    marginHorizontal: responsiveWidth(2),
    // marginTop:responsiveWidth(0.1)
    tintColor: colors.dark_green,
  },
});
