import { useEffect, useState } from "react";
import AppNavigator from "./AppNavigator";
import Login from "./src/login/Login";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import RegistrationScreen from "./src/login/Register";

const Stack = createStackNavigator();

export default function App() {
  const [User, setUser] = useState(false);

  useEffect(() => {
    const subscribe = onAuthStateChanged(
      auth,
      async (User) => {
        if (User) {
          setUser(true);
          console.log("user useEffect", User.email);
        } else {
          setUser(false);
          console.log("user signed out");
        }
      },
      (error) => {
        console.log(error);
      }
    );

    return subscribe;
  }, []);

  return (
    <>
      {User ? (
        <AppNavigator />
      ) : (
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
      )}
    </>
  );
}
