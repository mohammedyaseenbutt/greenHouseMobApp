// import {
//   Dimensions,
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   ScrollView,
//   Platform,
// } from 'react-native';
// import React, {useEffect, useState} from 'react';
// import {
//   responsiveFontSize,
//   responsiveHeight,
//   responsiveScreenFontSize,
//   responsiveWidth,
// } from 'react-native-responsive-dimensions';
// import {SafeAreaView} from 'react-native-safe-area-context';
// import RNSpeedometer from 'react-native-speedometer';
// import {LiquidGauge} from 'react-native-liquid-gauge';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// import {globalPath} from '../constants/globalpaths';
// import {TouchableOpacity} from 'react-native-gesture-handler';
// import {Colors} from 'react-native/Libraries/NewAppScreen';
// import {colors} from '../constants/ColorsPallets';
// import {set} from 'date-fns';
// import {Auth} from 'aws-amplify';
// import {RefreshControl} from 'react-native';
// import Lottie from 'lottie-react-native';
// import {color} from 'd3';

// import { getApiUrl} from '../constants/apiConfig'; 

// let deviceWidth = Dimensions.get('window').width;

// const Home = ({navigation}) => {
//   //

//   //Design States:
//   const [selectedButton, setSelectedButton] = useState('GH1');
//   const [meterValue, setMeterValue] = useState('');
//   const [greenhouseTemp, setGreenhouseTemp] = useState('');
//   const [outdoorTemp, setOutdoorTemp] = useState('');
//   const [nurserytemp, setNurseryTemp] = useState('');
//   const [tankLevel, setTankLevel] = useState(0);
//   const [currentuser, setcurrentuser] = useState('');
//   const [loader, setLoader] = useState(false);
//   const [outloader, setOutLoader] = useState(false);

//   //refreshcontrol state:
//   const [refreshing, setRefreshing] = useState(false);

//   //States for showing gauge has data or not:
//   const [DataForOutDoor, setDataForOutDoor] = useState(true);
//   const [DataForNursery, setDataForNursery] = useState(true);
//   const [DataForGreenHouse, setDataForGreenHouse] = useState(true);
//   const [DataForWaterTank, setDataForWaterTank] = useState(true);
  
//   const [outdoorDate, setOutdoordate] = useState('');
//   const [outdoorTime, setOutdoorTime] = useState();
//   //OutDoor States:

//   const [OutdoorTempC, setOutdoorTempC] = useState(0);
//   const [OutdoorHumidity, setOutdoorHumidity] = useState(0);
//   const [OutdoorError, setOutdoorError] = useState(null);

//   //Nursery States:
//   const [nurseryTempC, setNurseryTempC] = useState(0);
//   const [nurseryHumidity, setNurseryHumidity] = useState(0);
//   const [nurseryError, setNurseryError] = useState(null);
//   const [nurseryDate, setNurserydate] = useState('');
//   const [nurseryTime, setNurseryTime] = useState();
//   // GreeenHouse States:

//   const [selectedGreenhouse, setSelectedGreenhouse] = useState('GH-1');
//   const [tempC, setTempC] = useState(0);
//   const [tempF, setTempF] = useState(0);
//   const [humidity, setHumidity] = useState(0);
//   const [error, setError] = useState(null);
//   const [greenHouseDate, setGreenHousedate] = useState('');
//   const [greenHouseTime, setGreenHouseTime] = useState();

//   //WaterTank States:
//   const [TankTempC, setTankTempC] = useState(0);
//   const [TankDistance, setTankDistance] = useState(0);
//   const [TankError, setTankError] = useState(null);
//   const [tankDate, setTankDate] = useState('');
//   const [tankTime, setTankTime] = useState();
//   // Current Date and Time

//   const [formattedDate, setFormattedDate] = useState('');
//   const [year, setYear] = useState('');
//   const [time, setTime] = useState('');

//   useEffect(() => {
//     const getCurrentDate = () => {
//       const currentDate = new Date();

//       // Format: Tue, Jan 26
//       const formattedDateString = currentDate.toLocaleString('en-US', {
//         weekday: 'short',
//         month: 'short',
//         day: 'numeric',
//       });

//       // Format: 2024
//       const yearString = currentDate.getFullYear().toString();

//       // Format: 9:50pm
//       const timeString = currentDate.toLocaleString('en-US', {
//         hour: 'numeric',
//         minute: 'numeric',
//         hour12: true,
//       });

//       // Update states
//       setFormattedDate(formattedDateString);
//       setYear(yearString);
//       setTime(timeString);
//     };

//     getCurrentDate();

//     // Update every minute
//     const intervalId = setInterval(getCurrentDate, 60000);

//     // Clean up the interval on component unmount
//     return () => clearInterval(intervalId);
//   }, []); // Empty dependency array to run only once on mount

//   useEffect(() => {
//     fetchOutdoorData();
//     fetchNurseryData();

//     fetchTankData();
//   }, []);

//   useEffect(() => {
//     fetchGHData(selectedGreenhouse);
//   }, [selectedGreenhouse]);

//   //Fetch Outdoor data:

//   const fetchOutdoorData = async () => {
//     try {
//       setOutLoader(true);
//       const currentDate = new Date();
//       const nextDate = new Date();
//       nextDate.setDate(currentDate.getDate() + 1);

//       const formattedCurrentDate = currentDate.toISOString().split('T')[0];
//       const formattedNextDate = nextDate.toISOString().split('T')[0];

//       const apiUrlWithTimestamps = getApiUrl('live_Outdoor', formattedCurrentDate, formattedNextDate);
//       console.log("Apiurl with timestamps ", apiUrlWithTimestamps);    

//       const outdoorResponse = await fetch(
//         apiUrlWithTimestamps
//         // `https://api.sabzorganics.com/live/?name=Outdoor-01&timestamp__gte=${formattedCurrentDate}&timestamp__lte=${formattedNextDate}`,
//       );

//       const countData = await outdoorResponse.json();
//       const totalCount = countData.count;
//       console.log('Count of Outdoor:', totalCount);

//       const DataResponse = await fetch(
//         `${apiUrlWithTimestamps}&limit=${totalCount}`,
//       );

//       const OutdoorData = await DataResponse.json();

//       console.log('Outdoor DATA:', OutdoorData.results.length);
//       const lengthOutDoor = OutdoorData.results.length;
//       if (lengthOutDoor > 0) {
//         setDataForOutDoor(true);
//         const mostRecentData = OutdoorData.results[0]; // Get the first item directly

//         console.log('Most Recent Data of outdoor', mostRecentData);

//         const tempCValue = parseFloat(mostRecentData.temp_c);
//         const humidityValue = parseFloat(mostRecentData.humidity);
//         const timestamp = new Date(mostRecentData.timestamp);
//         const day = timestamp.getDate();
//         const month = timestamp.getMonth() + 1; // Months are zero-based
//         const year = timestamp.getFullYear();
//         const outdoorDate = `${day}/${month}/${year}`;

//         // const outdoorDate = timestamp.toLocaleDateString(); // Extract date
//         const hours = timestamp.getHours();
//         const minutes = timestamp.getMinutes();
//         const period = hours >= 12 ? 'pm' : 'am';
//         const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
//         const outdoorFormattedTime = `${formattedHours}:${minutes} ${period}`;
//         console.log('temp_c:', tempCValue);
//         console.log('humidity:', humidityValue);

//         setOutdoorTempC(tempCValue);
//         setOutdoorHumidity(humidityValue);
//         setOutdoordate(outdoorDate);
//         setOutdoorTime(outdoorFormattedTime);
//         setOutdoorError(null);
//         setOutLoader(false);
//       } else {
//         setOutLoader(false);
//         setDataForOutDoor(false);
//         setOutdoorError('Temperature data not found for the Outdoor.');
//       }
//     } catch (error) {
//       setOutLoader(false);
//       setDataForOutDoor(false);
//       setOutdoorError(`Error fetching data for the Outdoor: ${error.message}`);
//     }
//   };

//   // Fetch Nursery Data:

//   const fetchNurseryData = async () => {
//     try {
//       setOutLoader(true);
//       setDataForNursery(true);
//       const currentDate = new Date();
//       const nextDate = new Date();
//       nextDate.setDate(currentDate.getDate() + 1);

//       const formattedCurrentDate = currentDate.toISOString().split('T')[0];
//       const formattedNextDate = nextDate.toISOString().split('T')[0];

//       const apiUrlWithTimestamps = getApiUrl('live_Nursery', formattedCurrentDate, formattedNextDate);
//       console.log("Apiurl with timestamps ", apiUrlWithTimestamps);    


//       const nurseryResponse = await fetch(
//         apiUrlWithTimestamps
//         // `https://api.sabzorganics.com/live/?name=Nursery-01&timestamp__gte=${formattedCurrentDate}&timestamp__lte=${formattedNextDate}`,
//       );

//       const countData = await nurseryResponse.json();
//       const totalCount = countData.count;
//       console.log('Count of Nursery:', totalCount);

//       const DataResponse = await fetch(
       
//         `${apiUrlWithTimestamps}&limit=${totalCount}`,
//       );

//       const NurseryData = await DataResponse.json();
//       console.log('Nursery DATA:', NurseryData.results.length);

//       if (NurseryData.results.length > 0) {
//         const mostRecentData = NurseryData.results[0]; // Get the first item directly

//         console.log('Most Recent Data of nursery', mostRecentData);

//         const tempCValue = parseFloat(mostRecentData.temp_c);
//         const humidityValue = parseFloat(mostRecentData.humidity);
//         const timestamp = new Date(mostRecentData.timestamp);
//         const day = timestamp.getDate();
//         const month = timestamp.getMonth() + 1; // Months are zero-based
//         const year = timestamp.getFullYear();
//         const nurseryDate = `${day}/${month}/${year}`
//         // const nurseryDate = timestamp.toLocaleDateString(); // Extract date
//         const hours = timestamp.getHours();
//         const minutes = timestamp.getMinutes();
//         const period = hours >= 12 ? 'pm' : 'am';
//         const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
//         const nurseryFormattedTime = `${formattedHours}:${minutes} ${period}`;
//         console.log('temp_c:', tempCValue);
//         console.log('humidity:', humidityValue);

//         setNurseryTempC(tempCValue);
//         console.log('nurseryTempc', tempCValue);
//         setNurseryHumidity(humidityValue);
//         setNurserydate(nurseryDate), setNurseryTime(nurseryFormattedTime);
//         setNurseryError(null);
//         setOutLoader(false);
//       } else {
//         setOutLoader(false);
//         setDataForNursery(false);
//         setNurseryError('Temperature data not found for the nursery.');
//       }
//     } catch (error) {
//       setOutLoader(false);
//       setDataForNursery(false);
//       setNurseryError(`Error fetching data for the nursery: ${error.message}`);
//     }
//   };

//   // Fetch Green House Data:
//   const fetchGHData = async greenhouse => {
//     try {
//       setLoader(true);
//       setDataForGreenHouse(true);
//       const currentDate = new Date();
//       const nextDate = new Date();
//       nextDate.setDate(currentDate.getDate() + 1);

//       const formattedCurrentDate = currentDate.toISOString().split('T')[0];
//       const formattedNextDate = nextDate.toISOString().split('T')[0];

//       // const apiUrlWithTimestamps = getApiUrl('live_GreenHouse_1', formattedCurrentDate, formattedNextDate);
//       // console.log("Apiurl with timestamps ", apiUrlWithTimestamps);  
    
//       let apiUrl;

//       if (greenhouse === 'GH-1') {
//         apiUrl = getApiUrl('live_GreenHouse_1', formattedCurrentDate, formattedNextDate);
//       } else if (greenhouse === 'GH-2') {
//         apiUrl = getApiUrl('live_GreenHouse_2', formattedCurrentDate, formattedNextDate);;
//       } else if (greenhouse === 'GH-3') {
//         apiUrl = getApiUrl('live_GreenHouse_3', formattedCurrentDate, formattedNextDate);;
//       }



//     //   const greenhouse = 'GH-1'; 
//     //   const apiUrlWithTimestamps = getApiUrl(`live_${greenhouse}`, formattedCurrentDate, formattedNextDate);
//     //   console.log("Apiurl with timestamps ", apiUrlWithTimestamps);

//     //   let apiUrl;

//     //  if (greenhouse === 'GH-1' || greenhouse === 'GH-2' || greenhouse === 'GH-3') {
//     //  apiUrl = apiUrlWithTimestamps;
//     //  } else {
//     //   // Handle error or provide a default behavior
//     //   console.error('Invalid greenhouse type');
//     //  }

//       const countResponse = await fetch(apiUrl);
//       const countData = await countResponse.json();
//       const totalCount = countData.count;
//       console.log('Count of Green House:', totalCount);

//       const DataResponse = await fetch(`${apiUrl}&limit=${totalCount}`);

//       const greenhouseData = await DataResponse.json();
//       console.log('Green House Data:', greenhouseData.results.length);

//       if (greenhouseData.results.length > 0) {
//         const mostRecentData = greenhouseData.results[0]; // Get the first item directly

//         console.log('Most Recent Data of green house', mostRecentData);

//         const tempCValue = parseFloat(mostRecentData.temp_c);
//         const humidityValue = parseFloat(mostRecentData.humidity);
//         const timestamp = new Date(mostRecentData.timestamp);
//         const day = timestamp.getDate();
//         const month = timestamp.getMonth() + 1; // Months are zero-based
//         const year = timestamp.getFullYear();
//         const greenHouseDate = `${day}/${month}/${year}`
//         // const greenHouseDate = timestamp.toLocaleDateString(); // Extract date
//         const hours = timestamp.getHours();
//         const minutes = timestamp.getMinutes();
//         const period = hours >= 12 ? 'pm' : 'am';
//         const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
//         const greenHouseFormattedTime = `${formattedHours}:${minutes} ${period}`;
//         console.log('temp_c:', tempCValue);
//         console.log('humidity:', humidityValue);

//         setTempC(tempCValue);
//         setHumidity(humidityValue);
//         setGreenHousedate(greenHouseDate);
//         setGreenHouseTime(greenHouseFormattedTime);
//         setLoader(false);
//         setError(null);
//       } else {
//         setLoader(false);
//         setDataForGreenHouse(false);
//         setError(`Temperature data not found for ${greenhouse}.`);
//       }
//     } catch (error) {
//       setLoader(false);
//       setDataForGreenHouse(false);
//       setError(`Error fetching data for ${greenhouse}: ${error.message}`);
//     }
//   };

//   //Function to handle touchableOpacity:
//   const handleGreenhouseChange = async greenhouse => {
//     setSelectedGreenhouse(greenhouse);
//     await fetchGHData(greenhouse);
//   };

//   //Fetch Tank Data:

//   const fetchTankData = async () => {
//     try {
//       setOutLoader(true);
//       setDataForWaterTank(true);
//       const currentDate = new Date();
//       const nextDate = new Date();
//       nextDate.setDate(currentDate.getDate() + 1);

//       const formattedCurrentDate = currentDate.toISOString().split('T')[0];
//       const formattedNextDate = nextDate.toISOString().split('T')[0];


