import { getAuth, signInWithEmailAndPassword } from "@firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Button, TextInput } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { StatusBar } from "expo-status-bar";

const login = () => {
  const [email, setEmail] = useState<string>("");
  const [pass, setPass] = useState<string>("");
  const auth = getAuth();

  const loginIn = async () => {
    if (!email && !pass) alert("Please Enter your email and password");
    if (!email) alert("Please enter your email");
    if (!pass) alert("Please enter your password");

    signInWithEmailAndPassword(auth, email, pass)
      .then(() => router.replace("/(root)/(tabs)"))
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
          onChangeText={(text: string) => setPass(text)}
        />
      </View>
      <Button title="Login" onPress={loginIn} />
      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

export default login;
