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

import {getApiUrl} from '../constants/apiConfig';
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

  const [previousFilter, setPreviousFilter] = useState('');

  const [MonthData, setMonthData] = useState();

  const [TodayData, setTodayData] = useState();

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

  const fetchMonthData = async (month, year) => {
    try {
      const apiUrlWithMonthYear = getApiUrl(
        'Tnh',
        undefined,
        undefined,
        month,
        year,
      );
      console.log('Apiurl with month and year', apiUrlWithMonthYear);
      const nurseryResponse = await fetch(apiUrlWithMonthYear);
      const countData = await nurseryResponse.json();
      const totalCount = countData.count;
      console.log('Count of Month', totalCount);
      const DataResponse = await fetch(
        `${apiUrlWithMonthYear}&limit=${totalCount}`,
      );
      const MonthData = await DataResponse.json();
      const dtalength = MonthData.results;
      console.log('month data length', dtalength.length);
      const keywords = ['GH', 'Nursery', 'Outdoor'];
      const categoryMappings = {
        'Green house': 'GH',
        Nursery: 'Nursery',
        Outdoor: 'Outdoor',
      };
      const keyword = categoryMappings[selectedCategory];
      console.log('keyword', keyword);
      if (!keyword) {
        console.error('Invalid selectedCategory:', selectedCategory);
        return;
      }
      const filteredData = MonthData.results.filter(
        item => item.temp_c !== null && item.humidity !== null,
      );
      // console.log("filteredData",filteredData)
      const dataByType = {};
      const dailyAverages = {};

      // Initialize dailyAverages for each keyword
      keywords.forEach(keyword => {
        dailyAverages[keyword] = {};
      });

      filteredData.forEach(item => {
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
            `   ${date}: Temp: ${averageTemp.toFixed(
              2,
            )}, Humidity: ${averageHumidity.toFixed(2)}`,
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
          setRefreshing(false);
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
      const apiUrlWithMonthYear = getApiUrl(
        'Level',
        undefined,
        undefined,
        month,
        year,
      );
      console.log('Apiurl with month and year ', apiUrlWithMonthYear);
      const nurseryResponse = await fetch(apiUrlWithMonthYear);
      const countData = await nurseryResponse.json();
      const totalCount = countData.count;
      console.log('Count of Month', totalCount);
      const DataResponse = await fetch(
        `${apiUrlWithMonthYear}&limit=${totalCount}`,
      );
      const MonthData = await DataResponse.json();
      const dtalength = MonthData.results;
      console.log('month data length of lvl', dtalength.length);
      const keywords = ['Tank'];
      const filteredData = MonthData.results.filter(
        item => item.temp_c !== null && item.Distance !== null,
      );
      const dataByType = {};
      const Tankavg = {};
      filteredData.forEach(item => {
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

  // after commenting this useEffect data runs only one time:

  //   useEffect(() => {
  //     // console.log("getApiUrl",getApiUrl)
  //   if (selectedFilter === 'Today') {
  //     setActiveColor('Today');
  //     const fetchData = async () => {
  //       setFetchingData(true);
  //       const formattedDate = formatDate(selectedDate);
  //       setShowDate(formattedDate);
  //       await fetchTodayData(selectedDate);
  //       setFetchingData(false);
  //       console.log('DATE ENTER ', selectedDate);
  //       console.log('RUN THE TODAY', TodayGreenHouse);
  //     };
  //     fetchData();
  //   }else if (selectedFilter === 'Month') {
  //     console.log('RUN THE Month');
  //   } else if (selectedFilter === 'Choose Date') {
  //     fetchDataAsync();
  //     console.log('RUN THE Calender');
  //   }
  // }, [selectedDate, selectedFilter]);
  function* yLabel() {
    yield* ['Empty', '-', '1/4', '-', 'Half', '-', '3/4', '-', 'Full'];
  }

  const yLabels = Array.from(yLabel());
  useEffect(() => {
    if (
      selectedFilter === 'Today' &&
      (previousFilter === 'Choose Date' || previousFilter === 'Month')
    ) {
      setActiveColor('Today');
      const fetchData = async () => {
        setFetchingData(true);
        const formattedDate = formatDate(selectedDate);
        setShowDate(formattedDate);
        await fetchDataAsync();
        setFetchingData(false);
        console.log('DATE ENTER ', selectedDate);
        console.log('RUN THE TODAY', TodayGreenHouse);
      };
      fetchData();
    } else if (selectedFilter === 'Month') {
      console.log('RUN THE Month');
    } else if (selectedFilter === 'Choose Date') {
      fetchDataAsync();
      console.log('RUN THE Calendar');
    }

    // Update previousFilter when the effect runs
    setPreviousFilter(selectedFilter);
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

      const apiUrlWithTimestamps = getApiUrl(
        'Level',
        formattedCurrentDate,
        formattedNextDate,
      );
      console.log('Apiurl with timestamps of lvl', apiUrlWithTimestamps);

      const TodaylvlResponse = await fetch(apiUrlWithTimestamps);
      const countData = await TodaylvlResponse.json();
      const totalCount = countData.count;
      console.log('lvl Count of Today:', totalCount);

      const DataResponse = await fetch(
        `${apiUrlWithTimestamps}&limit=${totalCount}`,
      );

      const TodaylvlData = await DataResponse.json();
      const dtalength = TodaylvlData.results;
      console.log('Today DATA of lvl:', dtalength.length);
      const keywords = ['Tank'];
      const filteredData = TodaylvlData.results.filter(
        item => item.temp_c !== null && item.Distance !== null,
      );
      const dataByType = {};
      filteredData.forEach(item => {
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
  const fetchTodayData = async date => {
    try {
      setFetchingData(true);

      console.log(' CALENDER DATe', date);
      const currentDate = date;
      const nextDate = new Date(currentDate);
      nextDate.setDate(currentDate.getDate() + 1);
      const formattedCurrentDate = currentDate.toISOString().split('T')[0];
      setShowDate(formattedCurrentDate);
      const formattedNextDate = nextDate.toISOString().split('T')[0];
      console.log('formattedCurrentDate', formattedCurrentDate);
      console.log('formattedNextDate', formattedNextDate);
      const apiUrlWithTimestamps = getApiUrl(
        'Tnh',
        formattedCurrentDate,
        formattedNextDate,
      );
      console.log('Apiurl with timestamps', apiUrlWithTimestamps);
      const TodayResponse = await fetch(apiUrlWithTimestamps);
      const countData = await TodayResponse.json();
      const totalCount = countData.count;
      console.log('Count of Today tnh:', totalCount);
      const DataResponse = await fetch(
        `${apiUrlWithTimestamps}&limit=${totalCount}`,
      );
      const TodayData = await DataResponse.json();
      const dtalength = TodayData.results;
      console.log('Today DATA of tnh:', dtalength.length);
      const keywords = ['GH', 'Nursery', 'Outdoor'];

      const categoryMappings = {
        'Green house': 'GH',
        Nursery: 'Nursery',
        Outdoor: 'Outdoor', // Add more mappings as needed
      };

      const keyword = categoryMappings[selectedCategory];

      if (!keyword) {
        // console.error('Invalid selectedCategory:', selectedCategory);
        return;
      }

      const filteredData = TodayData.results.filter(
        item => item.temp_c !== null && item.humidity !== null,
      );
      const dataByType = {};
      filteredData.forEach(item => {
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
        if (TodayNurSery.length > 0) {
          setFilterData(TodayNurSery);
          setFetchingData(false);
          setRefreshing(false);
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
            left: x - responsiveWidth(20),
            top: y - responsiveWidth(-0.5),
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
            }>{`Temp:${children.currentEntry.Temp}Ã‚Â°C`}</Text>
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
            left: x - responsiveWidth(20),
            top: y - responsiveWidth(-0.5),
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
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.light_green, colors.yellow, colors.red]}
              />
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
                  {selectedCategory === 'Water Tank' ? (
                    <LineChart
                      data={{
                        labels: FilterData.map(entry => entry.hour.toString()), // Convert hour to string if it's a number
                        datasets: [
                          {
                            data: FilterData.map(entry => {
                              const humidity = parseFloat(entry.Humidity);
                              if (humidity >= 7 && humidity < 11.5325) {
                                return 100; // Full
                              } else if (
                                humidity >= 11.5325 &&
                                humidity < 16.25
                              ) {
                                return 87.5; // Three-quarters
                              } else if (
                                humidity >= 16.25 &&
                                humidity < 20.875
                              ) {
                                return 75; // Half
                              } else if (
                                humidity >= 20.875 &&
                                humidity < 25.5
                              ) {
                                return 62.5; // One-quarter
                              } else if (
                                humidity >= 25.5 &&
                                humidity < 30.125
                              ) {
                                return 50; // Three-quarters
                              } else if (
                                humidity >= 30.125 &&
                                humidity < 34.75
                              ) {
                                return 37.5; // Half
                              } else if (
                                humidity >= 34.75 &&
                                humidity < 39.375
                              ) {
                                return 25; // One-quarter
                              } else if (humidity >= 39.375 && humidity < 44) {
                                return 12.5; // One-quarter
                              } else if (humidity >= 44) {
                                return 0; // One-quarter
                              }
                            }),
                          },
                          {
                            data: [100],
                            withDots: false,
                          },
                        ],
                      }}
                      fromZero={true}
                      formatYLabel={
                        value => yLabels[value / 12.5] // Each segment is 25 units
                      }
                      // formatYLabel={() => yLabelIterator.next().value}
                      width={deviceWidth > 500 ? 1200 : 830}
                      height={responsiveHeight(29)}
                      chartConfig={{
                        backgroundColor: 'white', // Change background color to white
                        backgroundGradientFrom: 'white',
                        backgroundGradientTo: 'white',
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(93, 132, 17, ${opacity})`,
                        labelColor: (opacity = 1) =>
                          `rgba(0, 0, 0, ${opacity})`,
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
                  ) : (
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
                      // formatYLabel={() => yLabelIterator.next().value}
                      width={deviceWidth > 500 ? 1200 : 830}
                      height={responsiveHeight(29)}
                      chartConfig={{
                        backgroundColor: 'white', // Change background color to white
                        backgroundGradientFrom: 'white',
                        backgroundGradientTo: 'white',
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(93, 132, 17, ${opacity})`,
                        labelColor: (opacity = 1) =>
                          `rgba(0, 0, 0, ${opacity})`,
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
                  )}
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
    shadowRadius: 4,
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
    height: deviceWidth > 500 ? hp(7) : hp(5),
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
