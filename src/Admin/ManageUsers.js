import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  FlatList,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { signOut } from "firebase/auth";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { TextInput } from "react-native-paper";
import { auth, db } from "../../firebase/firebase";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Image } from "react-native-elements";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const ManageUsers = () => {
  const [userData, setUserData] = useState([]);
  const [documentId, setDocumentId] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation(); // ใช้ hook useNavigation

  // const handleDelete = async (itemId) => {
  //   const docRef = doc(
  //     db, "Myfridge",
  //     itemId
  //   );

  //   try {
  //     await updateDoc(docRef, {
  //       Status: 0,
  //     });

  //     const querySnapshot = await getDocs(
  //       collection(db, "Myfridge")
  //     );

  //     const data = querySnapshot.docs.map((item) => item.data());

  //     const filterData = data.filter((item) => {
  //       return item?.Status === 1;
  //     });

  //     console.log(filterData);

  //     setFoodList(filterData); // อัพเดตสถานะของรายการใน state
  //   } catch (error) {
  //     console.log("error handleDelete, " + error);
  //   }
  // };

  // const handleDeleteConfirmation = (itemId) => {
  //   Alert.alert(
  //     "ยืนยันการลบ",
  //     "คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?",
  //     [
  //       {
  //         text: "ยกเลิก",
  //         onPress: () => console.log("Cancel Pressed"),
  //         style: "cancel",
  //       },
  //       {
  //         text: "ยืนยัน",
  //         onPress: () => handleDelete(itemId),
  //       },
  //     ],
  //     { cancelable: false }
  //   );
  // };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Myfridge"));
        const users = querySnapshot.docs.map((doc) => doc.data());
        const id = querySnapshot.docs.map((item) => item.id);
        console.log(users); // Log the data fetched from firestore
        setUserData(users); // Set the data to state
        setDocumentId(id);
        if (!documentId.empty) {
          const id = querySnapshot.docs.map((item) => item.id);
          setDocumentId(id);
          console.log("documentId99  : " + documentId);
        } else {
          console.log("No documents found!");
        }
        console.log("documentId : " + documentId);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const filteredData = searchQuery
    ? userData.filter((user) => user.username.includes(searchQuery))
    : userData;

  return (
    <>
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return (
            //อันที่2
            <TouchableOpacity
              onPress={
                () =>
                  navigation.navigate("UsersEdit", {
                    item,
                    documentId: item.id,
                  }) // ส่ง id ของ item นั้นแทนที่จะเป็น array
              }
            >
              <ScrollView>
                <View style={styles.itemContainer_green}>
                  <Image
                    source={{
                      uri: item?.image_url
                        ? item?.image_url
                        : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
                    }}
                    style={styles.image}
                  />
                  <View style={styles.detailsContainer}>
                    <Text style={styles.date}>ID : {item?.id}</Text>
                    <Text style={styles.date}>Username : {item?.username}</Text>
                    <Text style={styles.date}>Email : {item?.email}</Text>
                    {/* <MaterialCommunityIcons
                      onPress={() => handleDeleteConfirmation(item.documentId)}
                      style={{ position: "absolute", right: 10, top: 10 }} // ปรับตำแหน่งปุ่ม
                      name="delete"
                      color="#ffff"
                      size={26}
                    /> */}
                  </View>
                </View>
              </ScrollView>
            </TouchableOpacity>
          );
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  itemContainer_green: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#91d6a5",
    margin: 10,
  },
  image: {
    width: 60,
    height: 60,
    margin: 10,
    borderRadius: 10,
  },
  detailsContainer: {
    flex: 1,
  },
  date: {
    fontSize: 18,
    color: "#ffffff",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 4,
    margin: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: "#4CAF50",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    color: "white",
  },
  addButton: {
    margin: 15,
    padding: 15,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    lineHeight: "64px",
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

export default ManageUsers;
