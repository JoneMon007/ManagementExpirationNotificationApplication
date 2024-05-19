import { useEffect, useState } from "react";
import AppNavigator from "./AppNavigator";
import Login from "./src/login/Login";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import RegistrationScreen from "./src/login/Register";
import AppNav_admin from "./src/Admin/AppNav_admin";
import firebase from "firebase/compat/app";

const Stack = createStackNavigator();

// const checkRole = async () => {
//   try {
//     const uid = auth.currentUser?.uid;
//     if (!uid) return;
//     console.log("checkRole uid", uid);

//     const docRef = doc(db, "Myfridge", uid); // Assuming 'users' is your collection
//     const docSnap = await getDoc(docRef);

//     if (docSnap.exists() && docSnap.data().isAdmin) {
//       console.log("Admin User: Document data found", docSnap.data());
//       setInitialRouteName("AdminNavigator"); // Assuming this is the navigation for admins
//     } else {
//       console.log("Standard User: No admin data!");
//       setInitialRouteName("UserNavigator"); // Assuming this is the navigation for standard users
//     }
//   } catch (error) {
//     console.log("CheckRole error", error);
//   }
// };

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
        // <AppNavigator />
        <AppNav_admin />
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
