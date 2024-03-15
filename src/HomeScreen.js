import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  RefreshControl,
  Button,
} from "react-native";
import { db } from "../firebase/firebase";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { useRef } from "react";
import * as Device from "expo-device";

export default function HomeScreen() {
  const [foodList, setFoodList] = useState([]);
  const [documentId, setDocumentId] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation(); // ใช้ hook useNavigation

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  async function food() {
    setRefreshing(true);
    try {
      const querySnapshot = await getDocs(
        collection(db, "Myfridge", "UserID", "UserDetail")
      );

      const data = querySnapshot.docs.map((item) => item.data());
      const foodData = querySnapshot.docs.map((item) => {
        return {
          Time_End: item.data()?.Time_End,
          NameFood: item.data()?.NameFood,
        };
      });
      const id = querySnapshot.docs.map((item) => item.id);

      foodData.forEach((foodData) => {
        const expiryDate = new Date(foodData?.Time_End?.toDate());

        const currentDate = new Date();
        const timeDifference = expiryDate - currentDate;
        const timeDiff = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

        console.log({
          NameFood: foodData?.NameFood,
          timeDifference: timeDiff,
        });

        if (timeDiff <= 0) {
          console.log("timeDifference <= 0");
          schedulePushNotification(foodData?.NameFood);
        }
      });

      setDocumentId(id);
      setFoodList(data);
    } catch (e) {
      console.log(e);
    } finally {
      setRefreshing(false);
    }
    setRefreshing(false);
  }

  useEffect(() => {
    food();
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <FlatList
      data={foodList}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={food} />
      }
      renderItem={({ item }) => {
        let dateString = "";
        const date = item.Time_End?.toDate(); // แปลงเป็นออบเจกต์ Date ของ JavaScript
        const date1 = item.Time_start?.toDate(); // แปลงเป็นออบเจกต์ Date ของ JavaScript
        dateString_End = date?.toDateString(); // แปลงเป็นสตริงวันที่ที่อ่านได้
        dateString_start = date1?.toDateString(); // แปลงเป็นสตริงวันที่ที่อ่านได้
        return (
          <View style={styles.container}>
            <ScrollView style={styles.itemsContainer}>
              <View style={styles.item}>
                <Image
                  source={{
                    uri: item?.image_url,
                  }}
                  style={styles.itemImage}
                />
                <Text>
                  ชื่ออาหาร {item?.NameFood}
                  {"\n"}
                  วันที่ซื้อ {dateString_start}
                  {"\n"}
                  วันหมดอายุ {dateString_End}
                  {"\n"}
                </Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() =>
                    navigation.navigate("EditScreen", { item, documentId })
                  }
                >
                  <AntDesign name="edit" size={16} color="black" />
                </TouchableOpacity>
                <Button
                  title="Press to schedule a notification"
                  onPress={async () => {
                    await schedulePushNotification();
                  }}
                />
              </View>
            </ScrollView>
          </View>
        );
      }}
    />
  );
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
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
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: "b1a5dde0-5cba-4f75-b805-43c5dc43c97e",
      })
    ).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}

async function schedulePushNotification(foodName) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: foodName + " is going to expired! 📬",
      body: foodName + " in the notification body",
      data: { data: "MyFridge" },
    },
    trigger: { seconds: 2 },
  });
  console.log("notification success");
}

// async function schedulePushNotification() {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "You've got mail! 📬",
//       body: "Here is the notification body",
//       data: { data: "MyFridge" },
//     },
//     trigger: { seconds: 2 },
//   });
//   console.log("notification success");
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: "#4CAF50",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    color: "white",
  },
  addButton: {
    margin: 15,
    padding: 15,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    lineHeight: "64px",
  },
  addButtonText: {
    color: "white",
  },
  itemsContainer: {
    flex: 1,
  },
  item: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemImage: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  footer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  footerButton: {
    flex: 1,
    padding: 15,
    alignItems: "center",
  },
});
