// import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Input, Button, Text } from "react-native-elements";
// import { auth } from "../../firebase/firebase";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const signin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("signin firebase success", user.email, user.uid);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("signin firebase error", errorCode, errorMessage);
      });
  };

  return (
    <View style={styles.container}>
      <Input
        style={styles.title}
        placeholder="  อีเมล"
        leftIcon={{ type: "font-awesome", name: "user" }}
        onChangeText={(value) => setEmail(value)}
        value={email}
      />
      <Input
        style={styles.title}
        placeholder="  รหัสผ่าน"
        secureTextEntry={true}
        leftIcon={{ type: "font-awesome", name: "lock" }}
        onChangeText={(value) => setPassword(value)}
        value={password}
      />
      <TouchableOpacity style={styles.button} onPress={signin}>
        <Text style={styles.buttonText}>เข้าสู่ระบบ</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.buttonText}>ลงทะเบียน</Text>
      </TouchableOpacity>

      {/* <Button title="Login" onPress={signin} />
      <Button
        title="Register"
        onPress={() => navigation.navigate("Register")}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  header: {
    position: "fixed", // Add this line to make the header fixed
    top: 0,
    left: 0,
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
  addButton: {
    margin: 15,
    padding: 15,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    lineHeight: "100px",
  },
});
