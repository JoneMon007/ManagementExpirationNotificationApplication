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
  Alert,
} from "react-native";
// import { auth, db } from "../firebase/firebase";
import { useState, useEffect } from "react";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { useRef } from "react";
import * as Device from "expo-device";
import { auth, db } from "../firebase/firebase";
// import axios from "axios";
// import axios from "axios";

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
  const [isConnected, setIsConnected] = useState(false);

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
          // sendLineNotification(foodData?.NameFood, timeDiff);
        }
        if (timeDiff === 3) {
          console.log("timeDifference = 3");
          schedulePushNotification(foodData?.NameFood, timeDiff);
          // sendLineNotification(foodData?.NameFood, timeDiff);
        }
        if (timeDiff <= 0) {
          console.log("timeDifference = 0");
          schedulePushNotification2(foodData?.NameFood, timeDiff);
          // sendLineNotification(foodData?.NameFood, timeDiff);
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

  // const sendLineNotification = async (foodName, timeDiff) => {
  //   try {
  //     const response = await axios({
  //       method: "post",
  //       url: "https://notify-api.line.me/api/notify",
  //       headers: {
  //         "Content-Type": "application/x-www-form-urlencoded",
  //         Authorization: `Bearer PxPUKdQYEKHqAXTLVcZYw9Soe9GrPKYths1CrJHVNW8`,
  //       },
  //       data: `message=${encodeURIComponent(
  //         foodName + ` is going to expire! in ${timeDiff} days`
  //       )}`, // ใช้ encodeURIComponent และระบุ key ว่าเป็น 'message'
  //     });
  //     console.log("Notification sent", response.data);
  //   } catch (error) {
  //     console.error("Failed to send notification", error);
  //   }
  // };

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

  async function schedulePushNotification2(foodName) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: foodName + ` is expired! 📬`,
        body: foodName + ` is expired! `,
        data: { data: "MyFridge" },
      },
      trigger: { seconds: 2 },
    });
    console.log("notification2 success");
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
        const itemTimeEnd = item.Time_End?.toDate()
          ? formatDate(item.Time_End.toDate()) // สมมติว่าคุณมีฟังก์ชัน formatDate ที่ปรับ format วันที่เป็น string
          : "";
        const itemcategory = item?.Category ? item.Category.toUpperCase() : "";
        const textData = text.toUpperCase();
        const itemDate = item?.dateString?.toUpperCase() || "";

        return (
          itemData.indexOf(textData) > -1 ||
          itemTimeEnd.indexOf(textData) > -1 ||
          itemDate.indexOf(textData) > -1 ||
          itemcategory.indexOf(textData) > -1
        );
      });
      setFilteredData(newData);
      // setFoodList(newData);
    }
  };
  function formatDate(date) {
    // กำหนดตัวเลือกสำหรับการแสดงวันที่ในภาษาไทยและใช้รูปแบบวันที่แบบไทย
    const options = {
      day: "2-digit", // ใช้วันที่แบบ 2 หลัก (เช่น 01, 02, ..., 31)
      month: "2-digit", // ใช้เดือนแบบ 2 หลัก (เช่น 01, 02, ..., 12)
      year: "numeric", // ใช้ปีแบบเต็ม (เช่น 2024)
    };

    // ใช้ toLocaleDateString โดยระบุภาษาเป็น 'th-TH' สำหรับประเทศไทย
    return date.toLocaleDateString("th-TH", options);
  }
  //ปุ่มลบ
  const handleDelete = async (itemId) => {
    const docRef = doc(
      db,
      "Myfridge",
      auth.currentUser.uid,
      "UserDetail",
      itemId
    );

    try {
      await updateDoc(docRef, {
        Status: 0,
      });

      const querySnapshot = await getDocs(
        collection(db, "Myfridge", auth.currentUser.uid, "UserDetail")
      );

      const data = querySnapshot.docs.map((item) => item.data());

      const filterData = data.filter((item) => {
        return item?.Status === 1;
      });

      console.log(filterData);

      setFoodList(filterData); // อัพเดตสถานะของรายการใน state
    } catch (error) {
      console.log("error handleDelete, " + error);
    }
  };

  const handleDeleteConfirmation = (itemId) => {
    Alert.alert(
      "ยืนยันการลบ",
      "คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?",
      [
        {
          text: "ยกเลิก",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "ยืนยัน",
          onPress: () => handleDelete(itemId),
        },
      ],
      { cancelable: false }
    );
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
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="ค้นหา"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <FlatList
        data={
          searchQuery
            ? filteredData.filter((item) => item.Status === 1)
            : foodList.filter((item) => item.Status === 1)
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={food} />
        }
        renderItem={({ item }) => {
          let dateString = "";
          const date = item.Time_End?.toDate(); // แปลงเป็นออบเจกต์ Date ของ JavaScript
          const date1 = item.Time_start?.toDate(); // แปลงเป็นออบเจกต์ Date ของ JavaScript
          dateString_End = date?.toDateString(); // แปลงเป็นสตริงวันที่ที่อ่านได้
          dateString_start = date1?.toDateString(); // แปลงเป็นสตริงวันที่ที่อ่านได้
          const expiryDate = new Date(item?.Time_End?.toDate());
          const currentDate = new Date();
          const timeDifference = expiryDate - currentDate;
          const timeDiff = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
          const backgroundColor = isConnected ? "green" : "red";

          return (
            //อันที่2
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("EditScreen", { item, documentId })
              }
            >
              <ScrollView>
                <View
                  style={
                    // วันที่ มากว่า 7 วัน ส๊เขียว 3 สีเหลือง หมดอายุสีอกง
                    timeDiff <= 0
                      ? styles.itemContainer
                      : timeDiff <= 3
                      ? styles.itemContainer_yellow
                      : styles.itemContainer_green
                  }
                >
                  <Image
                    source={{
                      uri: item?.image_url
                        ? item?.image_url
                        : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
                    }}
                    style={styles.image}
                  />
                  <View style={styles.detailsContainer}>
                    <Text style={styles.foodName}>{item?.NameFood}</Text>
                    <Text style={styles.date}>
                      วันผลิต: {formatDate(item.Time_start.toDate())}
                    </Text>
                    <Text style={styles.date}>
                      วันหมดอายุ: {formatDate(item.Time_End.toDate())}
                    </Text>
                    <Text
                      style={
                        item?.totalQuantity >= 0.25 * item?.Quantity
                          ? styles.date
                          : styles.date_red
                      }
                    >
                      จำนวนวัดถุดิบคงเหลือ:{" "}
                      {item?.totalQuantity || item?.totalQuantity === 0
                        ? item?.totalQuantity
                        : item?.Quantity}{" "}
                      {item?.Unit}
                    </Text>
                    <MaterialCommunityIcons
                      onPress={() => handleDeleteConfirmation(item.documentId)}
                      style={{ position: "absolute", right: 10, top: 10 }} // ปรับตำแหน่งปุ่ม
                      name="delete"
                      color="#ffff"
                      size={26}
                    />
                  </View>
                </View>
              </ScrollView>
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
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  itemContainer_yellow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#FFC300",
    margin: 10,
  },
  itemContainer_green: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#91d6a5",
    margin: 10,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#FF231F7C",
    margin: 10,
  },
  image: {
    width: 60,
    height: 60,
    margin: 10,
    borderRadius: 10,
  },
  detailsContainer: {
    flex: 1,
  },
  foodName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
  },
  date: {
    fontSize: 18,
    color: "#ffffff",
  },
  date_red: {
    fontSize: 18,
    color: "#FF7158",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 4,
    margin: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 8,
  },
  searchIcon: {
    marginRight: 8,
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
