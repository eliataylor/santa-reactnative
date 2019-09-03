import PushNotification from 'react-native-push-notification';
import Config from '../Config';

var notice = {
  /* Android Only Properties */
  //date: new Date(Date.now() + (30 * 1000)), // in 30 secs
  //id: ''+this.lastId, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
  ticker: "My Notification Ticker", // (optional)
  autoCancel: true, // (optional) default: true
  largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
  smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
  bigText: "My big text that will be shown when notification is expanded", // (optional) default: "message" prop
  subText: "This is a subText", // (optional) default: none
  color: "red", // (optional) default: system default
  vibrate: true, // (optional) default: true
  vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
  tag: 'santa_fulfills', // (optional) add tag to message
  // group: "group", // (optional) add group to message
  ongoing: false, // (optional) set whether this is an "ongoing" notification

  /* iOS only properties */
  alertAction: 'view', // (optional) default: view
  category: 'userInfo', // (optional) default: null
  userInfo: null, // (optional) default: null (object containing additional notification data)

  /* iOS and Android properties */
  title: "Local Notification", // (optional)
  message: "My Notification Message", // (required)
  playSound: false, // (optional) default: true
  soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
  number: '10', // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
  // actions: '["Yes", "No"]',  // (Android only) See the doc for notification actions to know more
};

export default class NotifService {

  constructor(onRegister, onNotification) {
    this.configure(onRegister, onNotification);
    this.lastId = 0;
  }

  configure(onRegister, onNotification) {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: onRegister, //this._onRegister.bind(this),

      // (required) Called when a remote or local notification is opened or received
      onNotification: onNotification, //this._onNotification,

      // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
      senderID: Config.android.senderId,

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
        * (optional) default: true
        * - Specified if permissions (ios) and token (android and ios) will requested or not,
        * - if not, you must call PushNotificationsHandler.requestPermissions() later
        */
      requestPermissions: true,
    });
  }

  // (required) Called when a remote or local notification is opened or received
  onNotification(notification) {
      console.warn("NOTIFICATION:", notification);
      // process the notification
      // required on iOS only (see fetchCompletionHandler docs: https://github.com/react-native-community/react-native-push-notification-ios)
      notification.finish(PushNotificationIOS.FetchResult.NoData);
  }

  localNotification(props) {
    this.lastId++;
    var obj = Object.assign({...notice}, props);
    obj.id = ''+this.lastId;
    console.log('notifying ', obj);
    PushNotification.localNotification(obj);
  }

  localNotificationSchedule(props) {
    this.lastId++;
    var obj = Object.assign({...notice}, props);
    obj.date = new Date(Date.now() + (30 * 1000));
    obj.id = ''+this.lastId;
    console.log('scheduling ', obj);
    PushNotification.localNotificationSchedule(obj);
  }

  requestPermissions() {
    return PushNotificationsHandler.requestPermissions();
  }

  checkPermission(cbk) {
    return PushNotification.checkPermissions(cbk);
  }

  cancelLocalNotifications() {
    PushNotification.cancelLocalNotifications({id: ''+this.lastId});
  }

  cancelAllLocalNotifications() {
    PushNotification.cancelAllLocalNotifications();
  }
}
