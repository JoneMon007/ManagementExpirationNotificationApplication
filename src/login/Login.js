import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Input, Button } from "react-native-elements";
import { auth } from "../../firebase/firebase";
import { useNavigation } from "@react-navigation/native";

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
        placeholder="Email"
        leftIcon={{ type: "font-awesome", name: "user" }}
        onChangeText={(value) => setEmail(value)}
        value={email}
      />
      <Input
        placeholder="Password"
        secureTextEntry={true}
        leftIcon={{ type: "font-awesome", name: "lock" }}
        onChangeText={(value) => setPassword(value)}
        value={password}
      />
      <Button title="Login" onPress={signin} />
      <Button
        title="Register"
        onPress={() => navigation.navigate("Register")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
});
