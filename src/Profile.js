import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import * as ImagePicker from "expo-image-picker";
import { TextInput } from "react-native-paper";
import { uploadImageAsync } from "./uploadImageAsync";

const Profile = () => {
  const [userData, setUser] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);
  const [linetoken, setLineToken] = useState("");
  const [image, setImage] = useState(null);
  const [loadingAddItem, setLoadingAddItem] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const userDocRef = doc(db, "Myfridge", auth.currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        console.log("Main user document data:", userDocSnap.data());

        setUser(userDocSnap.data());
        setImage(userData?.image_url);
        console.log("image  : " + image);
      } else {
        console.log("No such user document!");
      }
    };

    // Use this function with the UID of the user
    fetchUserData();
    // setFoodData();
    console.log(auth.currentUser.uid);
  }, []);
  const logOut = () => {
    signOut(auth)
      .then(() => {
        console.log("logout success");
      })
      .catch((error) => {
        console.log("logout error", error);
      });
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
    if (!linetoken) {
      alert("กรุณากรอกข้อมูล linetoken");
      return;
    }
    setLoadingAddItem(true);
    const tokensCollectionRef = doc(db, "Myfridge", auth.currentUser.uid);
    const imageUrl = await uploadImageAsync(image);
    try {
      await updateDoc(tokensCollectionRef, {
        image_url: imageUrl,
        LineToken: linetoken,
      });

      console.log("LineToken :", linetoken);
    } catch (error) {
      console.log(error);
    }
    setLineToken("");
    //setSelectedDate(new Date());
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
        <View style={styles.profilePictureContainer}>
          <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
            {image ? (
              <Image
                source={{
                  uri:
                    userData?.image_url ||
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
                }}
                style={styles.profilePicture}
              />
            ) : (
              <Text>เพิ่มรูปโปรไฟล์</Text>
            )}
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.name}>Username : {userData?.username}</Text>
          <Text style={styles.email}>Email : {userData?.email}</Text>
          <Text style={styles.email}></Text>
          <TextInput
            style={styles.input}
            placeholder="เพิ่ม line token"
            value={linetoken}
            onChangeText={setLineToken}
          />
          <Pressable style={styles.button} onPress={addItem}>
            <Text style={styles.text}>เพิ่ม line token !</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() =>
              Linking.openURL(
                "https://regist.oas.psu.ac.th/Manual_LINE_Notify.pdf"
              )
            }
          >
            <Text style={styles.text}>วิธีการขอ line token</Text>
          </Pressable>
        </View>
        <Pressable style={styles.button} onPress={logOut}>
          <Text style={styles.text}>
            ออกจากระบบ
            <MaterialCommunityIcons name="logout" color="#ffff" size={26} />
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  profilePictureContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#d9d9d9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profilePicturePlaceholder: {
    color: "#999",
  },
  name: {
    // flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  email: {
    // flex: 1,
    fontSize: 16,
    color: "#666",
  },
  logout: {},
  button: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#4CAF50",
    marginBottom: 30,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});

export default Profile;
