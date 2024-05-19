import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Button, Alert } from "react-native";
import { auth, db } from "../../firebase/firebase";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { TouchableOpacity } from "react-native-gesture-handler";

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
      <Text style={styles.title}>ตู้เย็นของฉัน</Text>
      <TextInput
        placeholder="ชื่อผู้ใช้งาน"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="อีเมล์"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="รหัสผ่าน"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={signup}>
        <Text style={styles.buttonText}>สมัครสมาชิก</Text>
      </TouchableOpacity>
      {/* <Button title="Register" onPress={signup} color="#1abc9c" /> */}
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
    backgroundColor: "white",
  },
  header: {
    backgroundColor: "#4CAF50",
    width: "100%",
    padding: 20,
  },
  headerText: {
    textAlign: "center",
    color: "white",
    fontSize: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 20,
  },
  input: {
    width: "80%",
    padding: 15,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
});

export default RegistrationScreen;
