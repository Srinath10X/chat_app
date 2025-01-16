import { Stack } from "expo-router";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import "./global.css";

const firebaseConfig = {
  apiKey: "AIzaSyCFjKvE2wbCz3tk64JXWvcqbRnDuz0Bh9s",
  authDomain: "newchat-caeb8.firebaseapp.com",
  projectId: "newchat-caeb8",
  storageBucket: "newchat-caeb8.firebasestorage.app",
  messagingSenderId: "664877444849",
  appId: "1:664877444849:web:38abb0414bf07780090350",
  measurementId: "G-S4PS90K5D7",
};

const app = initializeApp(firebaseConfig);

try {
  initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch (e) {}

getFirestore(app);

export default () => {
  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
};
