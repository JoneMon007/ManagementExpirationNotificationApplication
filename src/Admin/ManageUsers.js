import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, FlatList, Alert } from "react-native";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const docRef = doc(db, "Myfridge", auth.currentUser.uid);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUsers(docSnap.data().users); // Assuming 'users' is an array field in the document
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      }
    };

    fetchUserData();
  }, []);

  const handleDelete = (userId) => {
    Alert.alert("Delete User", "Are you sure you want to delete this user?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () => {
          setUsers((currentUsers) =>
            currentUsers.filter((user) => user.id !== userId)
          );
          // Further deletion logic here
        },
        style: "destructive",
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.name}>{item.email}</Text>
      <View style={styles.buttonsContainer}>
        <Button title="Edit" onPress={() => {}} />
        <Button
          title="Delete"
          onPress={() => handleDelete(item.id)}
          color="red"
        />
      </View>
    </View>
  );

  return (
    <FlatList
      data={users}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      style={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  name: {
    fontSize: 18,
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  list: {
    flex: 1,
  },
});

export default ManageUsers;
