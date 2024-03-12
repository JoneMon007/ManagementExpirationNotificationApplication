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
} from "react-native";
import { db } from "../firebase/firebase";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const [foodList, setFoodList] = useState([]);
  const [documentId, setDocumentId] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation(); // ใช้ hook useNavigation

  // async function schedulePushNotification() {
  //   await Notifications.scheduleNotificationAsync({
  //     content: {
  //       title: "You've got mail! 📬",
  //       body: 'Here is the notification body',
  //       data: { data: 'goes here' },
  //     },
  //     trigger: { seconds: 2 },
  //   });
  // }

  async function food() {
    setRefreshing(true);
    try {
      const querySnapshot = await getDocs(
        collection(db, "Myfridge", "UserID", "UserDetail")
      );

      const data = querySnapshot.docs.map((item) => item.data());
      const id = querySnapshot.docs.map((item) => item.id);
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
              </View>
            </ScrollView>
          </View>
        );
      }}
    />
  );
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
