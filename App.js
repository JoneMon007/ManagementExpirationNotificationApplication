import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import AppNavigator from "./AppNavigator";
import { auth, db } from "./firebase/firebase";
import Navigatir_login from "./src/login/Navigatir_login";
import AppNav_admin from "./src/Admin/AppNav_admin";

export default function App() {
  const [User, setUser] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkRole = async (uid) => {
    try {
      if (!uid) return;
      console.log("checkRole uid", uid);

      const docRef = doc(db, "Myfridge", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && docSnap.data()?.Role === "Admin") {
        console.log("Admin User: Document data found", docSnap.data());
        setIsAdmin(true); // Assuming this is the navigation for admins
      } else if (docSnap.exists() && docSnap.data()?.Role === "User") {
        console.log("Standard User: No admin data!");
        setIsAdmin(false); // Assuming this is the navigation for standard users
      } else {
        console.log("User Not Found");
        return;
      }
    } catch (error) {
      console.log("CheckRole error", error);
    }
  };

  useEffect(() => {
    const subscribe = onAuthStateChanged(
      auth,
      async (User) => {
        if (User) {
          setUser(true);
          await checkRole(User.uid);
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
        isAdmin ? (
          <AppNav_admin />
        ) : (
          <AppNavigator />
        )
      ) : (
        <Navigatir_login />
      )}
    </>
  );
}
