import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import * as ImagePicker from "expo-image-picker";
import { TextInput } from "react-native-paper";

const Profile = () => {
  const [userData, setUser] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);
  const [linetoken, setLineToken] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const userDocRef = doc(db, "Myfridge", auth.currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        console.log("Main user document data:", userDocSnap.data());
        setUser(userDocSnap.data());
      } else {
        console.log("No such user document!");
      }
    };

    // Use this function with the UID of the user
    fetchUserData();
    // setFoodData();
    console.log(auth.currentUser.uid);
  }, []);

  const handleImageSelect = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      setProfilePicture(result.uri);
    }
  };

  const logOut = () => {
    signOut(auth)
      .then(() => {
        console.log("logout success");
      })
      .catch((error) => {
        console.log("logout error", error);
      });
  };
  // const openPDF = () => {
  //   // Here you would implement the method to open the PDF.
  //   // This is a placeholder function. You would need to use
  //   // react-native-pdf or another library to actually open the PDF.
  // };

  async function addItem() {
    const tokensCollectionRef = doc(db, "Myfridge", auth.currentUser.uid);
    // const userDocRef = doc(db, "Myfridge", auth.currentUser.uid);
    // const tokensCollectionRef = collection(userDocRef,"Tokens");
    try {
      await updateDoc(tokensCollectionRef, {
        LineToken: linetoken,
      });

      console.log("LineToken :", linetoken);
    } catch (error) {
      console.log(error);
    }
    setLineToken("");
    //setSelectedDate(new Date());
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.profilePictureContainer}>
          <Image
            source={{
              uri:
                profilePicture ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
            }}
            style={styles.profilePicture}
          />
        </View>
        <View>
          <Text style={styles.name}>{userData?.username}</Text>
          <Text style={styles.email}>{userData?.email}</Text>
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
