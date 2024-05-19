import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import DateTimeComponent from "./DateTimePicker";
import { uploadImageAsync } from "./uploadImageAsync";
import dayjs from "dayjs";

export default function AddItemScreen() {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("vegetable");
  const [image, setImage] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [unit, setunit] = useState("Gram");
  const [totalQuantity, settotalQuantity] = useState("");
  const [status, setstatus] = useState(1);

  const handleunitChange = (itemValue) => {
    setunit(itemValue);
  };
  const handleCategoryChange = (itemValue) => {
    setCategory(itemValue);

    if (itemValue === "เนื้อ") {
      const seven = dayjs().add(7, "day").toDate();
      console.log("meat seven ", seven);
      setSelectedDate(seven);

      console.log("selectedDate addItemScreen", selectedDate);
    } else if (itemValue === "ผัก") {
      const fourteen = dayjs().add(14, "day").toDate();
      setSelectedDate(fourteen);
      console.log("vegetable fourteen ", fourteen);
    } else if (itemValue === "เครื่องดื่ม") {
      const month = dayjs().add(30, "day").toDate();
      setSelectedDate(month);
      console.log("drink month ", month);
    } else {
      const fourteen = dayjs().add(14, "day").toDate();
      setSelectedDate(fourteen);
      console.log("Fruit fourteen ", fourteen);
    }
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

  async function handleUploadImage(uri) {
    await saveImageInfoToFirestore(imageUrl);
  }

  async function addItem() {
    const userRef = doc(db, "Myfridge", auth.currentUser.uid);
    const postRef = collection(userRef, "UserDetail");
    const imageUrl = await uploadImageAsync(image);

    try {
      const item = await addDoc(postRef, {
        NameFood: itemName,
        Category: category,
        Time_start: new Date(Date.now()),
        totalQuantity: quantity,
        Quantity: quantity,
        Time_End: selectedDate,
        image_url: imageUrl,
        Unit: unit,
        Status: status,
      });

      console.log("category :", category);

      await updateDoc(item, {
        documentId: item.id,
      });
    } catch (error) {
      console.log(error);
    }
    setItemName("");
    setQuantity("");
    setImage(null);
    //setSelectedDate(new Date());
  }
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Add an item</Text>
        </View>

        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          {image ? (
            <Image
              source={{ uri: image }}
              style={{ width: 100, height: 100 }}
            />
          ) : (
            <Text>Add Photo</Text>
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
          placeholder="จำนวนวัตถุดิบ"
          value={quantity}
          onChangeText={setQuantity}
        />
        <Picker
          selectedValue={unit}
          style={styles.picker}
          onValueChange={handleunitChange}
        >
          <Picker.Item label="กรัม" value="กรัม" />
          <Picker.Item label="กิโลกรัม" value="กิโลกรัม" />
          <Picker.Item label="ชิ้น" value="ชิ้น" />
          <Picker.Item label="ขวด" value="ขวด" />
          <Picker.Item label="แพ็ค" value="แพ็ค" />
          <Picker.Item label="ลูก" value="ลูก" />
        </Picker>

        <DateTimeComponent defaultValue={dayjs(selectedDate)} />
        {/* <DateTimeComponent value={selectedDate} /> */}

        <Pressable style={styles.button} onPress={addItem}>
          <Text style={styles.text}>Add item</Text>
        </Pressable>

        {/* <Button
        title="Add item"
        onPress={() => console.log(selectedDate + "AddItemScreen")}
      /> */}
        {/* <Button style={styles.button} title="Cancel" onPress={() => {}} /> */}
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
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
