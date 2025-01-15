import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { Slot } from "expo-router";
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

initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

getFirestore(app);

export default Slot;
