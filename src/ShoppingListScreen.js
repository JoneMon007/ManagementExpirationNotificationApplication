import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Button } from "react-native-paper";

const STORAGE_KEY = "TODO_LIST";

export default function ShoppingListScreen() {
  const [items, setItems] = useState(["Avocado", "Pine apples", "Bagel"]);
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const storedTodos = await loadList();
        console.log(storedTodos.length);
        setTodos(storedTodos);
      } catch (error) {
        // Handle loading errors
        console.error(error);
      }
    };
    if (refresh) {
      loadTodos(); // Reload data on refresh
      setRefresh(false); // Reset refresh flag
    }
  }, [refresh]);

  const loadList = async () => {
    const retrievedList = await AsyncStorage.getItem(STORAGE_KEY);
    return retrievedList ? JSON.parse(retrievedList) : [];
  };

  const saveList = async (newTodos) => {
    try {
      const stringifiedList = JSON.stringify(newTodos);
      await AsyncStorage.setItem(STORAGE_KEY, stringifiedList);
    } catch (error) {
      // Handle saving errors
      console.error(error);
    }
  };

  const addTodo = (text) => {
    if (text.length === 0) return;
    const newTodos = [...todos, { text, id: Math.random().toString() }];
    setTodos(newTodos);
    saveList(newTodos);
    setInput("");
  };

  const removeValue = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setRefresh(true);
    } catch (e) {
      // remove error
    }

    console.log("Done.");
  };

  const deleteTodo = (id) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
    saveList(newTodos); // บันทึก list ที่อัปเดตลง AsyncStorage
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shopping List</Text>
        {/* Add user icon */}
      </View>

      <TextInput
        style={styles.input}
        placeholder="What do you need to buy?"
        value={input}
        onChangeText={setInput}
      />

      <FlatList
        data={todos}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.text}</Text>
            <TouchableOpacity
              style={styles.removeItem}
              onPress={() => deleteTodo(item.id)}
            >
              <Text> X</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.footer}>
        <TouchableOpacity onPress={removeValue}>
          <Text>Clear checked items</Text>
        </TouchableOpacity>
      </View>
      <Button mode="contained" onPress={() => addTodo(input)}>
        save
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
  },
  closeButton: {
    padding: 10,
  },
  input: {
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    padding: 10,
  },
  imagePicker: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    width: 100,
    height: 100,
    marginTop: 10,
  },
  picker: {
    marginTop: 10,
  },
  item: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
