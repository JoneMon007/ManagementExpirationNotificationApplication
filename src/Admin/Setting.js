import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Pressable,
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
    notification?.notification_1
  );
  const [notification_2, setNotification_2] = useState(
    notification?.notification_2
  );
  const [notification_3, setNotification_3] = useState(
    notification?.notification_3
  );
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Notification"));
        const users = querySnapshot.docs.map((doc) => doc.data());
        console.log(users); // Log the data fetched from firestore
        setNotification(users); // Set the data to state
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  async function addItem() {
    // const tokensCollectionRef = doc(
    //   db,
    //   "Notification",
    //   "NotificationDetail",
    //   "NotificationDetail_1"
    // );
    const tokensCollectionRef = doc(db, "Notification", auth.currentUser.uid);
    // const tokensCollectionRef = doc(db, "Notification", "NotificationDetail");
    try {
      await updateDoc(tokensCollectionRef, {
        ID_update: auth.currentUser.uid,
        Time_update: new Date(Date.now()),
        Notification_1: notification_1,
        Notification_2: notification_2,
        Notification_3: notification_3,
      });

      console.log("LineToken :", linetoken);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Setting</Text>
          <TouchableOpacity style={styles.closeButton}></TouchableOpacity>
        </View>
        <Text style={styles.text}>แจ้งเตือนครั้งที่ 1 (วัน)</Text>
        <TextInput
          placeholder="แจ้งเตือนครั้งที่ 1 (วัน)"
          style={styles.input}
          value={notification_1}
          onChangeText={setNotification_1}
          //   editable={false}
        />
        <Text style={styles.text}>แจ้งเตือนครั้งที่ 2 (วัน) </Text>
        <TextInput
          style={styles.input}
          placeholder="แจ้งเตือนครั้งที่ 2 (วัน)"
          value={notification_2}
          onChangeText={setNotification_2}
        />
        <Text style={styles.text}>แจ้งเตือนครั้งที่ 3 (วัน) </Text>
        <TextInput
          style={styles.input}
          placeholder="แจ้งเตือนครั้งที่ 3 (วัน)"
          value={notification_3}
          onChangeText={setNotification_3}
        />

        <Pressable style={styles.button} onPress={addItem}>
          <Text style={styles.text}>Update User</Text>
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
    fontSize: 25,
    color: "#4CAF50",
    alignItems: "center",
    minHeight: "50px",
    minWidth: "20%",
    maxWidth: 500,
    fontWeight: "800",
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
  },
  text: {
    fontSize: 18,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
  },
});

export default Setting;
