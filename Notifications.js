// import * as Notifications from "expo-notifications";
// import React, { useEffect } from "react";
// import { db } from "./firebase/firebase";

// export async function schedulePushNotification() {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "You've got mail! 📬",
//       body: "Here is the notification body",
//       data: { data: "goes here" },
//     },
//     trigger: { seconds: 2 },
//   });
// }
// async function registerForPushNotificationsAsync() {
//   let token;
//   const { status: existingStatus } = await Notifications.getPermissionsAsync();
//   let finalStatus = existingStatus;
//   if (existingStatus !== "granted") {
//     const { status } = await Notifications.requestPermissionsAsync();
//     finalStatus = status;
//   }
//   if (finalStatus !== "granted") {
//     alert("Failed to get push token for push notification!");
//     return;
//   }
//   token = (await Notifications.getExpoPushTokenAsync(db)).data;
//   token = (
//     await Notifications.getExpoPushTokenAsync({
//       apiKey: "AIzaSyBxLPRq44gKYyKuyiQreFN1NR0kJTGlC1Q",
//       authDomain: "tbdfridge.firebaseapp.com",
//       projectId: "tbdfridge",
//       storageBucket: "tbdfridge.appspot.com",
//       messagingSenderId: "805582660558",
//       appId: "1:805582660558:web:bd353524e9776cfaebc19f",
//     })
//   ).data;
//   console.log(token);
//   // ที่นี่คุณสามารถส่ง token ไปยังเซิร์ฟเวอร์ของคุณหากจำเป็น
//   return token;
// }

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

// export function useNotification() {
//   useEffect(() => {
//     registerForPushNotificationsAsync();
//     // ฟังก์ชันที่จะถูกเรียกเมื่อแอปพลิเคชันอยู่ใน foreground
//     const foregroundSubscription =
//       Notifications.addNotificationReceivedListener((notification) => {
//         console.log(notification);
//       });

//     // ฟังก์ชันที่จะถูกเรียกเมื่อผู้ใช้คลิกการแจ้งเตือน
//     const responseSubscription =
//       Notifications.addNotificationResponseReceivedListener((response) => {
//         console.log(response);
//       });

//     return () => {
//       Notifications.removeNotificationSubscription(foregroundSubscription);
//       Notifications.removeNotificationSubscription(responseSubscription);
//     };
//   }, []);
// }

// // จำเป็นต้องแทรกโค้ดสำหรับ registerForPushNotificationsAsync ที่นี่
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import * as Device from "expo-device";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const [expoPushToken, setExpoPushToken] =
  (useState < Notifications.existingStatus) | (undefined > "");
const [notification, setNotification] =
  (useState < Notifications.existingStatus) | (undefined > "");

const notificationListener = useRef < Notifications.Subscription > "";
const responseListener = useRef < Notifications.Subscription > "";

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas.projectId,
    });
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token.data;
}
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
