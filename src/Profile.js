import { MaterialCommunityIcons } from "@expo/vector-icons";
import { signOut } from "firebase/auth";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Button,
  ImagePicker,
  StyleSheet,
} from "react-native";
import { Header, Divider } from "react-native-elements";
import { TextInput } from "react-native-paper";
import { auth } from "../firebase/firebase";

const Profile = ({ name, email, profilePicture }) => {
  const handleImageSelect = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const logOut = () => {
    signOut(auth)
      .then(() => {
        console.log("logout success");
      })
      .catch((error) => {
        console.log("logout error ", error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.profilePictureContainer}>
        {profilePicture ? (
          <Image
            source={{ uri: profilePicture }}
            style={styles.profilePicture}
          />
        ) : (
          <Text style={styles.profilePicturePlaceholder}>Image Profile</Text>
        )}
      </View>
      <Text style={styles.name}>Test1</Text>
      <Text style={styles.email}>test1@gmail.com</Text>
      <Text>logout</Text>
      <MaterialCommunityIcons
        name="logout"
        color={"#000"}
        size={26}
        onPress={logOut}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
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
});

export default Profile;
