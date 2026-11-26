import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: false }),
});

export async function setupNotifications() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('schedule-updates', {
      name: 'Schedule updates',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'alert_tone.mp3', // custom sound asset (see app.json plugin)
    });
  }
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export function showLocalAlert({ title, message }) {
  return Notifications.scheduleNotificationAsync({
    content: { title, body: message, sound: 'alert_tone.mp3' },
    trigger: Platform.OS === 'android' ? { channelId: 'schedule-updates', seconds: 1 } : null,
  });
}
