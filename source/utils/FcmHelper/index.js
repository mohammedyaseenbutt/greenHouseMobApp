import messaging from '@react-native-firebase/messaging';
import {Amplify, Auth, Storage, API} from 'aws-amplify';
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';

let tokens, currentUser, fcmToken;
export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const isAuthorized =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (!isAuthorized) {
    return;
  }

  fcmToken = await getFcmToken();
  console.log('BOTTOM FCM', fcmToken);

  try {
    const user = await Auth.currentAuthenticatedUser();
    currentUser = user.attributes.name;
    const apiName = 'SabzappCRUD';
    const path = '/items/getNotificationToken';

    // console.log('objjjjjjjjjjjjjjjjjjj', body);
    const res = API.get(apiName, path)
      .then(response => {
        console.log('GET RESPONSE IS ', response.Items[0].Tokens);
        tokens = response.Items[0].Tokens;
        useTokens(fcmToken, tokens, currentUser);
      })
      .catch(error => {
        console.log('GET Error IS ', error);
      });

    // console.log('INNER TRY');

    // console.log('API RESPONSE 1', response);
    // console.log('API RESPONSE 2', response.Items[0]);
    // console.log('API RESPONSE 3', response.Items[0].Tokens);

    // console.log('After TRY');
  } catch (error) {
    // console.error('FCM WALA ERREOeererer', error);
    return;
  }
}

const getFcmToken = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');

  if (!fcmToken) {
    console.log(' IF FCM TOKEN NOT EXIST');
    fcmToken = await messaging().getToken();
    await AsyncStorage.setItem('fcmToken', fcmToken);
  }

  return fcmToken;
};

function useTokens(fcmToken, tokens, currentUser) {
  let exists = false;

  // console.log('_________');
  // console.log('GET WALA DATA', tokens);
  // console.log('UserGroup', userGroup);
  // console.log('CurrentUser', currentUser);
  // console.log('fcmToken', fcmToken);

  if (tokens[currentUser].includes(fcmToken)) {
    console.log('This token already exsist in', currentUser);
  } else {
    for (let role in tokens) {
      // Check if token exsist in Database All array

      if (tokens[role].includes(fcmToken)) {
        exists = true;
        break;
      }

      if (exists) {
        break;
      }
    }

    if (exists) {
      for (const key1 in tokens) {
        for (const key2 in tokens[key1]) {
          const index = tokens[key1].indexOf(fcmToken);
          if (index !== -1) {
            tokens[key1].splice(index, 1); //Remove that fcm token from array
            break;
          }
        }
      }
      exists = false;
    }

    if (exists) {
      console.log('Token Exsist Already Somewhere');
    } else {
      console.log('ENTER THE VERY FIRST TIME');
      let currentUserArray = tokens[currentUser];

      if (currentUserArray.length != 0) {
        console.log(' SHOW LENGTH ZERO');
        tokens[currentUser].push(fcmToken);

        var body = {
          Tokens: tokens,
        };
        console.log(' THE BODY IS ', body);
        const apiName = 'SabzappCRUD';
        const path = '/items/updateNotificationToken';
        const headers = {
          'Content-Type': 'application/json', // Add this line to set the Content-Type header
        };
        // console.log('objjjjjjjjjjjjjjjjjjj', body);
        const res = API.put(apiName, path, {body, headers})
          .then(response => {
            console.log('PUT RESPONSE IS ', response);
          })
          .catch(error => {
            console.log('NEW ENTRY PUT Error IS ', error);
          });
        // console.log('res', res);
        if (res) {
          console.log('success response', res);
        } else {
          // console.log(' eslse resp', res);
        }
      } else {
        tokens[currentUser] = [fcmToken];

        var body = {
          Tokens: tokens,
        };

        console.log(' BODY IS ', body.Tokens);

        // console.log('objjjjjjjjjjjjjjjjjjj', body);
        const apiName = 'SabzappCRUD';
        const path = '/items/updateNotificationToken';

        const headers = {
          'Content-Type': 'application/json', // Add this line to set the Content-Type header
        };
        // console.log('objjjjjjjjjjjjjjjjjjj', body);
        const res = API.put(apiName, path, {body, headers})
          .then(response => {
            console.log('PUT RESPONSE IS ', response);
          })
          .catch(error => {
            console.log('PUT Error IS ', error);
          });
        // console.log('res', res);
        if (res) {
          // console.log('success response', res);
        } else {
          // console.log(' eslse resp', res);
        }
      }
    }
  }
}

export const notificationListener = async () => {
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    console.log('A new FCM message arrived', remoteMessage);
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );

        // notification_text.unshift({message: remoteMessage.notification.body});
        // notification_number.push({message: '1'});
        console.log(notification_text);
      }
    });
};
