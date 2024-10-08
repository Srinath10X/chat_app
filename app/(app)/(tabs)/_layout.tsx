import React, { useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs, router } from "expo-router";
import { Pressable } from "react-native";
import { getAuth } from "firebase/auth";
import { getApp } from "firebase/app";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { Text } from "react-native-paper";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

const TabBarIcon = (props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) => {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isLoading, setIsLoading] = useState(true);
  const app = getApp();
  const db = getFirestore();

  getAuth(app).onAuthStateChanged((user) => {
    setIsLoading(false);
    if (user) {
      // Create user
      setDoc(
        doc(db, "users", user.uid),
        {
          _id: user.uid,
          email: user.email,
        },
        { merge: true },
      );
    } else {
      router.replace("/landing");
    }
  });

  if (isLoading) return <Text style={{ paddingTop: 10 }}>Loading...</Text>;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarStyle: { height: 60 },
        tabBarLabelStyle: { height: 25 },
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Messages",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="envelope" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <TabBarIcon name="gear" color={color} />,
        }}
      />
    </Tabs>
  );
}