//       const apiUrlWithTimestamps = getApiUrl('live_Tank', formattedCurrentDate, formattedNextDate);
//       console.log("Apiurl with timestamps of tank ", apiUrlWithTimestamps);    


//       const tankResponse = await fetch(
//         apiUrlWithTimestamps
//         // `https://api.sabzorganics.com/live/?name=Tank00&timestamp__gte=${formattedCurrentDate}&timestamp__lte=${formattedNextDate}`,
//       );

//       const countData = await tankResponse.json();
//       const totalCount = countData.count;
//       console.log('Count of Tank:', totalCount);

//       const DataResponse = await fetch(
//         `${apiUrlWithTimestamps}&limit=${totalCount}`,
//       );

//       const TankData = await DataResponse.json();
//       console.log('Tank DATA:', TankData.results.length);

//       if (TankData.results.length > 0) {
//         const mostRecentData = TankData.results[0]; // Get the first item directly

//         console.log('Most Recent Data of Tank', mostRecentData);

//         const tempCValue = parseFloat(mostRecentData.temp_c);
//         const distanceValue = parseFloat(mostRecentData.distance);
//         const timestamp = new Date(mostRecentData.timestamp);
//         const day = timestamp.getDate();
//         const month = timestamp.getMonth() + 1; // Months are zero-based
//         const year = timestamp.getFullYear();
//         const tankDate = `${day}/${month}/${year}`
//         // const tankDate = timestamp.toLocaleDateString(); // Extract date
//         const hours = timestamp.getHours();
//         const minutes = timestamp.getMinutes();
//         const period = hours >= 12 ? 'pm' : 'am';
//         const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
//         const tankFormattedTime = `${formattedHours}:${minutes} ${period}`;

//         // const tankFormattedTime = `${hours}:${minutes}`;
//         console.log('temp_c:', tempCValue);
//         console.log('humidity:', distanceValue);

//         setTankTempC(tempCValue);
//         setTankDistance(distanceValue);
//         setTankDate(tankDate);
//         setTankTime(tankFormattedTime);
//         setTankError(null);
//         setOutLoader(false);
//       } else {
//         setOutLoader(false);
//         setDataForWaterTank(false);
//         setTankError('Temperature data not found for the Tank.');
//       }
//     } catch (error) {
//       setOutLoader(false);
//       setDataForWaterTank(false);
//       setTankError(`Error fetching data for the Tank: ${error.message}`);
//     }
//   };

//   //On Refresh Control:

//   const handleRefresh = () => {
//     setRefreshing(true);

//     // Fetch data here, for example:
//     fetchOutdoorData();
//     fetchNurseryData();
//     fetchGHData(selectedGreenhouse);
//     fetchTankData();

//     setRefreshing(false);
//   };

//   const handleButtonPress = buttonName => {
//     setSelectedButton(buttonName);
//   };
//   const getButtonImage = buttonName => {
//     // Return the appropriate image source based on the selected button
//     switch (buttonName) {
//       case 'GH1':
//         return selectedButton === 'GH1'
//           ? globalPath.Gh_white
//           : globalPath.Gh_grey;
//       case 'GH2':
//         return selectedButton === 'GH2'
//           ? globalPath.Gh_white
//           : globalPath.Gh_grey;
//       case 'GH3':
//         return selectedButton === 'GH3'
//           ? globalPath.Gh_white
//           : globalPath.Gh_grey;
//       default:
//         return globalPath.Gh_grey; // Default image
//     }
//   };

//   const outdoorTemperature = () => {
//     if (OutdoorTempC <= 10) {
//       setOutdoorTemp('Harsh');
//     } else if (OutdoorTempC > 10 && OutdoorTempC <= 18) {
//       setOutdoorTemp('Warning');
//     } else if (OutdoorTempC > 18 && OutdoorTempC <= 31) {
//       setOutdoorTemp('Optimal');
//     } else if (OutdoorTempC > 31 && OutdoorTempC <= 39) {
//       setOutdoorTemp('Warning');
//     } else {
//       setOutdoorTemp('Harsh');
//     }
//   };
//   useEffect(() => {
//     outdoorTemperature();
//   }, [OutdoorTempC]);

//   const nurseryTemperature = () => {
//     if (nurseryTempC <= 10) {
//       setNurseryTemp('Harsh');
//     } else if (nurseryTempC > 10 && nurseryTempC <= 18) {
//       setNurseryTemp('Warning');
//     } else if (nurseryTempC > 18 && nurseryTempC <= 31) {
//       setNurseryTemp('Optimal');
//     } else if (nurseryTempC > 31 && nurseryTempC <= 39) {
//       setNurseryTemp('Warning');
//     } else {
//       setNurseryTemp('Harsh');
//     }
//   };
//   useEffect(() => {
//     nurseryTemperature();
//   }, [nurseryTempC]);

//   const greenhouseTemperature = () => {
//     if (tempC <= 10) {
//       setGreenhouseTemp('Harsh');
//     } else if (tempC > 10 && tempC <= 18) {
//       setGreenhouseTemp('Warning');
//     } else if (tempC > 18 && tempC <= 31) {
//       setGreenhouseTemp('Optimal');
//     } else if (tempC > 31 && tempC <= 39) {
//       setGreenhouseTemp('Warning');
//     } else {
//       setGreenhouseTemp('Harsh');
//     }
//   };
//   useEffect(() => {
//     greenhouseTemperature();
//   }, [tempC]);

//   // const valueChange = () => {
//   //   if (tempC <= 10) {
//   //     setMeterValue('Too Cold');
//   //   } else if (tempC > 11 && tempC < 36) {
//   //     setMeterValue('Moderate');
//   //   } else if (tempC >= 36) {
//   //     setMeterValue('Too Hot');
//   //   }
//   // };
//   // useEffect(() => {
//   //   valueChange();
//   // }, [tempC]);
//   onChange = value => this.setState({value: parseInt(value)});
//   useEffect(() => {
//     CurrentLogin();
//   }, []);

//   const CurrentLogin = async () => {
//     const cuser = await Auth.currentAuthenticatedUser();

//     const current = cuser.attributes.name;
//     const id = cuser.attributes.email;
//     setcurrentuser(current);
//     console.log(' CURENT USER IS ', current);
//     console.log(' CURENT USER email IS ', id);
//   };
//   const tankPercent = () => {
//     const minDistance = 8;
//     const maxDistance = 50;

//     const emptyPercentage =
//       ((TankDistance - minDistance) / (maxDistance - minDistance)) * 100;
//     const fillPerecntage = 100 - emptyPercentage;
//     setTankLevel(fillPerecntage);
//   };
//   useEffect(() => {
//     tankPercent();
//   }, [TankDistance]);

//   const generateViewsArray = (
//     startIndex,
//     endIndex,
//     baseName,
//     labelColor,
//     colors,
//   ) => {
//     const viewsArray = [];
//     for (let i = startIndex; i <= endIndex; i++) {
//       let activeBarColor;

//       if (i <= 10) {
//         activeBarColor = colors.red;
//       } else if (i <= 18) {
//         activeBarColor = colors.yellow;
//       } else if (i <= 31) {
//         activeBarColor = colors.light_green;
//       } else if (i <= 39) {
//         activeBarColor = colors.yellow;
//       } else {
//         activeBarColor = colors.red;
//       }

//       viewsArray.push({
//         name: baseName,
//         labelColor,
//         activeBarColor,
//       });
//     }
//     return viewsArray;
//   };

//   const outdoorArray = generateViewsArray(
//     1,
//     100,
//     outdoorTemp,
//     colors.dark_green,
//     colors,
//   );

//   const nurseryArray = generateViewsArray(
//     1,
//     100,
//     nurserytemp,
//     colors.dark_green,
//     colors,
//   );
//   const greenhouseArray = generateViewsArray(
//     1,
//     100,
//     greenhouseTemp,
//     colors.dark_green,
//     colors,
//   );
//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={handleRefresh}
//             bounces={false}
//             alwaysBounceVertical={false}
//             directionalLockEnabled={true}
//             colors={[colors.light_green, colors.yellow, colors.red]} // Set your desired refresh indicator colors
//           />
//         }>
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => navigation.openDrawer()}>
//             <Image style={styles.imagestyle} source={globalPath.Menu} />
//           </TouchableOpacity>

//           <View style={styles.userInfoContainer}>
//             <Image
//               style={styles.userimagestyle}
//               source={globalPath.User}
//               resizeMode="contain"
//             />
//             <Text style={styles.userstyle}>{currentuser}</Text>
//           </View>
//         </View>

//         {/* <View style={styles.section1}>
//           <View style={{flexDirection: 'row', alignItems: 'center'}}>
//             <Image style={styles.clockImg} source={globalPath.Clock} />
//             <Text
//               style={{
//                 fontWeight: '600',
//                 fontSize: responsiveFontSize(1.8),
//                 color: colors.dark_green,
//               }}>
//               {time}
//             </Text>
//           </View>
//           <View
//             style={{
//               flexDirection: 'column',
//               paddingHorizontal: responsiveWidth(2),
//             }}>
//             <Text
//               style={{
//                 color: colors.dark_green,
//                 fontWeight: '500',
//                 fontSize: responsiveFontSize(1.4),
//               }}>
//               {year}
//             </Text>
//             <Text
//               style={{
//                 color: colors.dark_green,
//                 fontWeight: '700',
//                 fontSize: responsiveFontSize(1.8),
//               }}>
//               {formattedDate}
//             </Text>
//           </View>
//         </View> */}
//         {/* <View style={styles.colourview}>
//           <View style={styles.rowContainer}>
//             <View
//               style={[
//                 styles.smallview,
//                 {backgroundColor: colors.light_green},
//               ]}></View>
//             <Text style={styles.rangetextcolour}>0 - 10</Text>
//           </View>
//           <View style={styles.rowContainer}>
//             <View
//               style={[
//                 styles.smallview,
//                 {backgroundColor: colors.yellow},
//               ]}></View>
//             <Text style={styles.rangetextcolour}>11 - 35</Text>
//           </View>
//           <View style={styles.rowContainer}>
//             <View style={styles.smallview}></View>
//             <Text style={styles.rangetextcolour}>36 - 100</Text>
//           </View>
//         </View> */}
//         <View style={styles.main}>
//           <View style={styles.section2}>
//             <View
//               style={[
//                 styles.outerview,
//                 {height: Platform.OS === 'ios' ? hp(23) : hp(26.5)},
//               ]}>
//               {outloader ? (
//                 <View
//                   style={{
//                     flex: 1,
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                   }}>
//                   <Lottie
//                     source={require('../assets/animations/loader.json')}
//                     style={styles.loader}
//                     speed={2}
//                     autoPlay
//                     loop
//                   />
//                 </View>
//               ) : DataForOutDoor ? (
//                 <>
//                   <View style={styles.humidityMainView}>
//                     <View style={styles.humidityView}>
//                       <Text style={styles.humidityText}>Outdoor</Text>
//                     </View>
//                     <View style={[styles.humidityView]}>
//                       <Image
//                         style={{
//                           height: responsiveHeight(1.9),
//                           width: responsiveHeight(1.9),
//                           marginLeft: responsiveWidth(2),
//                           tintColor:
//                             OutdoorHumidity &&
//                             typeof OutdoorHumidity === 'number'
//                               ? OutdoorHumidity < 50
//                                 ? colors.red
//                                 : OutdoorHumidity > 50 && OutdoorHumidity < 60
//                                 ? colors.yellow
//                                 : OutdoorHumidity > 60 && OutdoorHumidity <= 79
//                                 ? colors.light_green
//                                 : OutdoorHumidity > 79 && OutdoorHumidity <= 90
//                                 ? colors.yellow
//                                 : OutdoorHumidity > 90
//                                 ? colors.red
//                                 : colors.light_zinc
//                               : colors.light_zinc,
//                         }}
//                         source={globalPath.HumidityIcon}
//                         resizeMode="contain"
//                       />
//                       <Text style={styles.humidityText}>{OutdoorHumidity}</Text>
//                     </View>
//                   </View>

//                   <View
//                     style={[
//                       styles.sppedoview,
//                       {marginTop: responsiveHeight(1)},
//                     ]}>
//                     <RNSpeedometer
//                       value={OutdoorTempC}
//                       size={responsiveHeight(15)}
//                       minValue={0}
//                       maxValue={100}
//                       allowedDecimals={4}
//                       minMaxFont={{
//                         fontSize: responsiveScreenFontSize(1.8),
//                         color: colors.zinc,
//                       }}
//                       imageStyle={{
//                         height: responsiveHeight(15.5),
//                         width: responsiveHeight(15),
//                       }}
//                       labels={outdoorArray}
//                       labelStyle={{
//                         fontSize:
//                           deviceWidth > 500
//                             ? responsiveFontSize(1.5)
//                             : Platform.OS === 'ios'
//                             ? responsiveFontSize(2)
//                             : responsiveFontSize(2.5),
//                         color: colors.dark_green,
//                       }}
//                       labelNoteStyle={{
//                         fontSize:
//                           deviceWidth > 500
//                             ? responsiveFontSize(1)
//                             : Platform.OS === 'ios'
//                             ? responsiveFontSize(2)
//                             : responsiveFontSize(2),
//                         // backgroundColor:"red"
//                       }}
//                     />
//                   </View>

//                   <View
//                     style={[
//                       styles.sppedoview,
//                       {
//                         marginTop:
//                           Platform.OS === 'ios'
//                             ? responsiveHeight(7)
//                             : responsiveHeight(9),
//                       },
//                     ]}></View>
//                 </>
//               ) : (
//                 <View
//                   style={{
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     flex: 1,
//                   }}>
//                   <Image
//                     source={globalPath.NoDataImg}
//                     style={{
//                       height: responsiveHeight(15),
//                       width: responsiveHeight(15),
//                       resizeMode: 'contain',
//                     }}
//                   />
//                 </View>
//               )}
//             </View>
//             <View
//               style={{
//                 // height: responsiveHeight(2),
//                 height: responsiveHeight(3.5),
//                 marginHorizontal: responsiveWidth(2),
//                 marginTop: responsiveHeight(1),
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 // borderWidth: 1,
//                 // borderColor: colors.dark_green,
//                 paddingHorizontal: responsiveWidth(2),
//                 backgroundColor: '#fff',
//                 borderRadius: responsiveHeight(0.5),
//                 // paddingVertical: responsiveHeight(0.04)
//               }}>
//               <View style={{flexDirection: 'row', alignItems: 'center'}}>
//                 <Text
//                   style={{
//                     fontWeight: '600',
//                     fontSize: responsiveFontSize(1.5),
//                     color: colors.dark_green,
//                   }}>
//                   {outdoorTime}
//                 </Text>
//               </View>
//               <View
//                 style={{
//                   alignItems: 'center',
//                   justifyContent: 'center',

