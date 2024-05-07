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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";
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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [category, setCategory] = useState("vegetable");

  const handleCategoryChange = (itemValue) => {
    setCategory(itemValue);

    if (itemValue === "meat") {
      const seven = dayjs().add(7, "day").toDate();
      console.log("meat seven ", seven);
      setSelectedDate(seven);

      console.log("selectedDate addItemScreen", selectedDate);
    } else if (itemValue === "vegetable") {
      const fourteen = dayjs().add(14, "day").toDate();
      setSelectedDate(fourteen);
      console.log("vegetable fourteen ", fourteen);
    } else if (itemValue === "drink") {
      const month = dayjs().add(30, "day").toDate();
      setSelectedDate(month);
      console.log("drink month ", month);
    } else {
      const fourteen = dayjs().add(14, "day").toDate();
      setSelectedDate(fourteen);
      console.log("Fruit fourteen ", fourteen);
    }
  };

  console.log("item==>", item, "doc==>", documentId);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
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
    try {
      await updateDoc(docRef, {
        NameFood: itemName,
        Time_start: new Date(Date.now()),
        Quantity: quantity,
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
        <View style={styles.header}>
          <Text style={styles.title}>Add an item</Text>
          <TouchableOpacity style={styles.closeButton}>
            <Text>X</Text>
          </TouchableOpacity>
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
          <Picker.Item label="Vegetable 🥦" value="vegetable" />
          <Picker.Item label="Drink 🥂" value="drink" />
          <Picker.Item label="Fruit 🍎" value="fruit" />
          <Picker.Item label="Meat 🥩" value="meat" />
        </Picker>

        <TextInput
          style={styles.input}
          placeholder="Item name"
          value={itemName}
          onChangeText={setItemName}
        />

        <TextInput
          style={styles.input}
          placeholder="Quantity"
          value={quantity}
          onChangeText={setQuantity}
        />
        <DateTimeComponent value={selectedDate} />
        <Pressable style={styles.button} onPress={addItem}>
          <Text style={styles.text}>Update item</Text>
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
