import { useState } from "react";
import { Text } from "react-native";
import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { router, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { doc, getFirestore, setDoc } from "firebase/firestore";

export default () => {
  const db = getFirestore();
  const app = getApp();
  const auth = getAuth(app);
  const [isLoading, setLoading] = useState(true);

  auth.onAuthStateChanged((user) => {
    setLoading(false);

    if (!user) router.replace("/");
    else {
      setDoc(
        doc(db, "users", user.uid),
        {
          _id: user.uid,
          email: user.email,
        },
        { merge: true },
      );
    }
  });

  if (isLoading) return <Text>Loading...</Text>;

  return (
    <Tabs
      backBehavior="initialRoute"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          elevation: 0,
          shadowOpacity: 0,
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="chats"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-sharp" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
};
