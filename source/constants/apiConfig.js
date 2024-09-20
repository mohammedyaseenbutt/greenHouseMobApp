//ApiConfig:
export const API_HOST = 'https://api.sabzorganics.com';

export const apiEndpoints = {
  // EndPoints For HomeScreen:
  live_Outdoor: '/live/?name=Outdoor-01',
  live_Nursery: '/live/?name=Nursery-01',
  live_GreenHouse_1: '/live/?name=GH-01',
  live_GreenHouse_2: '/live/?name=GH-02',
  live_GreenHouse_3: '/live/?name=GH-03',
  live_Tank: '/live/?name=Tank00',
  //EndPoints For Trends:
  Level: '/?type=lvl',
  Tnh: '/?type=Tnh',
  //TimeStamps:
  timeStampMonth: '&timestamp__month=',
  timeStampYear: '&timestamp__year=',
  timeStampGte: '&timestamp__gte=',
  timeStampLte: '&timestamp__lte=',
  //endpoint of relay:
  Relay: '/relay/',
};

export const AWS_Url = {
  // Notifications Token
  get_Token: '/getNotificationToken',
  update_Token: '/updateNotificationToken',
};

//  export const getApiUrl = (endpoint, month, year) => {
//   const url = `${API_HOST}${apiEndpoints[endpoint]}${apiEndpoints.timeStampMonth}${month}${apiEndpoints.timeStampYear}${year}`;
//   return url;
// };

export const getApiUrl = (
  endpoint,
  timestampGte,
  timestampLte,
  month,
  year,
) => {
  let url;

  if (timestampGte !== undefined && timestampLte !== undefined) {
    url = `${API_HOST}${apiEndpoints[endpoint]}${apiEndpoints.timeStampGte}${timestampGte}${apiEndpoints.timeStampLte}${timestampLte}`;
  } else if (month !== undefined && year !== undefined) {
    url = `${API_HOST}${apiEndpoints[endpoint]}${apiEndpoints.timeStampMonth}${month}${apiEndpoints.timeStampYear}${year}`;
  } else if (
    month == undefined &&
    year == undefined &&
    timestampGte == undefined &&
    timestampLte == undefined
  ) {
    url = `${API_HOST}${apiEndpoints[endpoint]}`;
  } else {
    console.error('Invalid parameters provided to getApiUrl');
  }

  return url;
};
