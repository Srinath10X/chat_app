import { SafeAreaView } from "react-native-safe-area-context";
import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  FlatList,
  Keyboard,
  Pressable,
  TextInput,
  TouchableWithoutFeedback,
  View,
  Text,
} from "react-native";
import { router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

export default function SearchScreen() {
  const auth = getAuth();
  const db = getFirestore();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<any[]>([]);

  const getSearchResults = async (text: string) => {
    text = text.toLowerCase();

    const usersRef = collection(db, "users");
    const q = query(
      usersRef,
      where("email", ">=", text),
      where("email", "<=", text + "\uf8ff"),
      where("email", "!=", auth.currentUser?.email),
    );
    const res = await getDocs(q);
    if (res) {
      let users: any[] = [];
      res.docs.forEach((doc) => users.push(doc.data()));
      return users;
    }

    return [];
  };

  useEffect(() => {
    async function fetchUsers() {
      setUsers(await getSearchResults(searchQuery));
    }

    fetchUsers();
  }, [searchQuery]);

  const handleSubmit = async (text: string) => {
    setUsers(await getSearchResults(text));
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-row items-center mx-2.5 mt-5">
        <Pressable
          className="pl-2.5 mr-3.5"
          onPress={() => router.replace("/chats")}
        >
          {({ pressed }) => (
            <FontAwesome
              name="chevron-left"
              size={25}
              style={{ opacity: pressed ? 0.5 : 1 }}
            />
          )}
        </Pressable>

        <TextInput
          placeholder="Search Users ..."
          placeholderTextColor="#999"
          autoFocus
          className="w-[75%] border rounded-lg px-4 py-2"
          onChangeText={setSearchQuery}
          onSubmitEditing={async (e) => {
            await handleSubmit(e.nativeEvent.text);
          }}
        />
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1">
          {searchQuery ? (
            <>
              {users.length === 0 ? (
                <View className="flex-1 justify-center items-center">
                  <Text className="text-xl font-bold">No Users Found</Text>
                </View>
              ) : (
                <FlatList
                  className="mt-2.5"
                  data={users}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => (
                    <Pressable
                      className="flex-row justify-between py-5 px-2.5 border-b"
                      onPress={() =>
                        router.navigate({
                          pathname: "/chat/[id]",
                          params: {
                            id: item._id,
                            email: item.email,
                          },
                        })
                      }
                    >
                      <Text className="text-xl font-bold">{item.email}</Text>
                    </Pressable>
                  )}
                />
              )}
            </>
          ) : (
            <View className="flex-1 justify-center items-center">
              <Text className="text-xl font-bold">Search Users by Email</Text>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}