//                   height: responsiveHeight(2),
//                 }}>
//                 <Text
//                   style={{
//                     fontWeight: '600',
//                     fontSize: responsiveFontSize(1.5),
//                     color: colors.dark_green,
//                   }}>
//                   {outdoorDate}
//                 </Text>
//               </View>
//             </View>
//           </View>

//           <View style={styles.section2}>
//             <View
//               style={[
//                 styles.outerview,
//                 {height: Platform.OS === 'ios' ? hp(23) : hp(26.5)},
//               ]}>
//               {outloader ? (
//                 <View
//                   style={{
//                     flex: 1,
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                   }}>
//                   <Lottie
//                     source={require('../assets/animations/loader.json')}
//                     style={styles.loader}
//                     speed={2}
//                     autoPlay
//                     loop
//                   />
//                 </View>
//               ) : DataForNursery ? (
//                 <>
//                   <View style={styles.humidityMainView}>
//                     <View style={styles.humidityView}>
//                       <Text style={styles.humidityText}>Nursery</Text>
//                     </View>
//                     <View style={styles.humidityView}>
//                       <Image
//                         style={{
//                           height: responsiveHeight(1.9),
//                           width: responsiveHeight(1.9),
//                           marginLeft: responsiveWidth(2),
//                           tintColor:
//                             nurseryHumidity &&
//                             typeof nurseryHumidity === 'number'
//                               ? nurseryHumidity < 50
//                                 ? colors.red
//                                 : nurseryHumidity > 50 && nurseryHumidity < 60
//                                 ? colors.yellow
//                                 : nurseryHumidity > 60 && nurseryHumidity <= 79
//                                 ? colors.light_green
//                                 : nurseryHumidity > 79 && nurseryHumidity <= 90
//                                 ? colors.yellow
//                                 : nurseryHumidity > 90
//                                 ? colors.red
//                                 : colors.light_zinc
//                               : colors.light_zinc,
//                         }}
//                         source={globalPath.HumidityIcon}
//                         resizeMode="contain"
//                       />
//                       <Text style={styles.humidityText}>{nurseryHumidity}</Text>
//                     </View>
//                   </View>
//                   <View
//                     style={[
//                       styles.sppedoview,
//                       {marginTop: responsiveHeight(1)},
//                     ]}>
//                     <RNSpeedometer
//                       value={nurseryTempC}
//                       size={responsiveHeight(15)}
//                       minValue={0}
//                       maxValue={100}
//                       allowedDecimals={4}
//                       minMaxFont={{
//                         fontSize: responsiveScreenFontSize(1.8),
//                         color: colors.zinc,
//                       }}
//                       imageStyle={{
//                         height: responsiveHeight(15.5),
//                         width: responsiveHeight(15),
//                       }}
//                       labels={nurseryArray}
//                       labelStyle={{
//                         fontSize:
//                           deviceWidth > 500
//                             ? responsiveFontSize(1.5)
//                             : Platform.OS === 'ios'
//                             ? responsiveFontSize(2)
//                             : responsiveFontSize(2.5),
//                         color: colors.dark_green,
//                       }}
//                       labelNoteStyle={{
//                         fontSize:
//                           deviceWidth > 500
//                             ? responsiveFontSize(1)
//                             : Platform.OS === 'ios'
//                             ? responsiveFontSize(2)
//                             : responsiveFontSize(2),
//                       }}
//                     />
//                   </View>

//                   <View
//                     style={[
//                       styles.sppedoview,
//                       {
//                         marginTop:
//                           Platform.OS === 'ios'
//                             ? responsiveHeight(7)
//                             : responsiveHeight(9),
//                       },
//                     ]}></View>
//                 </>
//               ) : (
//                 <View
//                   style={{
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     flex: 1,
//                   }}>
//                   <Image
//                     source={globalPath.NoDataImg}
//                     style={{
//                       height: responsiveHeight(15),
//                       width: responsiveHeight(15),
//                       resizeMode: 'contain',
//                     }}
//                   />
//                 </View>
//               )}
//             </View>
//             <View
//               style={{
//                 // height: responsiveHeight(2),
//                 height: responsiveHeight(3.5),
//                 marginHorizontal: responsiveWidth(2),
//                 marginTop: responsiveHeight(1),
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 // borderWidth: 1,
//                 // borderColor: colors.dark_green,
//                 paddingHorizontal: responsiveWidth(2),
//                 backgroundColor: '#fff',
//                 borderRadius: responsiveHeight(0.5),
//                 // paddingVertical: responsiveHeight(0.04)
//                 // backgroundColor:'red',
              
//               }}>
//               <View style={{flexDirection: 'row', alignItems: 'center'}}>
//                 <Text
//                   style={{
//                     fontWeight: '600',
//                     fontSize: responsiveFontSize(1.5),
//                     color: colors.dark_green,
//                   }}>
//                   {nurseryTime}
//                 </Text>
//               </View>
//               <View
//                 style={{
//                   alignItems: 'center',
//                   justifyContent: 'center',

//                   height: responsiveHeight(2),
//                 }}>
//                 <Text
//                   style={{
//                     fontWeight: '600',
//                     fontSize: responsiveFontSize(1.5),
//                     color: colors.dark_green,
//                   }}>
//                   {nurseryDate}
//                 </Text>
//               </View>
//             </View>
//           </View>
//         </View>

//         <View style={styles.section4}>
//           <TouchableOpacity
//             style={[
//               styles.touchableOpacity,
//               selectedButton === 'GH1' && {backgroundColor: colors.light_green},
//             ]}
//             onPress={() => {
//               setLoader(true);
//               handleButtonPress('GH1');
//               handleGreenhouseChange('GH-1');
//             }}>
//             <Image
//               source={getButtonImage('GH1')}
//               style={{
//                 height: responsiveHeight(2),
//                 width: responsiveHeight(2),
//                 marginRight: responsiveWidth(3),
//               }}
//             />
//             <Text
//               style={{
//                 color: selectedButton === 'GH1' ? 'white' : colors.dark_green,
//                 fontSize:
//                   deviceWidth > 500
//                     ? responsiveFontSize(1)
//                     : responsiveFontSize(1.6),
//               }}>
//               GH - 1
//             </Text>
//           </TouchableOpacity>
//           <View
//             style={{
//               height: responsiveHeight(3),
//               width: 1,
//               backgroundColor: colors.zinc,
//             }}></View>
//           <TouchableOpacity
//             style={[
//               styles.touchableOpacity,
//               selectedButton === 'GH2' && {backgroundColor: colors.light_green},
//             ]}
//             onPress={() => {
//               setLoader(true);
//               handleButtonPress('GH2');
//               handleGreenhouseChange('GH-2');
//             }}>
//             <Image
//               source={getButtonImage('GH2')}
//               style={{
//                 height: responsiveHeight(2),
//                 width: responsiveHeight(2),
//                 marginRight: responsiveWidth(3),
//               }}
//             />
//             <Text
//               style={{
//                 color: selectedButton === 'GH2' ? 'white' : colors.dark_green,
//                 fontSize:
//                   deviceWidth > 500
//                     ? responsiveFontSize(1)
//                     : responsiveFontSize(1.6),
//               }}>
//               GH - 2
//             </Text>
//           </TouchableOpacity>
//           <View
//             style={{
//               height: responsiveHeight(3),
//               width: 1,
//               backgroundColor: colors.zinc,
//             }}></View>

//           <TouchableOpacity
//             style={[
//               styles.touchableOpacity,
//               selectedButton === 'GH3' && {backgroundColor: colors.light_green},
//             ]}
//             onPress={() => {
//               setLoader(true);
//               handleButtonPress('GH3');
//               handleGreenhouseChange('GH-3');
//             }}>
//             <Image
//               source={getButtonImage('GH3')}
//               style={{
//                 height: responsiveHeight(2),
//                 width: responsiveHeight(2),
//                 marginRight: responsiveWidth(3),
//               }}
//             />
//             <Text
//               style={{
//                 color: selectedButton === 'GH3' ? 'white' : colors.dark_green,
//                 fontSize:
//                   deviceWidth > 500
//                     ? responsiveFontSize(1)
//                     : responsiveFontSize(1.6),
//               }}>
//               GH - 3
//             </Text>
//           </TouchableOpacity>
//         </View>
//         <View style={styles.section5}>
//           <View
//             style={[
//               styles.outerview,
//               {
//                 width: responsiveWidth(90),
//                 height:
//                   Platform.OS === 'ios'
//                     ? responsiveHeight(24)
//                     : responsiveHeight(25.5),
//                 marginHorizontal: responsiveWidth(5),
//               },
//             ]}>
//             {loader ? (
//               <View
//                 style={{
//                   flex: 1,
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                 }}>
//                 <Lottie
//                   source={require('../assets/animations/loader.json')}
//                   style={styles.loader}
//                   speed={2}
//                   autoPlay
//                   loop
//                 />
//               </View>
//             ) : DataForGreenHouse ? (
//               <>
//                 <View style={styles.humidityMainView}>
//                   <View style={styles.humidityView}>
//                     <Text style={styles.humidityText}>Green House</Text>
//                   </View>
//                   <View style={styles.humidityView}>
//                     <Image
//                       style={{
//                         height: responsiveHeight(1.9),
//                         width: responsiveHeight(1.9),
//                         marginLeft: responsiveWidth(2),
//                         tintColor:
//                           humidity && typeof humidity === 'number'
//                             ? humidity < 50
//                               ? colors.red
//                               : humidity > 50 && humidity < 60
//                               ? colors.yellow
//                               : humidity > 60 && humidity <= 79
//                               ? colors.light_green
//                               : humidity > 79 && humidity <= 90
//                               ? colors.yellow
//                               : humidity > 90
//                               ? colors.red
//                               : colors.light_zinc
//                             : colors.light_zinc,
//                       }}
//                       source={globalPath.HumidityIcon}
//                       resizeMode="contain"
//                     />
//                     <Text style={styles.humidityText}>{humidity}</Text>
//                   </View>
//                 </View>
//                 <View
//                   style={[
//                     styles.sppedoview,
//                     {marginTop: responsiveHeight(1.5)},
//                   ]}>
//                   <View
//                     style={{
//                       width: wp(83),
//                       alignItems: 'flex-end',
//                     }}></View>
//                   <RNSpeedometer
//                     value={tempC}
//                     size={responsiveHeight(15)}
//                     minValue={0}
//                     maxValue={100}
//                     allowedDecimals={3}
//                     minMaxFont={{
//                       fontSize: responsiveScreenFontSize(1.8),
//                       color: colors.zinc,
//                     }}
//                     imageStyle={{
//                       height: responsiveHeight(15.5),
//                       width: responsiveHeight(15),
//                     }}
//                     labels={greenhouseArray}
//                     labelStyle={{
//                       fontSize:
//                         deviceWidth > 500
//                           ? responsiveFontSize(1.5)
//                           : Platform.OS === 'ios'
//                           ? responsiveFontSize(2)
//                           : responsiveFontSize(3),
//                       color: colors.dark_green,
//                     }}
//                     labelNoteStyle={{
//                       fontSize:
//                         deviceWidth > 500
//                           ? responsiveFontSize(1.5)
//                           : Platform.OS === 'ios'
//                           ? responsiveFontSize(2)
//                           : responsiveFontSize(2),
//                     }}
//                   />
//                 </View>
//                 <View
//                   style={{
//                     // height: responsiveHeight(2),
//                     height: responsiveHeight(3.5),

//                     marginTop: responsiveHeight(5),
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     alignItems: 'center',
//                     // borderWidth: 1,
//                     // borderColor: colors.dark_green,
//                     paddingHorizontal: responsiveWidth(2),

//                     borderRadius: responsiveHeight(0.5),
//                     // paddingVertical: responsiveHeight(0.04)
//                   }}>
//                   <View style={{flexDirection: 'row', alignItems: 'center'}}>
//                     <Text
//                       style={{
//                         fontWeight: '600',
//                         fontSize: responsiveFontSize(1.5),
//                         color: colors.dark_green,
//                       }}>
//                       {greenHouseTime}
//                     </Text>
//                   </View>
//                   <View
//                     style={{
//                       alignItems: 'center',
//                       justifyContent: 'center',

//                       height: responsiveHeight(2),
//                     }}>
//                     <Text
//                       style={{
//                         fontWeight: '700',
//                         fontSize: responsiveFontSize(1.5),
//                         color: colors.dark_green,
//                       }}>
//                       {greenHouseDate}
//                     </Text>
//                   </View>
//                 </View>
//               </>
//             ) : (
//               <View
//                 style={{
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   flex: 1,
//                 }}>
//                 <Image
//                   source={globalPath.NoDataImg}
//                   style={{
//                     height: responsiveHeight(15),
//                     width: responsiveHeight(15),
//                     resizeMode: 'contain',
//                   }}
//                 />
//               </View>
//             )}
//           </View>
//         </View>

//         <View style={styles.section6}>
//           <View
//             style={[
//               styles.outerview,
//               {
//                 width: responsiveWidth(90),
//                 height:
//                   Platform.OS === 'ios'
//                     ? responsiveHeight(25)
//                     : responsiveHeight(26),
//                 marginHorizontal: responsiveWidth(5),
//               },
//             ]}>
//             {outloader ? (
//               <View
//                 style={{
//                   flex: 1,
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                 }}>
//                 <Lottie
//                   source={require('../assets/animations/loader.json')}
//                   style={styles.loader}
//                   speed={2}
//                   autoPlay
//                   loop
//                 />
//               </View>
//             ) : DataForWaterTank ? (
//               <>
//                 <View style={styles.humidityMainView}>
//                   <View style={styles.humidityView}>
//                     <Text style={styles.humidityText}>{TankTempC} °C</Text>
//                   </View>
//                   <View style={styles.humidityView}>
//                     <Text style={styles.humidityText}>
//                       Distance: {TankDistance}
//                     </Text>
//                   </View>
//                 </View>
//                 <View style={{alignItems: 'center', justifyContent: 'center'}}>
//                   <LiquidGauge
//                     config={{
//                       minValue: 0,
//                       maxValue: 100,
//                       circleColor: '#064273',
//                       textColor: '#1da2d8',
//                       waveTextColor: '#064273',
//                       waveColor: '#9fcffb',
//                       circleThickness: 0.1,
//                       circleFillGap: 0.05,
//                       waveRiseTime: 2000,
//                       waveAnimateTime: 1000,

//                       waveHeight: 0.07,
//                       waveCount: 4,
//                       textVertPosition: 0.7,
//                       textSize: 0.7,
//                       waveHeight: 0.2,
//                     }}
//                     value={tankLevel}
//                     width={responsiveHeight(14)}
//                     height={responsiveHeight(14)}
//                   />
//                 </View>
//                 <View
//                   style={{
//                     // height: responsiveHeight(2),
//                     height: responsiveHeight(3.5),

//                     marginTop: responsiveHeight(2.5),
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     alignItems: 'center',
//                     // borderWidth: 1,
//                     // borderColor: colors.dark_green,
//                     paddingHorizontal: responsiveWidth(2),

