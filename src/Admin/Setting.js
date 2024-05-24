import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { signOut } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { TextInput } from "react-native-paper";
import { auth, db } from "../../firebase/firebase";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Image } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

const Setting = () => {
  const [notification, setNotification] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [notification_1, setNotification_1] = useState(
    notification?.Notification_1
  );
  const [notification_2, setNotification_2] = useState(
    notification?.Notification_2
  );
  const [notification_3, setNotification_3] = useState(
    notification?.Notification_3
  );
  const [notification_vegetable, setNotification_Vegetable] = useState(
    notification?.Notification_Vegetable
  );
  const [notification_drink, setNotification_Drink] = useState(
    notification?.Notification_Drink
  );
  const [notification_fruit, setNotification_Fruit] = useState(
    notification?.Notification_Fruit
  );
  const [notification_meat, setNotification_Meat] = useState(
    notification?.Notification_Meat
  );
  const [loadingAddItem, setLoadingAddItem] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Notification"));
        const users = querySnapshot.docs.map((doc) => doc.data());
        console.log(users); // Log the data fetched from firestore
        setNotification(users); // Set the data to state
        console.log(notification.Notification_1);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);
  useEffect(() => {
    if (notification.length > 0) {
      // Set all notification related states here
      setNotification_1(notification[0].Notification_1);
      setNotification_2(notification[0].Notification_2);
      setNotification_3(notification[0].Notification_3);
      setNotification_Vegetable(notification[0].Notification_Vegetable);
      setNotification_Drink(notification[0].Notification_Drink);
      setNotification_Fruit(notification[0].Notification_Fruit);
      setNotification_Meat(notification[0].Notification_Meat);
    }
  }, [notification]); // Depend on notification state

  async function addItem() {
    setLoadingAddItem(true);
    const tokensCollectionRef = doc(db, "Notification", auth.currentUser.uid);
    // const tokensCollectionRef = doc(db, "Notification", "NotificationDetail");
    try {
      await updateDoc(tokensCollectionRef, {
        ID_update: auth.currentUser.uid,
        Time_update: new Date(Date.now()),
        Notification_1: notification_1,
        Notification_2: notification_2,
        Notification_3: notification_3,
        Notification_Vegetable: notification_vegetable,
        Notification_Drink: notification_drink,
        Notification_Fruit: notification_fruit,
        Notification_Meat: notification_meat,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingAddItem(false);
    }
    console.log(
      "Update success :" + notification_1,
      notification_2,
      notification_3
    );
    setNotification_1("");
    setNotification_2("");
    setNotification_3("");
  }
  if (loadingAddItem) {
    return (
      <ActivityIndicator
        size={100}
        color={"#4CAF50"}
        style={{ alignItems: "center", flex: 1 }}
      />
    );
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>ตั้งค่าการแจ้งเตือน</Text>
        </View>
        <Text style={styles.text}>แจ้งเตือนครั้งที่ 1 (วัน)</Text>
        <TextInput
          placeholder="แจ้งเตือนครั้งที่ 1 (วัน)"
          style={styles.input}
          value={notification_1}
          onChangeText={setNotification_1}
          keyboardType="number-pad"
          //   editable={false}
        />
        <Text style={styles.text}>แจ้งเตือนครั้งที่ 2 (วัน) </Text>
        <TextInput
          style={styles.input}
          placeholder="แจ้งเตือนครั้งที่ 2 (วัน)"
          value={notification_2}
          onChangeText={setNotification_2}
          keyboardType="number-pad"
        />
        <Text style={styles.text}>แจ้งเตือนครั้งที่ 3 (วัน) </Text>
        <TextInput
          style={styles.input}
          placeholder="แจ้งเตือนครั้งที่ 3 (วัน)"
          value={notification_3}
          onChangeText={setNotification_3}
          keyboardType="number-pad"
        />

        <View style={styles.header}>
          <Text style={styles.title}>ตั้งค่าประเภทวัตถุดิบการแจ้งเตือน</Text>
        </View>

        <Text style={styles.text}>ผัก (วัน) </Text>
        <TextInput
          placeholder="เลือกจำนวนวัน"
          style={styles.input}
          value={notification_vegetable}
          onChangeText={setNotification_Vegetable}
          keyboardType="number-pad"
          //   editable={false}
        />
        <Text style={styles.text}>เครื่องดื่ม (วัน) </Text>
        <TextInput
          style={styles.input}
          placeholder="เลือกจำนวนวัน"
          value={notification_drink}
          onChangeText={setNotification_Drink}
          keyboardType="number-pad"
        />
        <Text style={styles.text}>ผลไม้ (วัน) </Text>
        <TextInput
          style={styles.input}
          placeholder="เลือกจำนวนวัน"
          value={notification_fruit}
          onChangeText={setNotification_Fruit}
          keyboardType="number-pad"
        />
        <Text style={styles.text}>เนื้อ (วัน) </Text>
        <TextInput
          style={styles.input}
          placeholder="เลือกจำนวนวัน"
          value={notification_meat}
          onChangeText={setNotification_Meat}
          keyboardType="number-pad"
        />

        <Pressable style={styles.button} onPress={addItem}>
          <Text style={styles.text}>แก้ไขการตั้งค่า</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    color: "#4CAF50",
    alignItems: "center",
    minHeight: "50px",
    minWidth: "20%",
    maxWidth: 500,
    fontWeight: "800",
    marginTop: 15, // Increase this value to create more space above the button
  },
  closeButton: {
    padding: 10,
  },
  input: {
    fontSize: 18,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },
  imagePicker: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    width: 100,
    height: 100,
    marginTop: 10,
  },
  picker: {
    marginTop: 10,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#4CAF50",
    marginTop: 15, // Increase this value to create more space above the button
  },
  text: {
    fontSize: 18,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    marginTop: 15, // Increase this value to create more space above the button
  },
});

export default Setting;
