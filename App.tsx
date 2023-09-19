import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import messaging from '@react-native-firebase/messaging';
import notifee, {EventType} from '@notifee/react-native';
import {
  displayNotification,
  getInitialNotification,
} from './src/utils/Notification';

const App = () => {
  useEffect(() => {
    // 알림 수신
    const onMessage = messaging().onMessage(async remoteMessage => {
      const channel = {
        id: 'default',
        name: 'default',
      };
      const notification = {
        title: remoteMessage?.notification?.title,
        body: remoteMessage?.notification?.body,
      };

      await displayNotification(channel, notification);
    });

    // 앱이 꺼져있을 때 알림을 누름
    getInitialNotification().then(() => {
      console.log('앱이 꺼져있는데 눌러서 켬');
    });

    // 앱이 최소화 되어 있는데 알림을 눌러서 활성화 했을 때
    const onNotificationOpenedApp = messaging().onNotificationOpenedApp(
      async () => {
        console.log('앱이 최소화 되어 있는데 알림을 눌러서 활성화함');
      },
    );

    // 사용자가 앱을 이용중 일 떄
    const onForegroundEvent = notifee.onForegroundEvent(async observer => {
      const {type, detail} = observer;
      if (type === EventType.PRESS) {
        console.log('앱이 켜져있는데 알림을 누름', detail);
      }
    });

    return () => {
      onNotificationOpenedApp();
      onForegroundEvent();
      onMessage();
    };
  }, []);

  return (
    <View style={[styles.container]}>
      <Text style={[styles.title]}>안드로이드 푸시 알림 테스트</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    includeFontPadding: false,
    color: '#333',
  },
});

export default App;