//                     borderRadius: responsiveHeight(0.5),
//                     // paddingVertical: responsiveHeight(0.04)
//                   }}>
//                   <View style={{flexDirection: 'row', alignItems: 'center'}}>
//                     <Text
//                       style={{
//                         fontWeight: '600',
//                         fontSize: responsiveFontSize(1.5),
//                         color: colors.dark_green,
//                       }}>
//                       {tankTime}
//                     </Text>
//                   </View>
//                   <View
//                     style={{
//                       alignItems: 'center',
//                       justifyContent: 'center',

//                       height: responsiveHeight(2),
//                     }}>
//                     <Text
//                       style={{
//                         fontWeight: '700',
//                         fontSize: responsiveFontSize(1.5),
//                         color: colors.dark_green,
//                       }}>
//                       {tankDate}
//                     </Text>
//                   </View>
//                 </View>
//               </>
//             ) : (
//               <View
//                 style={{
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   flex: 1,
//                 }}>
//                 <Image
//                   source={globalPath.NoTankData}
//                   style={{
//                     height: responsiveHeight(15),
//                     width: responsiveHeight(15),
//                     resizeMode: 'contain',
//                   }}
//                 />
//               </View>
//             )}
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default Home;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     height: deviceWidth > 500 ? hp(6) : hp(4),
//     // marginTop: Platform.OS === 'ios' ? undefined : 10,

//     flexDirection: 'row',
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     // backgroundColor:"pink"
//   },
//   section1: {
//     height: deviceWidth > 500 ? hp(7) : hp(5.5),
//     width: wp(94),
//     backgroundColor: colors.light_zinc,
//     borderRadius: responsiveHeight(1.5),
//     paddingHorizontal: responsiveWidth(2),
//     display: 'flex',
//     // paddingVertical: 5,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignSelf: 'center',
//     top: responsiveWidth(1.5),
//     alignItems: 'center',
//     marginTop: responsiveHeight(1),
//     // backgroundColor:"red"
//   },
//   main: {
//     height: Platform.OS === 'ios' ? hp(29) : hp(30),
//     marginTop: responsiveHeight(1),
//     display: 'flex',
//     flexDirection: 'row',
//     // backgroundColor: "pink"
//     // paddingHorizontal: responsiveWidth(0.5),
//   },
//   section2: {
//     width: wp(50),
//     //  backgroundColor:'yellow',

//     height: Platform.OS === 'ios' ? hp(29) : hp(30),
//   },
//   section4: {
//     ...(Platform.OS === 'ios'
//       ? {
//           // borderRadius: res,
//           height: hp(3),
//           marginTop: responsiveHeight(1),
//           alignItems: 'center',
//           justifyContent: 'center',
//           // display: 'flex',
//           flexDirection: 'row',
//           marginBottom: responsiveHeight(0.5),
//           // marginHorizontal: 60,
//           // backgroundColor: colors.red
//         }
//       : {
//           // borderRadius: 10,
//           height: hp(5.5),
//           // backgroundColor:'red',
//           alignItems: 'center',
//           justifyContent: 'center',
//           display: 'flex',
//           flexDirection: 'row',
//           marginBottom: responsiveHeight(0.5),
//           // marginHorizontal: 10,
//           marginTop:responsiveHeight(3)
//         }),
//   },

//   section5: {
//     height: Platform.OS === 'ios' ? hp(25) : hp(27),

//     // backgroundColor:'green'      
//   },
//   section6: {
//     height: Platform.OS === 'ios' ? hp(29) : hp(29),
//     // backgroundColor:'skyblue'
//   },
//   imagestyle: {
//     width: deviceWidth > 500 ? responsiveWidth(4) : responsiveWidth(6),
//     height: deviceWidth > 500 ? responsiveHeight(4) : responsiveWidth(6),
//     marginLeft: responsiveHeight(2),
//     marginTop: responsiveHeight(0.6),
//   },
//   outerview: {
//     backgroundColor: 'white',
//     // flex: 1,
//     width: responsiveWidth(46),
//     height: Platform.OS === 'ios' ? hp(22) : hp(24.5),

