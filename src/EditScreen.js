import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  Image,
  Pressable,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import DateTimeComponent from "./DateTimePicker";
import { uploadImageAsync } from "./uploadImageAsync";
import { ScrollView } from "react-native-gesture-handler";
import dayjs from "dayjs";

export default function EditScreen({ route }) {
  const { item, documentId } = route.params;
  const [itemName, setItemName] = useState(item?.NameFood);
  const [quantity, setQuantity] = useState(item?.Quantity);
  const [image, setImage] = useState(item?.image_url);
  const [selectedDate, setSelectedDate] = useState(item?.Time_End);
  const [category, setCategory] = useState(item?.Category);
  const [totalQuantity, settotalQuantity] = useState(item?.totalQuantity || 0);
  const [materials_used, setmaterials_used] = useState(0);
  const [Numnotification, setnumNotification] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const userDocRef = doc(
        db,
        "Notification",
        "s0VWfSTXvhQTjgwjj9cPzOYVTPR2"
      );
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        console.log("Main user document data:", userDocSnap.data());
        setnumNotification(userDocSnap.data());
      } else {
        console.log("No such user document!");
      }
    };
    console.log("food useEffect");
    fetchUserData();
  }, []);

  const handleCategoryChange = (itemValue) => {
    setCategory(itemValue);
    let newDate;
    if (itemValue === "เนื้อ") {
      newDate = dayjs().add(Numnotification.Notification_Meat, "day").toDate();
    } else if (itemValue === "ผัก") {
      newDate = dayjs()
        .add(Numnotification.Notification_Vegetable, "day")
        .toDate();
    } else if (itemValue === "เครื่องดื่ม") {
      newDate = dayjs().add(Numnotification.Notification_Drink, "day").toDate();
    } else {
      newDate = dayjs().add(14, "day").toDate(); // ตัวอย่างการตั้งค่าเริ่มต้น
    }
    const dateObject = new Date(newDate);
    setSelectedDate(dateObject); // ตั้งค่า state ด้วยวัตถุ Date
    console.log("dateObject" + dateObject);

    console.log("Updated date based on category change: ", newDate);
  };

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.assets[0].uri);
      console.log(result.assets[0].uri);
    }
  };

  async function addItem() {
    const currentDate = new Date(); // สร้างวันที่ปัจจุบัน
    currentDate.setDate(currentDate.getDate() + 1); // เพิ่มวันที่ปัจจุบันด้วย 1
    const docRef = doc(
      db,
      "Myfridge",
      auth.currentUser.uid,
      "UserDetail",
      item?.documentId
    );
    const imageUrl = await uploadImageAsync(image);

    const values = Math.max(0, totalQuantity - materials_used);
    try {
      await updateDoc(docRef, {
        NameFood: itemName,
        Time_start: new Date(Date.now()),
        totalQuantity: values,
        Time_End: selectedDate,
        image_url: imageUrl,
        Category: category,
      });
      console.log("Document updated successfully");
    } catch (error) {
      console.log(error);
      console.error("Error updating document: ", error);
    }
    setItemName("");
    setQuantity("");
    setImage(null);
    setSelectedDate(new Date());
  }
  return (
    <ScrollView>
      <View style={styles.container}>
        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          {image ? (
            <Image
              source={{ uri: image }}
              style={{ width: 100, height: 100 }}
            />
          ) : (
            <Text>เพิ่มรูปวัตถุดิบ</Text>
          )}
        </TouchableOpacity>

        <Picker
          selectedValue={category}
          style={styles.picker}
          onValueChange={handleCategoryChange}
        >
          <Picker.Item label="ผัก 🥦" value="ผัก" />
          <Picker.Item label="เครื่องดื่ม 🥂" value="เครื่องดื่ม" />
          <Picker.Item label="ผลไม้ 🍎" value="ผลไม้" />
          <Picker.Item label="เนื้อ 🥩" value="เนื้อ" />
        </Picker>

        <TextInput
          style={styles.input}
          placeholder="ชื่อวัตถุดิบ"
          value={itemName}
          onChangeText={setItemName}
        />

        <TextInput
          style={styles.input}
          placeholder="วัตถุดิบที่ใช้ไปเท่าไร"
          onChangeText={setmaterials_used}
        />

        <DateTimeComponent value={selectedDate} />
        <Pressable style={styles.button} onPress={addItem}>
          <Text style={styles.text}>ตกลง</Text>
        </Pressable>
        {/* <Button
        title="Add item"
        onPress={() => console.log(selectedDate + "AddItemScreen")}
      /> */}
      </View>
    </ScrollView>
  );
}

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
    // marginVertical: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: "#ccc",
    // padding: 10,
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
    backgroundColor: "#d3d3d3", // darker gray for better contrast
    borderWidth: 2, // thicker border for better visibility
    borderColor: "#a9a9a9", // darker gray border
    borderRadius: 5,
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
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
