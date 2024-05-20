import { NavigationContainer } from "@react-navigation/native";
import Login from "./Login";
import React from "react";
import RegistrationScreen from "./Register";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const Navigatir_login = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
          }}
          component={Login}
        />
        <Stack.Screen name="Register" component={RegistrationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigatir_login;
