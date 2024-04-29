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
  TextInput,
} from "react-native";
import { auth, db } from "../firebase/firebase";
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
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  async function food() {
    setRefreshing(true);
    console.log("Loading food");
    try {
      const querySnapshot = await getDocs(
        collection(db, "Myfridge", auth.currentUser.uid, "UserDetail")
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
        // console.log(expiryDate);
        const currentDate = new Date();
        const timeDifference = expiryDate - currentDate;
        const timeDiff = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        console.log("timeDiff ", timeDiff);

        if (timeDiff === 7) {
          console.log("timeDifference = 7");
          schedulePushNotification(foodData?.NameFood, timeDiff);
        }
        if (timeDiff === 3) {
          console.log("timeDifference = 3");
          schedulePushNotification(foodData?.NameFood, timeDiff);
        }
        if (timeDiff <= 0) {
          console.log("timeDifference = 0");
          schedulePushNotification(foodData?.NameFood, timeDiff);
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

  async function schedulePushNotification(foodName, timeDiff) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: foodName + ` is going to expired! in ${timeDiff} day 📬`,
        body: foodName + ` is going to expired! in ${timeDiff} day`,
        data: { data: "MyFridge" },
      },
      trigger: { seconds: 2 },
    });
    console.log("notification success");
  }

  //ค้นหา;
  const handleSearch = (text) => {
    setSearchQuery(text);

    if (!text) {
      console.log("handelSearch !text");
      setFilteredData(null);
      return;
    }

    if (text) {
      console.log("handelSearch text");
      // ทำการกรองหรือค้นหาข้อมูลที่นี่
      const newData = foodList?.filter((item) => {
        // คุณอาจต้องปรับเงื่อนไขกรองให้ตรงกับข้อมูลของคุณ
        const itemData = item?.NameFood
          ? item?.NameFood.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredData(newData);
      // setFoodList(newData);
    }
  };

  useEffect(() => {
    console.log("food useEffect");
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
    <>
      <TextInput
        placeholder="Search here..."
        value={searchQuery}
        onChangeText={handleSearch} // Make sure to pass the handleSearch function here
        style={styles.searchInput} // Assuming you have styles defined for the search input
      />

      <FlatList
        data={searchQuery ? filteredData : foodList}
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
            //อันที่2
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("EditScreen", { item, documentId })
              }
            >
              <View style={styles.container}>
                {/* Place the TextInput outside of the ScrollView to ensure it's only rendered once */}
                <ScrollView style={styles.itemsContainer}>
                  {/* Loop through your items here */}
                  <View style={styles.item}>
                    <Image
                      source={{
                        uri: item?.image_url
                          ? item?.image_url
                          : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
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
                    {/* <TouchableOpacity
                    style={styles.addButton}
                    onPress={() =>
                      navigation.navigate("EditScreen", { item, documentId })
                    }
                  >
                    <AntDesign name="edit" size={16} color="black" />
                  </TouchableOpacity> */}
                  </View>
                </ScrollView>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </>
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
