import { getAuth } from "firebase/auth";
import {
  collection,
  getFirestore,
  onSnapshot,
  or,
  query,
  where,
} from "firebase/firestore";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Pressable, Text, View } from "react-native";

const chat = () => {
  const db = getFirestore();
  const { currentUser } = getAuth();
  const [conversations, setConversations] = useState<any[]>([]);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "conversations"),
      or(
        where("u1._id", "==", currentUser?.uid),
        where("u2._id", "==", currentUser?.uid),
      ),
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const convos: any[] = [];
      snap.forEach((doc) => convos.push(doc.data()));
      setConversations(convos);
    });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView className="h-full bg-white">
      <View className="flex flex-row m-5 justify-between">
        <Text className="text-3xl font-bold">Messages</Text>
        <Pressable onPress={() => router.replace("/chat/search")}>
          <FontAwesome name="pencil-square-o" size={26} color={"black"} />
        </Pressable>
      </View>
      {conversations.length > 0 ? (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            const oppositeUser =
              item.u1._id === currentUser?.uid ? item.u2 : item.u1;
            return (
              <Pressable
                onPress={() =>
                  router.navigate({
                    pathname: "/chat/[id]",
                    params: {
                      id: oppositeUser._id,
                      email: oppositeUser.email,
                    },
                  })
                }
                className="p-2 mx-5 border-b border-t h-24"
              >
                <View className="flex-row items-center justify-between">
                  <Text className="text-lg font-bold" numberOfLines={1}>
                    {oppositeUser.email}
                  </Text>
                  <Text className="text-sm">
                    {new Date(
                      item.messages[item.messages.length - 1].createdAt,
                    ).toLocaleDateString()}
                  </Text>
                </View>
                <Text className="text-sm pt-2" numberOfLines={2}>
                  {item.messages[item.messages.length - 1].text}
                </Text>
              </Pressable>
            );
          }}
        />
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg pb-5">You don't have any messages</Text>
        </View>
      )}
      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

export default chat;
