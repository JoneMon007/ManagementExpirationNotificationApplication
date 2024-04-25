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
// Import other screens as needed

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function StackNavigator() {
  useEffect(() => {
    console.log("AppNav useeffect");
  }, []);

  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AddItem" component={AddItemScreen} />
      <Stack.Screen name="ShoppingList" component={ShoppingListScreen} />
      <Stack.Screen name="EditScreen" component={EditScreen} />
      <Stack.Screen name="Register" component={Register} />
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
        <Text style={styles.title}>My freidge</Text>
        <MaterialCommunityIcons
          name="logout"
          color={"#f0edf6"}
          size={26}
          onPress={logOut}
        />
      </View>
      <Tab.Navigator
        initialRouteName="HomeTab"
        barStyle={{ backgroundColor: "#4CAF50" }}
      >
        <Tab.Screen
          name="HomeTab"
          component={StackNavigator}
          options={{
            // tabBarLabel: "Home",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="home" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="AddItem"
          component={AddItemScreen}
          options={{
            tabBarLabel: "Add Item",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="plus-box" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="ShoppingList"
          component={ShoppingListScreen}
          options={{
            tabBarLabel: "List",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="format-list-bulleted"
                color={color}
                size={26}
              />
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
    backgroundColor: "#fff",
  },
  header: {
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    flexDirection: "row",
  },
  title: {
    fontSize: 24,
    color: "white",
    alignItems: "center",
    minHeight: "50px",
    minWidth: "20%",
    maxWidth: 500,
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