//     marginHorizontal: responsiveWidth(2),
//     marginTop: responsiveWidth(2),
//     borderRadius: responsiveWidth(5),
//     elevation: 7,
//   },
//   touchableOpacity: {
//     ...(Platform.OS === 'ios'
//       ? {
//           flexDirection: 'row',
//           justifyContent: 'center',
//           alignItems: 'center',
//           elevation: 7,
//           backgroundColor: colors.light_zinc,
//           width: responsiveWidth(31.5),
//           height: responsiveHeight(3),
//         }
//       : {
//           flexDirection: 'row',
//           justifyContent: 'center',
//           alignItems: 'center',
//           elevation: 7,
//           backgroundColor: colors.light_zinc,
//           width: responsiveWidth(31.5),
//           height: responsiveHeight(4),
//         }), // Conditional styling for iOS
//   },
//   sppedoview: {
//     alignSelf: 'center',
//     marginTop: Platform.OS === 'ios' ? hp(4) : hp(4),
//   },
//   humidityText: {
//     fontSize: deviceWidth > 500 ? responsiveFontSize(1.5) : undefined,
//     paddingHorizontal: responsiveWidth(2),
//     paddingVertical: responsiveHeight(0.5),
//     color: colors.dark_green,
//     fontWeight: "600"
//   },
//   humidityView: {
//     backgroundColor: colors.light_zinc,
//     borderRadius: responsiveHeight(0.8),
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   clockImg: {
//     height: responsiveHeight(2),
//     width: responsiveHeight(2),
//     marginRight: responsiveWidth(2),
//     tintColor: colors.dark_green,
//   },
//   humidityMainView: {
//     marginTop: responsiveHeight(1.5),
//     justifyContent: 'space-between',
//     flexDirection: 'row',
//     marginHorizontal: responsiveWidth(2),
//   },
//   loader: {
//     width: responsiveWidth(30),
//     height: responsiveHeight(30),
//   },
//   colourview: {
//     height: deviceWidth > 500 ? hp(4) : hp(3),
//     width: wp(94),
//     backgroundColor: 'white',
//     borderRadius: responsiveHeight(0.5),
//     paddingHorizontal: responsiveWidth(2),
//     display: 'flex',
//     // paddingVertical: 5,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     // marginHorizontal: responsiveWidth(4),
//     marginHorizontal: responsiveWidth(3),

//     top: responsiveWidth(1.5),
//     alignItems: 'center',
//     marginTop: responsiveHeight(1),
//     elevation: 3,
//   },

//   rowContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     // marginVertical: 5,
//   },
//   smallview: {
//     backgroundColor: colors.red,
//     height: responsiveWidth(2.2),
//     width: responsiveWidth(3.5),
//     marginRight: 5,
//   },
//   rangetextcolour: {
//     color: colors.dark_green,
//     fontSize:
//       deviceWidth > 500 ? responsiveFontSize(1) : responsiveFontSize(1.6),
//   },
//   userstyle: {
//     color: colors.dark_green,
//     // marginTop:
//     //   Platform.OS === 'ios'
//     //     ? responsiveHeight(1)
//     //     : responsiveHeight(1),
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: responsiveWidth(5),
//     fontSize: responsiveFontSize(2),
//   },

//   userInfoContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     // backgroundColor:"red",
//     height: deviceWidth > 500 ? hp(6) : hp(4),
//   },
//   userimagestyle: {
//     width: deviceWidth > 500 ? responsiveWidth(4) : responsiveWidth(5),
//     height: deviceWidth > 500 ? responsiveHeight(4) : responsiveWidth(5),
//     marginHorizontal: responsiveWidth(2),
//     // marginTop:responsiveWidth(0.1)
//     tintColor: colors.dark_green,
//   },
// });







































import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  DatePickerIOS,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
  Platform,
} from 'react-native';
import Lottie from 'lottie-react-native';
import {LineChart, BarChart, Grid} from 'react-native-chart-kit';
import React, {useEffect, useState} from 'react';
import {ScrollView, RefreshControl} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import MonthPicker, {
  ACTION_DATE_SET,
  ACTION_DISMISSED,
  ACTION_NEUTRAL,
} from 'react-native-month-year-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {startOfWeek, addWeeks, format} from 'date-fns';
import {SafeAreaView} from 'react-native-safe-area-context';
import {globalPath} from '../constants/globalpaths';
import {colors} from '../constants/ColorsPallets';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
 let deviceWidth = Dimensions.get('window').width;

 import { getApiUrl} from '../constants/apiConfig';  
  const Analytics = ({navigation}) => {
  const [apiMonthData, setapiMonthData] = useState([]);
  const [sortdata, setsortDATA] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState('Today');
  const [loading, setLoading] = useState(true);
  const [displayMonthlyData, setDisplayMonthlyData] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [SelectedEntryLower, setSelectedEntryLower] = useState();
  const [SelectedEntry, setSelectedEntry] = useState();
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [initialMonth, setInitialMonth] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [ActiveColor, setActiveColor] = useState('Today');
  const [ShowDate, setShowDate] = useState('');
  const [getmonth, setMonth] = useState('');
  const [getyear, setYear] = useState('');
  const [geatatchoosedate, setchoosedate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Green house');


  
  const [MonthData, setMonthData] = useState();


  const [TodayData,setTodayData] =useState()

  // const API_HOST = 'https://api.sabzorganics.com';
  // const apiEndpoints = {
  //   Level: '/?type=lvl',
  //   Tnh: '/?type=Tnh',
  //   timeStampMonth: '&timestamp__month=',
  //   timeStampYear: '&timestamp__year=',
  //   timeStampGte: '&timestamp__gte=',
  //   timeStampLte: '&timestamp__lte=',
  // };
  
  //  const getApiUrl = (endpoint, month, year,) => {
  //   const url = `${API_HOST}${apiEndpoints[endpoint]}${apiEndpoints.timeStampMonth}${month}${apiEndpoints.timeStampYear}${year}`;
  //   return ur;
   
  // };
  // const getApiUrl = (endpoint, timestampGte, timestampLte) => {
  //   const url = `${API_HOST}${apiEndpoints[endpoint]}${apiEndpoints.timeStampGte}${timestampGte}${apiEndpoints.timeStampLte}${timestampLte}`;
  //   console.log("url", url);
  //   return url; // Make sure to return the URL from the function
  // };
  

//   const getApiUrl = (endpoint, timestampGte, timestampLte, month, year) => {
//   let url;

//   if (timestampGte !== undefined && timestampLte !== undefined) {
//     url = `${API_HOST}${apiEndpoints[endpoint]}${apiEndpoints.timeStampGte}${timestampGte}${apiEndpoints.timeStampLte}${timestampLte}`;
//   } else if (month !== undefined && year !== undefined) {
//     url = `${API_HOST}${apiEndpoints[endpoint]}${apiEndpoints.timeStampMonth}${month}${apiEndpoints.timeStampYear}${year}`;
//   } else {
//     // Handle error or provide a default behavior
//     console.error('Invalid parameters provided to getApiUrl');
//   }

//   return url;
// };

  

  //states for tooltips:
  
  //Temperature Graph ToolTip:
  const [tooltipPosUpper, setTooltipPosUpper] = useState({
    x: 0,
    y: 0,
    visible: false,
    content: '',
  });
  
  //Humidity/distance graph ToolTip:
  const [tooltipPosLower, setTooltipPosLower] = useState({
    x: 0,
    y: 0,
    visible: false,
    content: '',
  });
  // states for sort Tnh data in month API:
  const [ghData, setGhData] = useState([]);
  const [nurseryData, setNurseryData] = useState([]);
  const [outdoorData, setOutdoorData] = useState([]);
  // Store all sorted data in this state for all filters
  const [FilterData, setFilterData] = useState([]);

  //States for storing TNH today data
  const [ghTodayData, setghTodayData] = useState([]);

  const [nurseryTodayData, setnurseryTodayData] = useState([]);
  const [outdoorTodayData, setoutdoorTodayData] = useState([]);

  //States for storing lvl today data
  const [ghTodaylvlData, setlvlTodayData] = useState([]);
  //Array for storing Today's Data:
  const TodayGreenHouse = [];
  const TodayOutSideData = [];
  const TodayNurSery = [];
  const TodayTank = [];
  //Array for storing Month's Data:
  const MonthGreenHouse = [];
  const MonthOutSideData = [];
  const MonthNurSery = [];
  const MonthTank = [];
 
  //Fetch Month Data for TNH:
  // const fetchMonthData = async (month, year) => {
  //   try {
  //     // const apiUrl = getApiUrl('Tnh', month, year);
  //     const apiUrlWithMonthYear = getApiUrl('Tnh', undefined, undefined, month, year);
  //     console.log("Apiurl with month and year", apiUrlWithMonthYear);

  //     const nurseryResponse = await fetch(apiUrlWithMonthYear);
  //     const countData = await nurseryResponse.json();
  //     const totalCount = countData.count;
  //     console.log('Count of Month', totalCount);
  //     const DataResponse = await fetch(`${apiUrlWithMonthYear}&limit=${totalCount}`);
  //     const MonthData = await DataResponse.json();
  //     const dtalength = MonthData.results;
  //     console.log('month data length', dtalength.length);
  //     const keywords = ['GH', 'Nursery', 'Outdoor'];

  //     // const categoryMappings = {
  //     //   'Green house': 'GH',
  //     //   'Nursery': 'Nursery',
  //     //   'Outdoor': 'Outdoor',
  //     //   // Add more mappings as needed
  //     // };
  
  //     // const keyword = categoryMappings[selectedCategory];
  
  //     // if (!keyword) {
  //     //   console.error('Invalid selectedCategory:', selectedCategory);
  //     //   return;
  //     // }
  
  //     // const dataByType = {};
  //     // const dailyAverages = {};
  //     // // Initialize dailyAverages for each keyword
  //     // keywords.forEach(kw => {
  //     //   dailyAverages[kw] = {};
  //     // });
  
  //     // MonthData.results.forEach(item => {
  //     //   const name = item.name.toUpperCase();
  //     //   const itemKeyword = keywords.find(kw =>
  //     //     name.includes(kw.toUpperCase())
  //     //   );
  
  //     //   if (itemKeyword && itemKeyword === keyword) {
  //     //     if (!dataByType[keyword]) {
  //     //       dataByType[keyword] = [];
  //     //     }
  //     //     dataByType[keyword].push(item);
  
  //     //     const date = new Date(item.timestamp).toISOString().split('T')[0];
  
  //     //     // Initialize dailyAverages for each keyword on each day
  //     //     if (!dailyAverages[keyword][date]) {
  //     //       dailyAverages[keyword][date] = {
  //     //         tempSum: 0,
  //     //         humiditySum: 0,
  //     //         count: 0,
  //     //       };
  //     //     }
  //     //     dailyAverages[keyword][date].tempSum += parseFloat(item.temp_c);
  //     //     dailyAverages[keyword][date].humiditySum += parseFloat(item.humidity);
  //     //     dailyAverages[keyword][date].count += 1;
  //     //   }
  //     // });

  //     const dataByType = {};
  //     const dailyAverages = {};
  //     // Initialize dailyAverages for each keyword
  //     keywords.forEach(keyword => {
  //       dailyAverages[keyword] = {};
  //     });
  //     MonthData.results.forEach(item => {
  //       const name = item.name.toUpperCase();
  //       const keyword = keywords.find(keyword =>
  //         name.includes(keyword.toUpperCase()),
  //       );
  //       if (keyword) {
  //         if (!dataByType[keyword]) {
  //           dataByType[keyword] = [];
  //         }
  //         dataByType[keyword].push(item);
  //         const date = new Date(item.timestamp).toISOString().split('T')[0];
  //         // Initialize dailyAverages for each keyword on each day
  //         if (!dailyAverages[keyword][date]) {
  //           dailyAverages[keyword][date] = {
  //             tempSum: 0,
  //             humiditySum: 0,
  //             count: 0,
  //           };
  //         }
  //         dailyAverages[keyword][date].tempSum += parseFloat(item.temp_c);
  //         dailyAverages[keyword][date].humiditySum += parseFloat(item.humidity);
  //         dailyAverages[keyword][date].count += 1;
  //       }
  //     });

  //     // Calculate and log daily averages for each keyword
  //     keywords.forEach(keyword => {
  //       console.log(`Average for ${keyword}:`);
  //       Object.keys(dailyAverages[keyword]).forEach(date => {
  //         const averageTemp =
  //           dailyAverages[keyword][date].tempSum /
  //           dailyAverages[keyword][date].count;
  //         const averageHumidity =
  //           dailyAverages[keyword][date].humiditySum /
  //           dailyAverages[keyword][date].count;
  //         const day = new Date(date).getDate();
  //         if (keyword == 'GH') {
  //           const G_obj = {
  //             Temp: averageTemp.toFixed(2),
  //             Humidity: averageHumidity.toFixed(2),
  //             hour: day,
  //           };
  //           MonthGreenHouse.push(G_obj);
  //         } else if (keyword == 'Nursery') {
  //           const N_obj = {
  //             Temp: averageTemp.toFixed(2),
  //             Humidity: averageHumidity.toFixed(2),
  //             hour: day,
  //           };
  //           MonthNurSery.push(N_obj);
  //         } else if (keyword == 'Outdoor') {
  //           const O_obj = {
  //             Temp: averageTemp.toFixed(2),
  //             Humidity: averageHumidity.toFixed(2),
  //             hour: day,
  //           };
  //           MonthOutSideData.push(O_obj);
  //         } else {
  //           console.log('ELSE RUN');
  //         }
  //         console.log(
  //           `   ${date}: Temp: ${averageTemp.toFixed(
  //             2,
  //           )}, Humidity: ${averageHumidity.toFixed(2)}`,
  //         );
  //       });
  //     });
  //     if (selectedCategory === 'Green house') {
  //       if (MonthGreenHouse.length > 0) {
  //         setFilterData(MonthGreenHouse);
  //         setFetchingData(false);
  //         setRefreshing(false);
  //         console.log('  Month LENGTH OF GreenHouse ', MonthGreenHouse.length);
  //         console.log(' Month Data OF GreenHouse ', MonthGreenHouse);
  //       } else {
  //         setFilterData(0);
  //         setFetchingData(false);
  //         setRefreshing(false);
  //       }
  //     } else if (selectedCategory === 'Outdoor') {
  //       if (MonthOutSideData.length > 0) {
  //         setFilterData(MonthOutSideData);
  //         setFetchingData(false);
  //         setRefreshing(false);
  //         console.log(' Month LENGTH OF OutDoor ', MonthOutSideData.length);
  //         console.log('  Month Data OF OutDoor ', MonthOutSideData);
  //       } else {
  //         setFilterData(0);
  //         setFetchingData(false);
  //         setRefreshing(false);
  //       }
  //     } else if (selectedCategory === 'Nursery') {
  //       if (MonthNurSery.length > 0) {
  //         setFilterData(MonthNurSery);
  //         setFetchingData(false);
  //         setRefreshing(false);
  //         console.log(' Month LENGTH OF Nursery ', MonthNurSery.length);
  //         console.log('Month Data OF Nursery ', MonthNurSery);
  //       } else {
  //         setFilterData(0);
  //         setFetchingData(false);
  //         setRefreshing(false);
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //     setFilterData(0);
  //     setFetchingData(false);
  //     setRefreshing(false);
  //   }
  // };

  const fetchMonthData = async (month, year) => {
    try {
      const nurseryResponse = await fetch(
        `https://api.sabzorganics.com/?type=Tnh&timestamp__month=1&timestamp__year=2024`,
      );
 
      const countData = await nurseryResponse.json();
      const totalCount = countData.count;
      console.log('Count of Month', totalCount);
 
      const DataResponse = await fetch(
        `https://api.sabzorganics.com/?type=Tnh&timestamp__month=1&timestamp__year=2024&limit=${totalCount}`,
      );
 
      const MonthData = await DataResponse.json();
      const dtalength = MonthData.results;
      console.log('month data length', dtalength.length);
 
      const keywords = ['GH', 'Nursery', 'Outdoor'];
      const categoryMappings = {
        'Green house': 'GH',
        Nursery: 'Nursery',
        Outdoor: 'Outdoor',
        // Add more mappings as needed
      };
 
      const keyword = categoryMappings[selectedCategory];
      console.log('keyword', keyword);
 
      if (!keyword) {
        console.error('Invalid selectedCategory:', selectedCategory);
        return;
      }
 
      const dataByType = {};
      const dailyAverages = {};
 
      // Initialize dailyAverages for each keyword
      keywords.forEach(keyword => {
        dailyAverages[keyword] = {};
      });
 
      MonthData.results.forEach(item => {
        const name = item.name.toUpperCase();
        if (keyword && name.includes(keyword.toUpperCase())) {
          if (!dataByType[keyword]) {
            dataByType[keyword] = [];
          }
 
          dataByType[keyword].push(item);
 
          const date = new Date(item.timestamp).toISOString().split('T')[0];
 
          // Initialize dailyAverages for each keyword on each day
          if (!dailyAverages[keyword][date]) {
            dailyAverages[keyword][date] = {
              tempSum: 0,
              humiditySum: 0,
              count: 0,
            };
          }
 
          dailyAverages[keyword][date].tempSum += parseFloat(item.temp_c);
          dailyAverages[keyword][date].humiditySum += parseFloat(item.humidity);
          dailyAverages[keyword][date].count += 1;
        }
      });
 
      const categoryData = dataByType[keyword] || [];
      setMonthData(categoryData);
      console.log(`Count of ${selectedCategory}:`, categoryData.length);
 
      // Calculate and log daily averages for each keyword
// Calculate and log daily averages for the selected category
if (categoryMappings[selectedCategory]) {
  const keyword = categoryMappings[selectedCategory];

  console.log(`Average for ${selectedCategory}:`);
  Object.keys(dailyAverages[keyword]).forEach(date => {
    const averageTemp =
      dailyAverages[keyword][date].tempSum /
      dailyAverages[keyword][date].count;
    const averageHumidity =
      dailyAverages[keyword][date].humiditySum /
      dailyAverages[keyword][date].count;
    const day = new Date(date).getDate();

    if (keyword === 'GH') {
      const G_obj = {
        Temp: averageTemp.toFixed(2),
        Humidity: averageHumidity.toFixed(2),
        hour: day,
      };
      MonthGreenHouse.push(G_obj);
    } else if (keyword === 'Nursery') {
      const N_obj = {
        Temp: averageTemp.toFixed(2),
        Humidity: averageHumidity.toFixed(2),
        hour: day,
      };
      MonthNurSery.push(N_obj);
    } else if (keyword === 'Outdoor') {
      const O_obj = {
        Temp: averageTemp.toFixed(2),
        Humidity: averageHumidity.toFixed(2),
        hour: day,
      };
      MonthOutSideData.push(O_obj);
    } else {
      console.log('ELSE RUN');
    }

    console.log(
      `   ${date}: Temp: ${averageTemp.toFixed(2)}, Humidity: ${averageHumidity.toFixed(2)}`,
    );
  });
}
    
      if (selectedCategory === 'Green house') {
        if (MonthGreenHouse.length > 0) {
          setFilterData(MonthGreenHouse);
          setFetchingData(false);
          setRefreshing(false);
          console.log(' LENGTH OF GreenHouse ', MonthGreenHouse.length);
          console.log(' Data OF GreenHouse ', MonthGreenHouse);
        } else {
          setFilterData(0);
          setFetchingData(false);
          setRefreshing(false);
        }
      } else if (selectedCategory === 'Outdoor') {
        if (MonthOutSideData.length > 0) {
          setFilterData(MonthOutSideData);
          setFetchingData(false);
          setRefreshing(false);
          console.log(' LENGTH OF OutDoor ', MonthOutSideData.length);
          console.log(' Data OF OutDoor ', MonthOutSideData);
        } else {
          setFilterData(0);
          setFetchingData(false);
          setRefreshing(false);
        }
      } else if (selectedCategory === 'Nursery') {
        if (MonthNurSery.length > 0) {
          setFilterData(MonthNurSery);
          setFetchingData(false);
          console.log(' LENGTH OF Nursery ', MonthNurSery.length);
          console.log(' Data OF Nursery ', MonthNurSery);
        } else {
          setFilterData(0);
          setFetchingData(false);
          setRefreshing(false);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setFilterData(0);
      setFetchingData(false);
      setRefreshing(false);
    }
  };
  //Fetch Month Data for Water Tank:
  const fetchlvlMonthData = async (month, year) => {
    try {
      const apiUrl = getApiUrl('Level', month, year);
      // const limitUrl = getApiUrl('limit', '', '', totalCount);
      // const fullApiUrl = `${apiUrl}${limitUrl}`;

      const apiUrlWithMonthYear = getApiUrl('Level', undefined, undefined, month, year);
      console.log("Apiurl with month and year ", apiUrlWithMonthYear);

      const nurseryResponse = await fetch(apiUrlWithMonthYear);
        // `https://api.sabzorganics.com/?type=lvl&timestamp__month=${month}&timestamp__year=${year}`,
    
      const countData = await nurseryResponse.json();
      const totalCount = countData.count;
      console.log('Count of Month', totalCount);
      
  
      const DataResponse = await fetch( `${apiUrlWithMonthYear}&limit=${totalCount}`);
      // fullApiUrl

       
      const MonthData = await DataResponse.json();
      const dtalength = MonthData.results;
      console.log('month data length of lvl', dtalength.length);
      const keywords = ['Tank'];
      const dataByType = {};
      const Tankavg = {};
      MonthData.results.forEach(item => {
        const name = item.name.toUpperCase();
        const keyword = keywords.find(keyword =>
          name.includes(keyword.toUpperCase()),
        );
        if (keyword === 'Tank') {
          if (!dataByType[keyword]) {
            dataByType[keyword] = [];
          }
          dataByType[keyword].push(item);
          const date = new Date(item.timestamp).toISOString().split('T')[0];
          if (!Tankavg[date]) {
            Tankavg[date] = {
              tempSum: 0,
              distanceSum: 0,
              count: 0,
            };
          }
          Tankavg[date].tempSum += parseFloat(item.temp_c);
          Tankavg[date].distanceSum += parseFloat(item.distance);
          Tankavg[date].count += 1;
        }
      });
      // Calculate and log daily averages for the "Tank" keyword
      console.log(`Average for Tank:`);
      Object.keys(Tankavg).forEach(date => {
        const averageTemp = Tankavg[date].tempSum / Tankavg[date].count;
        const averageDistance = Tankavg[date].distanceSum / Tankavg[date].count;
        const day = new Date(date).getDate();
        const tankObj = {
          Temp: averageTemp.toFixed(2),
          Humidity: averageDistance.toFixed(2),
          hour: day,
        };
        MonthTank.push(tankObj);
        console.log(
          `   ${date}: Temp: ${averageTemp.toFixed(
            2,
          )}, Distance: ${averageDistance.toFixed(2)}`,
        );
      });
      console.log(' LENGTH OF Tank ', MonthTank.length);
      console.log(' Data OF Tank ', Tankavg);
      if (MonthTank.length) {
        setFilterData(MonthTank);
        setFetchingData(false);
        setRefreshing(false);
      } else {
        setFilterData(0);
        setFetchingData(false);
        setRefreshing(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setFilterData(0);
      setFetchingData(false);
      setRefreshing(false);
    }
  };

  // Current Date and Time
  const [formattedDate, setFormattedDate] = useState('');
  const [yearMonth, setYearMonth] = useState('');
  useEffect(() => {

    const getCurrentDate = () => {
      // Format: Tue, Jan 26
      const formattedDateString = selectedDate.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
      // Format: 2024
      const yearString = selectedDate.getFullYear().toString();
      // Format: 2024, Dec
      const yearMonthString = selectedDate.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
      });
      // Update states
      setFormattedDate(formattedDateString);
      setYear(yearString);
      setYearMonth(yearMonthString);
    };
    getCurrentDate();
    // Update every minute
    const intervalId = setInterval(getCurrentDate, 60000);
    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [selectedFilter, selectedDate]); // Empty dependency array to run only once on mount
    useEffect(() => {
      // console.log("getApiUrl",getApiUrl)
    if (selectedFilter === 'Today') {
      setActiveColor('Today');
      const fetchData = async () => {
        setFetchingData(true);
        const formattedDate = formatDate(selectedDate);
        setShowDate(formattedDate);
        await fetchTodayData(selectedDate);
        setFetchingData(false);
        console.log('DATE ENTER ', selectedDate);
        console.log('RUN THE TODAY', TodayGreenHouse);
      };
      fetchData();
    } else if (selectedFilter === 'Month') {
      console.log('RUN THE Month');
    } else if (selectedFilter === 'Choose Date') {
      fetchDataAsync();
      console.log('RUN THE Calender');
    }
  }, [selectedDate, selectedFilter]);

  const fetchDataAsync = async () => {
    try {
      setFetchingData(true);
      if (selectedCategory === 'Green house') {
        console.log('Green House');
        setFetchingData(true);
        console.log('SHOW THE SELECTED LENGTH ', TodayGreenHouse.length);
        await fetchTodayData(selectedDate);
      } else if (selectedCategory === 'Outdoor') {
        setFetchingData(true);
        console.log('Outdoor');
        await fetchTodayData(selectedDate);
      } else if (selectedCategory === 'Nursery') {
        setFetchingData(true);
        console.log('Nursery');
        await fetchTodayData(selectedDate);
      } else if (selectedCategory === 'Water Tank') {
        setFetchingData(true);
        console.log('Water Tanks');
        await fetchLvlDataForToday(selectedDate);
      } else {
        setFetchingData(false);
        console.log('RUN THE ELSE');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    if (selectedFilter === 'Today') {
      setDatePickerVisibility(false);

      setSelectedDate(new Date());
      fetchDataAsync();
    } else if (selectedFilter === 'Month') {
      setDatePickerVisibility(false);
      if (selectedCategory === 'Water Tank') {
        setFetchingData(true);
        fetchlvlMonthData(getmonth, getyear);
      } else {
        setDatePickerVisibility(false);
        setFetchingData(true);
        fetchMonthData(getmonth, getyear);
      }
    } else if (selectedFilter === 'Choose Date') {
      console.log(' CHECK THIS CHOOSE DATE');
      fetchDataAsync();
    }
  }, [selectedCategory]);

  //Fetch Today Data for Water Tank:
  const fetchLvlDataForToday = async date => {
    try {
      const currentDate = date;
      const nextDate = new Date(currentDate);
      nextDate.setDate(currentDate.getDate() + 1);
      const formattedCurrentDate = currentDate.toISOString().split('T')[0];
      setShowDate(formattedCurrentDate);
      const formattedNextDate = nextDate.toISOString().split('T')[0];
      console.log(' LVL formattedCurrentDate', formattedCurrentDate);
      console.log('LVl formattedNextDate', formattedNextDate);
      
      const apiUrlWithTimestamps = getApiUrl('Level', formattedCurrentDate, formattedNextDate);
      console.log("Apiurl with timestamps", apiUrlWithTimestamps);

      const TodaylvlResponse = await fetch(
        // `https://api.sabzorganics.com/?type=lvl&timestamp__gte=${formattedCurrentDate}&timestamp__lte=${formattedNextDate}`,
        apiUrlWithTimestamps
        // `https://api.sabzorganics.com/?type=lvl&timestamp__gte=2024-01-27&timestamp__lte=2024-01-28`,
      );
      const countData = await TodaylvlResponse.json();
      const totalCount = countData.count;
      console.log('lvl Count of Today:', totalCount);
      const DataResponse = await fetch(
        // `${`https://api.sabzorganics.com/?type=lvl&timestamp__gte=2024-01-27&timestamp__lte=2024-01-28`}&limit=${totalCount}`,

        `${apiUrlWithTimestamps}&limit=${totalCount}`,
      );
      const TodaylvlData = await DataResponse.json();
      const dtalength = TodaylvlData.results;
      console.log('Today DATA of lvl:', dtalength.length);
      const keywords = ['Tank'];
      const dataByType = {};
      TodaylvlData.results.forEach(item => {
        const name = item.name.toUpperCase();
        const keyword = keywords.find(keyword =>
          name.includes(keyword.toUpperCase()),
        );
        if (keyword) {
          if (!dataByType[keyword]) {
            dataByType[keyword] = [];
          }
          dataByType[keyword].push(item);
          const date = new Date(item.timestamp).toISOString().split('T')[0];
        }
      });
      const hourlylvlData = {};
      TodaylvlData.results.forEach(item => {
        const name = item.name.toUpperCase();
        const keyword = keywords.find(keyword =>
          name.includes(keyword.toUpperCase()),
        );
        if (keyword) {
          const hour = new Date(item.timestamp).getHours();
          if (!hourlylvlData[keyword]) {
            hourlylvlData[keyword] = {};
          }
          if (!hourlylvlData[keyword][hour]) {
            hourlylvlData[keyword][hour] = [];
          }
          hourlylvlData[keyword][hour].push(item);
        }
      });

      Object.keys(hourlylvlData).forEach(keyword => {
        console.log(`Hourly Data for ${keyword}:`);
        Object.keys(hourlylvlData[keyword]).forEach(hour => {
          console.log(
            `   Hour ${hour}: Count - ${hourlylvlData[keyword][hour].length}`,
          );
        });
      });
      // Calculate and show average for each hour and keyword
      Object.keys(hourlylvlData).forEach(keyword => {
        console.log(`Hourly Average for ${keyword}:`);
        Object.keys(hourlylvlData[keyword]).forEach(hour => {
          const hourData = hourlylvlData[keyword][hour];
          const averageTemp =
            hourData.reduce((sum, item) => sum + parseFloat(item.temp_c), 0) /
            hourData.length;
          const averageDistance =
            hourData.reduce((sum, item) => sum + parseFloat(item.distance), 0) /
            hourData.length;
          console.log('HOUR OF LVL', hour);
          // Inside your loop
          hour = (hour % 24) + 1;
          console.log('HOUR OF LVL', hour);
          if (keyword == 'Tank') {
            const t_tank = {
              hour: hour,
              Temp: averageTemp.toFixed(2),
              Humidity: averageDistance.toFixed(2),
            };
            TodayTank.push(t_tank);
          }
          console.log(
            `   Hour ${hour}: Temp - ${averageTemp.toFixed(
              2,
            )}, Distance - ${averageDistance.toFixed(2)}`,
          );
        });
      });
      if (TodayTank.length > 0) {
        console.log(' LENGTH OF tank ', TodayTank.length);
        console.log(' Data OF T ', TodayTank);
        setFilterData(TodayTank);
        setFetchingData(false);
        setRefreshing(false);
      } else {
        setFilterData(0);
        setFetchingData(false);
        setRefreshing(false);
      }

      Object.keys(dataByType).forEach(keyword => {
        // console.log(" LOOP IS " , keyword)
        if (keyword == 'Tank') {
          setlvlTodayData(dataByType[keyword]);
          // console.log(`GH Data:`, dataByType[keyword]);
          console.log(`Count of lvl Tank:`, dataByType[keyword].length);
        } else {
          console.log('Else');
        }
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setFetchingData(false);
    }
  };

  //Fetch Today data for TNH:
  // const fetchTodayData = async date => {
  //   try {
  //     console.log(' CALENDER DATe', date);
  //     const currentDate = date;
  //     const nextDate = new Date(currentDate);
  //     nextDate.setDate(currentDate.getDate() + 1);
  //     const formattedCurrentDate = currentDate.toISOString().split('T')[0];
  //     setShowDate(formattedCurrentDate);
  //     const formattedNextDate = nextDate.toISOString().split('T')[0];
  //     console.log('formattedCurrentDate', formattedCurrentDate);
  //     console.log('formattedNextDate', formattedNextDate);

  //     // const apiUrl = getApiUrl('Tnh', formattedCurrentDate, formattedNextDate);
  //     // console.log( "Apiurl",apiUrl);

  //     const apiUrlWithTimestamps = getApiUrl('Tnh', formattedCurrentDate, formattedNextDate);
  //     console.log("Apiurl with timestamps", apiUrlWithTimestamps);
      
  //     const TodayResponse = await fetch(
  
  //       // apiUrlWithTimestamps
  //       `https://api.sabzorganics.com/?type=tnh&timestamp__gte=2024-02-06&timestamp__lte=2024-02-07`
  //     );
  //     const countData = await TodayResponse.json();
  //     const totalCount = countData.count;
  //     console.log('Count of Today tnh:', totalCount);
  //     const DataResponse = await fetch(
  //       // `${apiUrlWithTimestamps}&limit=${totalCount}`,
  //       `https://api.sabzorganics.com/?type=tnh&timestamp__gte=2024-02-06&timestamp__lte=2024-02-07&limit=${totalCount}`
  //     );
  //     const TodayData = await DataResponse.json();
  //     const dtalength = TodayData.results;
  //     console.log('Today DATA of tnh:', dtalength.length);
  //     const keywords = ['GH', 'Nursery', 'Outdoor'];
      
  //     const categoryMappings = {
  //       'Green house': 'GH',
  //       'Nursery': 'Nursery',
  //       'Outdoor': 'Outdoor',
  //       'Water Tank': 'Tank'
  //       // Add more mappings as needed
  //     };
      
  //     const keyword= categoryMappings[selectedCategory];
      
  //     if (!keyword) {
  //       console.error('Invalid selectedCategory:', selectedCategory);
  //       return;
  //     }
      
  //     const dataByType = {};
      
  //     dtalength.forEach(item => {
  //       const name = item.name.toUpperCase();
      
  //       // Use the mapped keyword instead of finding it in the array
  //       if (keyword && name.includes(keyword.toUpperCase())) {
  //         if (!dataByType[keyword]) {
  //           dataByType[keyword] = [];
  //         }
  //         dataByType[keyword].push(item);
  //         const date = new Date(item.timestamp).toISOString().split('T')[0];
  //       }
  //     });
      
  //     if (selectedCategory) {
  //       const categoryData = dataByType[keyword] || [];
  //       setTodayData(categoryData);
  //       console.log("categoryData",categoryData)
      
  //       console.log(`Count of ${selectedCategory}:`, categoryData.length);
  //     } else {
  //       console.log('else');
  //     }
      

  //     // if (selectedCategory && dataByType[selectedCategory]) {
  //     //   setTodayData(dataByType[selectedCategory]);
  //     //   console.log(`Count of ${selectedCategory}:`, dataByType[selectedCategory].length);
  //     // } 
      
      
  //     // else {
  //     //   // console.log('else');
  //     // }
  //     await sortDATA(dtalength,categoryData,keywords);
      
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   } finally {
  //     setLoading(false);
  //     setFetchingData(false);
  //     setRefreshing(false);
  //   }
  // };
  
  // //Sort Today data of TNH:
  // const sortDATA = async (dtalength, keywords,selectedCategory) => {
  //   // console.log('INSIDE THE SORT', dtalength);
  //   if (dtalength.length > 0) {
  //     const hourlyData = {};
  //     dtalength.forEach(item => {
  //       const name = item.name.toUpperCase();
  //       const keyword = keywords.find(keyword =>
  //         name.includes(keyword.toUpperCase()),
  //       );
  //       if (keyword) {
  //         const hour = new Date(item.timestamp).getHours();
  //         if (!hourlyData[keyword]) {
  //           hourlyData[keyword] = {};
  //         }
  //         if (!hourlyData[keyword][hour]) {
  //           hourlyData[keyword][hour] = [];
  //         }
  //         hourlyData[keyword][hour].push(item);
  //       }
  //     });


  //     Object.keys(hourlyData).forEach(keyword => {
  //       console.log(`Hourly Data for ${keyword}:`);
  //       Object.keys(hourlyData[keyword]).forEach(hour => {
  //         console.log(
  //           `   Hour ${hour}: Count - ${hourlyData[keyword][hour].length}`,
  //         );
  //       });
  //     });
  //     // Calculate and show average for each hour and keyword
  //     Object.keys(hourlyData).forEach(keyword => {
  //       console.log(`Hourly Average for ${keyword}:`);
  //       Object.keys(hourlyData[keyword]).forEach(hour => {
  //         const hourData = hourlyData[keyword][hour];
  //         const averageTemp =
  //           hourData.reduce((sum, item) => sum + parseFloat(item.temp_c), 0) /
  //           hourData.length;
  //         const averageHumidity =
  //           hourData.reduce((sum, item) => sum + parseFloat(item.humidity), 0) /
  //           hourData.length;
  //         hour = (hour % 24) + 1;
  //         if (keyword == 'GH') {
  //           const t_gh = {
  //             hour: hour,
  //             Temp: averageTemp.toFixed(2),
  //             Humidity: averageHumidity.toFixed(2),
  //           };
  //           TodayGreenHouse.push(t_gh);
  //         } else if (keyword == 'Nursery') {
  //           const t_nur = {
  //             hour: hour,
  //             Temp: averageTemp.toFixed(2),
  //             Humidity: averageHumidity.toFixed(2),
  //           };
  //           TodayNurSery.push(t_nur);
  //         } else if (keyword == 'Outdoor') {
  //           const t_out = {
  //             hour: hour,
  //             Temp: averageTemp.toFixed(2),
  //             Humidity: averageHumidity.toFixed(2),
  //           };
  //           TodayOutSideData.push(t_out);
  //         }
  //         console.log(
  //           `   Hour ${hour}: Temp - ${averageTemp.toFixed(
  //             2,
  //           )}, Humidity - ${averageHumidity.toFixed(2)}`,
  //         );
  //       });
  //     });
  //     if (selectedCategory === 'Green house') {
  //       if (TodayGreenHouse.length > 0) {
  //         setFilterData(TodayGreenHouse);
  //         setFetchingData(false);
  //         setRefreshing(false);
  //         console.log(' LENGTH OF GreenHouse ', TodayGreenHouse.length);
  //         console.log(' Data OF GreenHouse ', TodayGreenHouse);
  //       } else {
  //         setFilterData(0);
  //         setFetchingData(false);
  //         setRefreshing(false);
  //       }
  //     } else if (selectedCategory === 'Outdoor') {
  //       if (TodayOutSideData.length > 0) {
  //         setFilterData(TodayOutSideData);
  //         setFetchingData(false);
  //         setRefreshing(false);
  //         console.log(' LENGTH OF OutDoor ', TodayOutSideData.length);
  //         console.log(' Data OF OutDoor ', TodayOutSideData);
  //       } else {
  //         setFilterData(0);
  //         setFetchingData(false);
  //         setRefreshing(false);
  //       }
  //     } else if (selectedCategory === 'Nursery') {
  //       if (TodayOutSideData.length > 0) {
  //         setFilterData(TodayNurSery);
  //         setFetchingData(false);
  //         console.log(' LENGTH OF Nursery ', TodayNurSery.length);
  //         console.log(' Data OF Nursery ', TodayNurSery);
  //       } else {
  //         setFilterData(0);
  //         setFetchingData(false);
  //         setRefreshing(false);
  //       }
  //     }
  //   } else {
  //     setFilterData(0);
  //     setFetchingData(false);
  //     setRefreshing(false);
  //   }
  // };



  const fetchTodayData = async date => {
    try {
      setFetchingData(true);
 
      const TodayResponse = await fetch(
        // apiUrlWithTimestamps
        `https://api.sabzorganics.com/?type=tnh&timestamp__gte=2024-02-06&timestamp__lte=2024-02-07`,
      );
      const countData = await TodayResponse.json();
      const totalCount = countData.count;
      console.log('Count of Today tnh:', totalCount);
      const DataResponse = await fetch(
        // `${apiUrlWithTimestamps}&limit=${totalCount}`,
        `https://api.sabzorganics.com/?type=tnh&timestamp__gte=2024-02-06&timestamp__lte=2024-02-07&limit=${totalCount}`,
      );
      const TodayData = await DataResponse.json();
      const dtalength = TodayData.results;
      console.log('Today DATA of tnh:', dtalength.length);
      const keywords = ['GH', 'Nursery', 'Outdoor'];
 
      const categoryMappings = {
        'Green house': 'GH',
        Nursery: 'Nursery',
        Outdoor: 'Outdoor',
        'Water Tank': 'Tank',
        // Add more mappings as needed
      };
 
      const keyword = categoryMappings[selectedCategory];
 
      if (!keyword) {
        console.error('Invalid selectedCategory:', selectedCategory);
        return;
      }
 
      const dataByType = {};
      TodayData.results.forEach(item => {
        const name = item.name.toUpperCase();
        if (keyword && name.includes(keyword.toUpperCase())) {
          if (!dataByType[keyword]) {
            dataByType[keyword] = [];
          }
          dataByType[keyword].push(item);
        }
      });
 
      const categoryData = dataByType[keyword] || [];
      setTodayData(categoryData);
      console.log(`Count of ${selectedCategory}:`, categoryData.length);
      await sortDATA(categoryData, keywords);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
    }
  };
 
  //Sort Today data of TNH:
  const sortDATA = async (categoryData, keywords) => {
    if (categoryData.length > 0) {
      const hourlyData = {};
      categoryData.forEach(item => {
        const name = item.name.toUpperCase();
        const keyword = keywords.find(keyword =>
          name.includes(keyword.toUpperCase()),
        );
        if (keyword) {
          const hour = new Date(item.timestamp).getHours();
          if (!hourlyData[keyword]) {
            hourlyData[keyword] = {};
          }
          if (!hourlyData[keyword][hour]) {
            hourlyData[keyword][hour] = [];
          }
          hourlyData[keyword][hour].push(item);
        }
      });
 
      Object.keys(hourlyData).forEach(keyword => {
        console.log(`Hourly Data for ${keyword}:`);
        Object.keys(hourlyData[keyword]).forEach(hour => {
          console.log(
            `   Hour ${hour}: Count - ${hourlyData[keyword][hour].length}`,
          );
        });
      });
      // Calculate and show average for each hour and keyword
      Object.keys(hourlyData).forEach(keyword => {
        console.log(`Hourly Average for ${keyword}:`);
        Object.keys(hourlyData[keyword]).forEach(hour => {
          const hourData = hourlyData[keyword][hour];
          const averageTemp =
            hourData.reduce((sum, item) => sum + parseFloat(item.temp_c), 0) /
            hourData.length;
          const averageHumidity =
            hourData.reduce((sum, item) => sum + parseFloat(item.humidity), 0) /
            hourData.length;
          hour = (hour % 24) + 1;
          if (keyword == 'GH') {
            const t_gh = {
              hour: hour,
              Temp: averageTemp.toFixed(2),
              Humidity: averageHumidity.toFixed(2),
            };
            TodayGreenHouse.push(t_gh);
          } else if (keyword == 'Nursery') {
            const t_nur = {
              hour: hour,
              Temp: averageTemp.toFixed(2),
              Humidity: averageHumidity.toFixed(2),
            };
            TodayNurSery.push(t_nur);
          } else if (keyword == 'Outdoor') {
            const t_out = {
              hour: hour,
              Temp: averageTemp.toFixed(2),
              Humidity: averageHumidity.toFixed(2),
            };
            TodayOutSideData.push(t_out);
          }
          console.log(
            `   Hour ${hour}: Temp - ${averageTemp.toFixed(
              2,
            )}, Humidity - ${averageHumidity.toFixed(2)}`,
          );
        });
      });
      if (selectedCategory === 'Green house') {
        if (TodayGreenHouse.length > 0) {
          setFilterData(TodayGreenHouse);
          setFetchingData(false);
          setRefreshing(false);
          console.log(' LENGTH OF GreenHouse ', TodayGreenHouse.length);
          console.log(' Data OF GreenHouse ', TodayGreenHouse);
        } else {
          setFilterData(0);
          setFetchingData(false);
          setRefreshing(false);
        }
      } else if (selectedCategory === 'Outdoor') {
        if (TodayOutSideData.length > 0) {
          setFilterData(TodayOutSideData);
          setFetchingData(false);
          setRefreshing(false);
          console.log(' LENGTH OF OutDoor ', TodayOutSideData.length);
          console.log(' Data OF OutDoor ', TodayOutSideData);
        } else {
          setFilterData(0);
          setFetchingData(false);
          setRefreshing(false);
        }
      } else if (selectedCategory === 'Nursery') {
        if (TodayOutSideData.length > 0) {
          setFilterData(TodayNurSery);
          setFetchingData(false);
          console.log(' LENGTH OF Nursery ', TodayNurSery.length);
          console.log(' Data OF Nursery ', TodayNurSery);
        } else {
          setFilterData(0);
          setFetchingData(false);
          setRefreshing(false);
        }
      }
    } else {
      setFilterData(0);
      setFetchingData(false);
      setRefreshing(false);
    }
  };
  const formatDate = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };
  const onRefresh = () => {
    setRefreshing(true); // Set refreshing to true when the user pulls down to refresh
    if (selectedFilter == 'Month') {
      console.log('Month DATA');
      // await fetchMonthData();
      if (selectedCategory === 'Water Tank') {
        setFetchingData(true);
        fetchlvlMonthData(getmonth, getyear);
      } else {
        setDatePickerVisibility(false);
        setFetchingData(true);
        fetchMonthData(getmonth, getyear);
      }
    } else if (selectedFilter === 'Choose Date') {
      console.log('SELECTED DATE');

      setFetchingData(true);
      fetchDataAsync();
    } else {
      console.log(' TODAY');
      setFetchingData(true);
      fetchDataAsync();
    }
  };
  const formatTimestamp = timestamp => {
    const date = new Date(timestamp);
    const hours = (date.getHours() + 1) % 24;
    return hours === 0 ? 24 : hours;
  };
  // TOOLTIP function for TEMPERATURE Graph:
  const handleDotPressUpper = (x, y, index) => {
    if (index >= 0 && index < FilterData.length) {
      const currentEntry = FilterData[index];
      setTooltipPosUpper({x, y, visible: true, content: {currentEntry}});
      setSelectedEntry(currentEntry);
    }
  };

  // TOOLTIP function for Humidity/distance Graph:
    const handleDotPressLower = (x, y, index) => {
    if (index >= 0 && index < FilterData.length) {
      const currentEntry = FilterData[index];
      setTooltipPosLower({x, y, visible: true, content: {currentEntry}});
      setSelectedEntryLower(currentEntry);
    }
  };
  const Tooltip = ({x, y, children}) => {
    const [isVisibleupper, setIsVisibleupper] = useState(true);
    const hideTooltipupper = () => {
      setIsVisibleupper(false);
    };
    // Use useEffect to set up the timeout when the component mounts
    useEffect(() => {
      const timeoutId = setTimeout(() => {
        setTooltipPosUpper({x: 0, y: 0, visible: false, content: ''});
        hideTooltipupper();
      }, 1000);
      // Clear the timeout when the component unmounts or when isVisible becomes false
      return () => clearTimeout(timeoutId);
    }, []); // Empty dependency array ensures the effect runs only once when the component mounts

    const timestamp = children.currentEntry.created_at;
    const date = new Date(timestamp);
    const formattedTime = date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    });
  //Styling of Temp ToolTip:
    return isVisibleupper ? (
      <TouchableOpacity onPress={hideTooltipupper}>
        <View
          style={{
            position: 'absolute',
            left:x-responsiveWidth(20),
            top: y-responsiveWidth(-0.5),
            backgroundColor: 'rgba(0, 1, 1, 0.7)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 2,
            borderRadius: 5,
            width: responsiveWidth(28),
            height: responsiveHeight(3),
          }}>
          <Text
            style={
              styles.tooltipText
            }>{`Temp:${children.currentEntry.Temp}°C`}</Text>
        </View>
      </TouchableOpacity>
    ) : null;
  };

  const HumidityToolTip = ({x, y, children}) => {
    const [isVisiblelower, setIsVisiblelower] = useState(true);
    const hideTooltiplower = () => {
      setIsVisiblelower(false);
    };
    useEffect(() => {
      const timeoutId = setTimeout(() => {
        setTooltipPosLower({x: 0, y: 0, visible: false, content: ''});
        hideTooltiplower();
      }, 1000);

      // Clear the timeout when the component unmounts or when isVisible becomes false
      return () => clearTimeout(timeoutId);
    }, []); // Empty dependency array ensures the effect runs only once when the component mounts
    const timestamp = children.currentEntry.created_at;
    const date = new Date(timestamp);
    const formattedTime = date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    });

   //Styling For Humidity ToolTip:
    return isVisiblelower ? (
      <TouchableOpacity onPress={hideTooltiplower}>
        <View
          style={{
            position: 'absolute',
            left:x-responsiveWidth(20),
            top: y-responsiveWidth(-0.5),
            backgroundColor: 'rgba(0, 1, 1, 0.7)',
            padding: 2,
            borderRadius: 5,
            width: responsiveWidth(28),
            height: responsiveHeight(3),
          }}>
          {selectedCategory === 'Water Tank' ? (
            <Text style={styles.tooltipText}>
              {` Distance: ${children.currentEntry.Humidity}`}
            </Text>
          ) : (
            <Text style={styles.tooltipText}>
              {` Humidity: ${children.currentEntry.Humidity}`}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    ) : null;
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleDateConfirm = date => {
    const yearString = date.getFullYear().toString();
    const formattedDateString = date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    setYear(yearString);
    setFormattedDate(formattedDateString);
    setSelectedDate(date);
    setFetchingData(true);
    setDatePickerVisibility(false);
    setSelectedFilter('Choose Date');
    setActiveColor('Choose Date');
    setchoosedate(date);
    console.log('Choose date is ', date);
    hideDatePicker();
  };
  const fetchChooseDateData = async date => {
    try {
      const formattedDate = formatDate(date);
      setShowDate(formattedDate);
      console.log('formattedDate', formattedDate);

      const response = await fetch(
        `http://gh.zirvik.com/api/?search=${formattedDate}`,
      );
      const json = await response.json();

      console.log('COUNTER Length ', json.count);
      const currentcount = json.count;

      const response1 = await fetch(
        `http://gh.zirvik.com/api/?limit=${currentcount}&search=${formattedDate}`,
      );

      const Todaydata = await response1.json();

      console.log('TODAY DATA', Todaydata);

      await sortDATA(Todaydata.results);
      setDisplayMonthlyData(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);

      setFetchingData(false); // Set fetchingData to false in both success and error cases
    }
  };
  const getTodayDATA = () => {
    setSelectedDate(new Date());
    setSelectedFilter('Today');
  };
  const getMonthData = () => {
    setShowMonthPicker(true);
  };
  const handleMonthChange = async (event, newDate) => {
    console.log(' ENTER IN THIS ');
    switch (event) {
      case ACTION_DATE_SET:
        setShowMonthPicker(false);
        setFetchingData(true);
        setSelectedFilter('Month');
        setSelectedDate(newDate);
        console.log(' Succes MODAL');
        console.log(newDate);
        setActiveColor('Month');
        const formattedDate = `${newDate.getFullYear()}-${(
          newDate.getMonth() + 1
        )
          .toString()
          .padStart(2, '0')}`;
        setShowDate(formattedDate);
        console.log(' c ', formattedDate);
        const [year, month] = formattedDate.split('-');
        setMonth(month);
        setYear(year);
        console.log(month, year);
        console.log(' MONTH MODAL STATE IS ', showMonthPicker);
        if (selectedCategory === 'Water Tank') {
          await fetchlvlMonthData(month, year);
        } else {
          await fetchMonthData(month, year);
        }
        break;
      case ACTION_NEUTRAL:
        console.log('Neutral   MODAL');
        console.log(newDate);
        setShowMonthPicker(false);
        break;
      case ACTION_DISMISSED:
        setShowMonthPicker(false);
      default:
        console.log('CANCEL THE MODAL');
        setShowMonthPicker(false);
    }
  };
  const getISODay = date => {
    return format(date, 'yyyy-MM-dd');
  };
  const getMostRecentEntriesByDay = async data => {
    const days = {};

    // Iterate through each data entry
    data.forEach(entry => {
      // Extract the timestamp from the entry
      const timestamp = entry.created_at;

      // Convert the timestamp to a JavaScript Date object
      const date = new Date(timestamp);

      // Get the ISO day number for the date
      const isoDay = getISODay(date);

      // Replace null values with 0
      entry.temp_c = entry.temp_c !== null ? parseFloat(entry.temp_c) : 0;
      entry.temp_f = entry.temp_f !== null ? parseFloat(entry.temp_f) : 0;
      entry.humidity = entry.humidity !== null ? parseFloat(entry.humidity) : 0;

      // Check if the isoDay key exists in the days object, if not, initialize it
      if (!days[isoDay]) {
        days[isoDay] = entry;
      } else {
        // Check if the current entry is more recent than the one already stored for the day
        const storedTimestamp = new Date(days[isoDay].created_at);
        if (date > storedTimestamp) {
          days[isoDay] = entry;
        }
      }
    });

    // Now you have the most recent data entry for each day in the days object
    console.log('DAILY DATA:', Object.values(days));

    return Object.values(days);
  };
  const handleButtonPress = buttonName => {
    setSelectedCategory(buttonName);
    console.log(' BUTON NAME IS ', buttonName);
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Image style={styles.imagestyle} source={globalPath.Menu} />
          </TouchableOpacity>
        </View>
        <View style={[styles.section4, {marginTop: responsiveHeight(1)}]}>
          <TouchableOpacity
            style={{
              backgroundColor:
                ActiveColor === 'Today' ? '#96B45E' : colors.light_zinc,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              // elevation: 7,
              width: (deviceWidth - responsiveWidth(2) * 2) / 3,
              height:
                Platform.OS === 'ios'
                  ? responsiveHeight(3)
                  : responsiveHeight(4),
            }}
            onPress={getTodayDATA}>
            <Text
              style={{
                color: ActiveColor === 'Today' ? 'white' : colors.dark_green,
                fontSize: responsiveFontSize(1.5),
                fontWeight: ActiveColor === 'Today' ? '900' : '400',
              }}>
              {' '}
              Today
            </Text>
          </TouchableOpacity>
          <View
            style={{
              height:
                Platform.OS === 'ios'
                  ? responsiveHeight(3)
                  : responsiveHeight(4),
              width: 1,
              backgroundColor: colors.zinc,
            }}></View>
          <TouchableOpacity
            style={{
              backgroundColor:
                ActiveColor === 'Month' ? '#96B45E' : colors.light_zinc,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              // elevation: 7,
              width: (deviceWidth - responsiveWidth(2) * 2) / 3,
              height:
                Platform.OS === 'ios'
                  ? responsiveHeight(3)
                  : responsiveHeight(4),
            }}
            onPress={getMonthData}>
            <Text
              style={{
                color: ActiveColor === 'Month' ? 'white' : colors.dark_green,
                fontSize: responsiveFontSize(1.5),
                fontWeight: ActiveColor === 'Month' ? '900' : '400',
              }}>
              Month
            </Text>
          </TouchableOpacity>
          <View
            style={{
              height:
                Platform.OS === 'ios'
                  ? responsiveHeight(3)
                  : responsiveHeight(4),
              width: 1,
              backgroundColor: colors.zinc,
            }}></View>

          <TouchableOpacity
            style={{
              backgroundColor:
                ActiveColor === 'Choose Date' ? '#96B45E' : colors.light_zinc,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              // elevation: 7,
              width: (deviceWidth - responsiveWidth(2) * 2) / 3,
              height:
                Platform.OS === 'ios'
                  ? responsiveHeight(3)
                  : responsiveHeight(4),
            }}
            onPress={showDatePicker}>
            <Text
              style={{
                color:
                  ActiveColor === 'Choose Date' ? 'white' : colors.dark_green,
                fontSize: responsiveFontSize(1.5),
                fontWeight: ActiveColor === 'Choose Date' ? '900' : '400',
              }}>
              Calender
            </Text>
          </TouchableOpacity>
          {isDatePickerVisible ? (
            <View>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleDateConfirm}
                onCancel={hideDatePicker}
              />
            </View>
          ) : undefined}
        </View>

        <View style={styles.section1}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image style={styles.clockImg} source={globalPath.FilterIcon} />
            <Text
              style={{
                fontWeight: '600',
                fontSize: responsiveFontSize(1.8),
                color: colors.dark_green,
              }}>
              {selectedCategory}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'column',
              paddingHorizontal: responsiveWidth(2),
            }}>
            {ActiveColor === 'Today' && (
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
                  {getyear}
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
            )}
            {ActiveColor === 'Month' && (
              <View
                style={{
                  paddingHorizontal: responsiveWidth(2),
                }}>
                <Text
                  style={{
                    color: colors.dark_green,
                    fontWeight: '700',
                    fontSize: responsiveFontSize(1.8),
                  }}>
                  {yearMonth}
                </Text>
              </View>
            )}
            {ActiveColor === 'Choose Date' && (
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
                  {getyear}
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
            )}
          </View>
        </View>

        <View style={[styles.section4, {marginTop: responsiveHeight(1)}]}>
          <ScrollView
            horizontal
            style={{
              height:
                Platform.OS === 'ios'
                  ? responsiveHeight(3)
                  : responsiveHeight(4),
            }}>
            <TouchableOpacity
              style={[
                styles.touchableOpacity,
                {
                  backgroundColor:
                    selectedCategory == 'Green house'
                      ? colors.light_green
                      : colors.light_zinc,
                },
              ]}
              onPress={() => handleButtonPress('Green house')}>
              <Image
                source={globalPath.Gh_grey}
                style={{
                  height: responsiveHeight(2.2),
                  width: responsiveHeight(2.2),
                  marginRight: responsiveWidth(3),
                  tintColor:
                    selectedCategory === 'Green house' ? 'white' : '#888',
                }}
              />

              <Text
                style={{
                  color:
                    selectedCategory === 'Green house'
                      ? 'white'
                      : colors.dark_green,
                  fontSize: responsiveFontSize(1.5),
                  fontWeight:
                    selectedCategory === 'Green house' ? '900' : '400',
                }}>
                {/* Green house */}
              </Text>
            </TouchableOpacity>
            <View
              style={{
                height:
                  Platform.OS === 'ios'
                    ? responsiveHeight(3)
                    : responsiveHeight(4),
                width: 1,
                backgroundColor: colors.zinc,
              }}></View>
            <TouchableOpacity
              style={[
                styles.touchableOpacity,
                {
                  backgroundColor:
                    selectedCategory == 'Outdoor'
                      ? colors.light_green
                      : colors.light_zinc,
                },
              ]}
              onPress={() => handleButtonPress('Outdoor')}>
              <Image
                source={globalPath.Outdoor}
                style={{
                  height: responsiveHeight(2.2),
                  width: responsiveHeight(2.2),
                  marginRight: responsiveWidth(3),
                  tintColor: selectedCategory === 'Outdoor' ? 'white' : '#888',
                }}
              />
              <Text
                style={{
                  color:
                    selectedCategory === 'Outdoor'
                      ? 'white'
                      : colors.dark_green,
                  fontSize: responsiveFontSize(1.5),
                  fontWeight: selectedCategory === 'Outdoor' ? '900' : '400',
                }}>
                {/* Outdoor */}
              </Text>
            </TouchableOpacity>
            <View
              style={{
                height:
                  Platform.OS === 'ios'
                    ? responsiveHeight(3)
                    : responsiveHeight(4),
                width: 1,
                backgroundColor: colors.zinc,
              }}></View>

            <TouchableOpacity
              style={[
                styles.touchableOpacity,
                {
                  backgroundColor:
                    selectedCategory == 'Nursery'
                      ? colors.light_green
                      : colors.light_zinc,
                },
              ]}
              onPress={() => handleButtonPress('Nursery')}>
              <Image
                source={globalPath.Nursery}
                style={{
                  height: responsiveHeight(2.2),
                  width: responsiveHeight(2.2),
                  marginRight: responsiveWidth(3),
                  tintColor: selectedCategory === 'Nursery' ? 'white' : '#888',
                }}
                resizeMode="contain"
              />
              <Text
                style={{
                  color:
                    selectedCategory === 'Nursery'
                      ? 'white'
                      : colors.dark_green,
                  fontSize: responsiveFontSize(1.5),
                  fontWeight: selectedCategory === 'Nursery' ? '900' : '400',
                }}>
                {/* Nursery */}
              </Text>
            </TouchableOpacity>
            <View
              style={{
                height:
                  Platform.OS === 'ios'
                    ? responsiveHeight(3)
                    : responsiveHeight(4),
                width: 1,
                backgroundColor: colors.zinc,
              }}></View>

            <TouchableOpacity
              style={[
                styles.touchableOpacity,
                {
                  backgroundColor:
                    selectedCategory == 'Water Tank'
                      ? colors.light_green
                      : colors.light_zinc,
                },
              ]}
              onPress={() => handleButtonPress('Water Tank')}>
              <Image
                source={globalPath.WaterTank}
                style={{
                  height: responsiveHeight(2.2),
                  width: responsiveHeight(2.2),
                  marginRight: responsiveWidth(3),
                  tintColor:
                    selectedCategory === 'Water Tank' ? 'white' : '#888',
                }}
              />
              <Text
                style={{
                  color:
                    selectedCategory === 'Water Tank'
                      ? 'white'
                      : colors.dark_green,
                  fontWeight: selectedCategory === 'Water Tank' ? '900' : '400',
                  fontSize: responsiveFontSize(1.5),
                }}>
                {/* Water Tank */}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={{backgroundColor: 'red'}}>
          {TodayGreenHouse.map(entry => (
            <Text key={entry.hour.toString()} style={{color: 'black'}}>
              Hour: {entry.hour}, Temp: {entry.Temp}
            </Text>
          ))}
        </View>

        {fetchingData ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Lottie
              source={require('../assets/animations/loader.json')}
              style={styles.loader}
              speed={2}
              autoPlay
              loop
            />
          </View>
        ) : FilterData.length > 0 ? (
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} 
              colors={[colors.light_green, colors.yellow, colors.red]}/>
            }>
            <View style={{alignItems: 'center'}}>
              <View style={styles.chartview}>
                <View
                  style={{
                    alignItems: 'flex-start',
                    color: 'black',
                    fontWeight: 'bold',
                    marginBottom: responsiveHeight(1),
                  }}>
                  <Text
                    style={{
                      color: colors.dark_green,
                      fontWeight: '600',
                      fontSize:
                        deviceWidth > 500
                          ? responsiveFontSize(1)
                          : responsiveFontSize(1.6),
                    }}>
                    {' '}
                    Temperature
                  </Text>
                </View>

                <ScrollView
                  horizontal
                  style={styles.container}
                  indicatorStyle={{backgroundColor: 'red'}}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: 10,
                    }}>
                    <Text
                      style={{
                        transform: [{rotate: '-90deg'}],
                        color: 'black',
                        fontWeight: '500',
                        position: 'absolute',
                        fontSize:
                          deviceWidth > 500
                            ? responsiveFontSize(1)
                            : responsiveFontSize(1.6),
                      }}>
                      Average
                    </Text>
                  </View>


                  <LineChart
                    data={{
                      labels: FilterData.map(entry => entry.hour.toString()), // Convert hour to string if it's a number
                      datasets: [
                        {
                          data: FilterData.map(entry => parseFloat(entry.Temp)),
                        },
                      ],
                    }}
                    width={deviceWidth > 500 ? 1200 : 830}
                    height={responsiveHeight(29)}
                    chartConfig={{
                      backgroundColor: 'white', // Change background color to white
                      backgroundGradientFrom: 'white',
                      backgroundGradientTo: 'white',
                      decimalPlaces: 2,
                      color: (opacity = 1) => `rgba(93, 132, 17, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                      strokeWidth: 2,
                      barPercentage: 0.8, // Adjust barPercentage as needed
                      useShadowColorFromDataset: false,
                      style: {
                        borderRadius: 10,
                      },
                      propsForDots: {
                        r: '4',
                        strokeWidth: '1',
                        stroke: '#1d4a1d',
                      },
                    }}
                    bezier
                    style={{
                      marginVertical: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 16,
                    }}
                    decorator={() =>
                      tooltipPosUpper.visible && (
                        <Tooltip
                          x={tooltipPosUpper.x}
                          y={tooltipPosUpper.y}
                          children={tooltipPosUpper.content}
                        />
                      )
                    }
                    onDataPointClick={({
                      x,
                      y,
                      value,
                      dataset,
                      getColor,
                      index,
                    }) => {
                      handleDotPressUpper(x, y, index);
                    }}
                  />
                </ScrollView>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    padding: 10,
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontWeight: '500',
                      position: 'absolute',
                      fontSize:
                        deviceWidth > 500
                          ? responsiveFontSize(1)
                          : responsiveFontSize(1.6),

                      bottom: responsiveHeight(2.5),
                    }}>
                    {ActiveColor === 'Month' ? 'Days' : 'Hours'}
                  </Text>
                </View>
              </View>

              <View
                style={[styles.chartview, {marginTop: responsiveHeight(0)}]}>
                <View
                  style={{
                    alignItems: 'flex-start',
                    color: 'black',
                    fontWeight: 'bold',
                    marginBottom: responsiveHeight(1),
                  }}>
                  <Text
                    style={{
                      color: colors.dark_green,
                      fontWeight: '600',
                      fontSize:
                        deviceWidth > 500
                          ? responsiveFontSize(1)
                          : responsiveFontSize(1.6),
                    }}>
                    {' '}
                    {selectedCategory === 'Water Tank'
                      ? 'Distance'
                      : 'Humidity'}
                  </Text>
                </View>
                <ScrollView
                  horizontal
                  style={styles.container}
                  indicatorStyle={{backgroundColor: 'red'}}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: 10,
                    }}>
                    <Text
                      style={{
                        transform: [{rotate: '-90deg'}],
                        color: 'black',
                        fontWeight: '500',
                        position: 'absolute',
                        fontSize:
                          deviceWidth > 500
                            ? responsiveFontSize(1)
                            : responsiveFontSize(1.6),
                      }}>
                      Average
                    </Text>
                  </View>
                  <LineChart
                    data={{
                      labels: FilterData.map(entry => entry.hour.toString()), // Convert hour to string if it's a number
                      datasets: [
                        {
                          data: FilterData.map(entry =>
                            parseFloat(entry.Humidity),
                          ),
                        },
                      ],
                    }}
                    width={deviceWidth > 500 ? 1200 : 830}
                    height={responsiveHeight(29)}
                    chartConfig={{
                      backgroundColor: 'white', // Change background color to white
                      backgroundGradientFrom: 'white',
                      backgroundGradientTo: 'white',
                      decimalPlaces: 2,
                      color: (opacity = 1) => `rgba(93, 132, 17, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                      strokeWidth: 2,
                      barPercentage: 0.8, // Adjust barPercentage as needed
                      useShadowColorFromDataset: false,
                      style: {
                        borderRadius: 10,
                      },
                      propsForDots: {
                        r: '4',
                        strokeWidth: '1',
                        stroke: '#1d4a1d',
                      },
                    }}
                    bezier
                    style={{
                      marginVertical: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 16,
                    }}
                    decorator={() =>
                      tooltipPosLower.visible && (
                        <HumidityToolTip
                          x={tooltipPosLower.x}
                          y={tooltipPosLower.y}
                          children={tooltipPosLower.content}
                        />
                      )
                    }
                    onDataPointClick={({
                      x,
                      y,
                      value,
                      dataset,
                      getColor,
                      index,
                    }) => {
                      handleDotPressLower(x, y, index);
                    }}
                  />
                </ScrollView>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    padding: 10,
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontWeight: '500',
                      position: 'absolute',
                      fontSize:
                        deviceWidth > 500
                          ? responsiveFontSize(1)
                          : responsiveFontSize(1.6),
                      bottom: responsiveHeight(2.5),
                    }}>
                    {ActiveColor === 'Month' ? 'Days' : 'Hours'}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        ) : (
          <ScrollView
            style={{flex: 1}}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            indicatorStyle={{backgroundColor: 'red'}}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Lottie
                source={require('../assets/animations/nodata.json')}
                style={{width: 160, height: 160}}
                speed={1.5}
                autoPlay
                loop
              />
              <Text style={{color: 'black'}}>No data available</Text>
            </View>
          </ScrollView>
        )}
        {showMonthPicker ? (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'flex-end'}}>
            <MonthPicker
              onChange={handleMonthChange}
              // value={selectedDate}

              value={initialMonth}
              minimumDate={new Date(2000, 0)}
              maximumDate={new Date(2100, 11)}
            />
          </View>
        ) : undefined}
      </View>
    </SafeAreaView>
  );
};

