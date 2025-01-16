import { useState } from "react";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, Text, Button, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAuth, signInWithEmailAndPassword } from "@firebase/auth";

const login = () => {
  const auth = getAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const loginIn = async () => {
    if (!email && !password) alert("Please Enter your email and password");
    if (!email) alert("Please enter your email");
    if (!password) alert("Please enter your password");

    signInWithEmailAndPassword(auth, email, password)
      .then(() => router.replace("/chats"))
      .catch((error) => alert(error.message));
  };

  return (
    <SafeAreaView className="flex-1 justify-center mx-2">
      <Text className="text-2xl font-bold">Login</Text>
      <View className="my-4">
        <Text>Email</Text>
        <TextInput
          className="border border-black"
          placeholder="Enter your email"
          onChangeText={(text: string) => setEmail(text)}
        />
        <Text>Password</Text>
        <TextInput
          className="border border-black"
          placeholder="Enter your password"
          secureTextEntry
          onChangeText={(text: string) => setPassword(text)}
        />
      </View>
      <Button title="Login" onPress={loginIn} />
      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

export default login;
