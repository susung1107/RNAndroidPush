import messging from '@react-native-firebase/messaging';
import notifee, {
  AndroidImportance,
  AndroidChannel,
} from '@notifee/react-native';

export const displayNotification = async (
  channel: AndroidChannel,
  notification: {title: string | undefined; body: string | undefined},
): Promise<void> => {
  const channelId = await notifee.createChannel({
    ...channel,
    importance: AndroidImportance.HIGH,
  });

  await notifee.displayNotification({
    ...notification,
    android: {
      channelId,
    },
  });
};

export const getFCMToken = async () => {
  return new Promise<string>(async resolve => {
    return await messging()
      .getToken()
      .then((token: string) => {
        resolve(token);
        console.log('FCM Token : ', token);
      });
  });
};

export const getInitialNotification = async () => {
  return new Promise<void>(async resolve => {
    await messging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          resolve();
        }
      });
  });
};