export default Analytics;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    height: Platform.OS === 'ios' ? responsiveHeight(33) : responsiveHeight(41),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tooltipText: {
    color: 'white',
    fontSize: 12,
  },
  chartview: {
    width: responsiveWidth(95),
    bottom: responsiveHeight(4),
    height: Platform.OS === 'ios' ? responsiveHeight(36) : responsiveHeight(39),
    marginTop: responsiveHeight(5),
  },
  section4: {
    ...(Platform.OS === 'ios'
      ? {
          height: hp(3),
          backgroundColor: colors.light_zinc,
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'row',
          marginHorizontal: responsiveWidth(2),
        }
      : {
          height: hp(4),
          backgroundColor: colors.light_zinc,
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'row',
          marginHorizontal: responsiveWidth(2),
        }),
  },
  touchableOpacity: {
    ...(Platform.OS === 'ios'
      ? {
          backgroundColor: colors.light_zinc,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 7,
          width: (deviceWidth - responsiveWidth(2) * 2) / 4,
          height: responsiveHeight(3),
        }
      : {
          backgroundColor: colors.light_zinc,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 7,
          width: (deviceWidth - responsiveWidth(2) * 2) / 4,
          height: responsiveHeight(4),
        }), // Conditional styling for iOS
  },
  header: {
    height: hp(4),
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
  },
  imagestyle: {
    width: deviceWidth > 500 ? responsiveWidth(3) : responsiveWidth(6),
    height: deviceWidth > 500 ? responsiveHeight(3) : responsiveWidth(6),
    marginLeft: responsiveHeight(2),
    marginTop: responsiveHeight(0.6),
  },
  loader: {
    width: responsiveWidth(40),
    height: responsiveHeight(40),
  },
  section1: {
    height: deviceWidth > 500 ? hp(7) : hp(6),
    width: wp(94),
    backgroundColor: colors.light_zinc,
    borderRadius: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(2),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: responsiveWidth(4),
    marginTop: responsiveHeight(1),
    alignItems: 'center',
  },
  clockImg: {
    height: responsiveHeight(4),
    width: responsiveHeight(4),
    marginRight: responsiveWidth(2),
    tintColor: colors.dark_green,
  },
});
 	