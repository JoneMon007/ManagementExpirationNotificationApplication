// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native'
import AppNavigator from "./AppNavigator";
// import AddItemScreen from './AddItemScreen';
import { useNotification } from "./Notifications";

export default function App() {
  // useNotification();
  return (
    <AppNavigator />
    // <AddItemScreen/>
  );
}
