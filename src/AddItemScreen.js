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
  ScrollView,
  ActivityIndicator,
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
import dayjs from "dayjs";
import { useNavigation } from "@react-navigation/native";

export default function AddItemScreen() {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("ผัก");
  const [image, setImage] = useState(null);
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [unit, setunit] = useState("กรัม");
  const [totalQuantity, settotalQuantity] = useState("");
  const [status, setstatus] = useState(1);
  const [Numnotification, setnumNotification] = useState([]);
  const [loadingAddItem, setLoadingAddItem] = useState(false);
  const navigation = useNavigation(); // ใช้ hook useNavigation

  useEffect(() => {
    const fetchUserData = async () => {
      const userDocRef = doc(
        db,
        "Notification",
        "s0VWfSTXvhQTjgwjj9cPzOYVTPR2"
      );
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        // console.log("Main user document data:", userDocSnap.data());
        setnumNotification(userDocSnap.data());
      } else {
        console.log("No such user document!");
      }
    };
    console.log("food useEffect");
    fetchUserData();
  }, []);

  const handleunitChange = (itemValue) => {
    setunit(itemValue);
  };
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
      newDate = dayjs().add(Numnotification.Notification_Fruit, "day").toDate(); // ตัวอย่างการตั้งค่าเริ่มต้น
    }
    const dateObject = new Date(newDate);
    setDate(dateObject); // ตั้งค่า state ด้วยวัตถุ Date
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

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      console.log(result.assets[0].uri);
    }
  };

  async function handleUploadImage(uri) {
    await saveImageInfoToFirestore(imageUrl);
  }

  async function addItem() {
    setLoadingAddItem(true);

    if (!itemName || !quantity || !category || !image || !selectedDate) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
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
        Time_End: date,
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
    } finally {
      setLoadingAddItem(false);
    }

    setItemName("");
    setQuantity("");
    setImage(null);
    //setSelectedDate(new Date());
    setDate();
    navigation.navigate("Home");
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
          <Text style={styles.title}>เพิ่มวัตถุดิบ</Text>
        </View>

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

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>เลือกประเภทวัตถุดิบ : </Text>
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
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>ชื่อวัตถุดิบ : </Text>
          <TextInput
            style={styles.input}
            placeholder="ชื่อวัตถุดิบ"
            value={itemName}
            onChangeText={setItemName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>จำนวนวัตถุดิบ : </Text>
          <TextInput
            style={styles.input}
            placeholder="จำนวนวัตถุดิบ"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>เลือกประเภทของจำนวน : </Text>
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
            <Picker.Item label="ตัว" value="ตัว" />
          </Picker>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>วันที่เลือก : </Text>
          <TextInput
            editable={false}
            selectTextOnFocus={false} // ปิดการเลือกข้อความเมื่อได้รับการโฟกัส
            caretHidden={true}
            style={[styles.input]}
          >
            {date ? date.toDateString() : ""}
          </TextInput>
        </View>
        <DateTimeComponent value={date} setDate={setDate} date={date} />

        <Pressable style={styles.button} onPress={addItem}>
          <Text style={styles.text}>เพิ่มวัตถุดิบ !</Text>
        </Pressable>
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10, // ระยะห่างจากบรรทัดอื่น
  },
  inputLabel: {
    marginRight: 10, // ระยะห่างจาก TextInput
    fontSize: 16, // ปรับขนาดตามต้องการ
  },
  input: {
    flex: 1, // ให้ TextInput ขยายเต็มที่
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
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
    flex: 1,
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
