import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Button, Alert } from "react-native";
import { auth, db } from "../../firebase/firebase";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

const RegistrationScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const addUser = async () => {
    try {
      console.log("uid addmechanic", auth.currentUser.uid);

      const usersCollectionRef = collection(db, "Myfridge");
      const usersDocRef = doc(usersCollectionRef, auth.currentUser.uid);
      const userSnap = await getDoc(usersDocRef);

      if (!userSnap.exists()) {
        await setDoc(usersDocRef, {
          id: auth.currentUser.uid,
          email: email,
          username: username,
          password: password,
        });
        // updateID();
        console.log("add user success");
      }
    } catch (error) {
      console.log("addmechanic error", error);
    }
  };

  const signup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        console.log("signup success firebase", user.uid);
        await addUser();
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          setFirebaseError("อีเมลนี้มีผู้ใช้งานแล้ว");
        } else if (error.code === "auth/invalid-email") {
          setFirebaseError("กรุณากรอกอีเมลให้ถูกต้อง");
        }

        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("signup error", errorCode, errorMessage);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Fridge</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <Button title="Register" onPress={signup} color="#1abc9c" />
      {/* <Button
        title="Register"
        onPress={() => {
          console.log(username + password + email);
        }}
        color="#1abc9c"
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
});

export default RegistrationScreen;
