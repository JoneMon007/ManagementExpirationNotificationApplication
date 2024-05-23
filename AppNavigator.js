import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
// import LoginScreen from './login';
import HomeScreen from "./src/HomeScreen";
import ShoppingListScreen from "./src/ShoppingListScreen";
import AddItemScreen from "./src/AddItemScreen";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import EditScreen from "./src/EditScreen";
import Register from "./src/login/Register";
import { auth } from "./firebase/firebase";
import { signOut } from "firebase/auth";
import Profile from "./src/Profile";
// Import other screens as needed

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function StackNavigator() {
  useEffect(() => {
    console.log("AppNav useeffect");
  }, []);

  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddItem"
        component={AddItemScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ShoppingList"
        component={ShoppingListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="EditScreen" component={EditScreen} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
}

export default function App() {
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
    <NavigationContainer>
      <View style={styles.header}>
        <Text style={styles.title}>
          ตู้เย็นของฉัน
          <MaterialCommunityIcons name="fridge" size={26} />
        </Text>
        {/* <MaterialCommunityIcons
          name="logout"
          color={"#f0edf6"}
          size={26}
          onPress={logOut}
        /> */}
      </View>
      <Tab.Navigator
        initialRouteName="HomeTab"
        barStyle={{ backgroundColor: "#ffff" }}
        activeColor="#000000"
        inactiveColor="#5db075"
      >
        <Tab.Screen
          name="HomeTab"
          component={StackNavigator}
          options={{
            tabBarLabel: "โฮม",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="home" color={color} size={26} />
            ),
            title: false,
          }}
        />
        <Tab.Screen
          name="AddItem"
          component={AddItemScreen}
          options={{
            tabBarLabel: "เพิ่มรายการ",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="plus-box" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="ShoppingList"
          component={ShoppingListScreen}
          options={{
            tabBarLabel: "รายการ",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="format-list-bulleted"
                color={color}
                size={26}
              />
            ),
          }}
        />
        <Tab.Screen
          name="profile"
          component={Profile}
          options={{
            tabBarLabel: "โปรไฟล์",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="account" color={color} size={26} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    padding: 20,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  title: {
    fontSize: 25,
    color: "white",
    alignItems: "center",
    minHeight: "50px",
    minWidth: "20%",
    maxWidth: 500,
    fontWeight: "800",
  },
  addButton: {
    margin: 15,
    padding: 15,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
  },
  itemsContainer: {
    flex: 1,
  },
  item: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemImage: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  footer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  footerButton: {
    flex: 1,
    padding: 15,
    alignItems: "center",
  },
});
