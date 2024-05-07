import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import * as ImagePicker from "expo-image-picker";

const Profile = () => {
  const [foodData, setFoodData] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(
        collection(db, "Myfridge", auth.currentUser.uid)
      );
      const data = querySnapshot.docs.map((doc) => doc.data());
      setFoodData(data);
    };

    fetchData();
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

  return (
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
      {foodData.map((item, index) => (
        <View key={index}>
          <Text style={styles.email}>{item.email}99</Text>
          <Text style={styles.name}>{item.username}99</Text>
        </View>
      ))}
      <Pressable style={styles.button} onPress={logOut}>
        <Text style={styles.text}>
          Log Out
          <MaterialCommunityIcons name="logout" color="#ffff" size={26} />
        </Text>
      </Pressable>
    </View>
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
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: "#666",
  },
  logout: {},
  button: {
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
