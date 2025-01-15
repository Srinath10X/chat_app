import { getAuth, createUserWithEmailAndPassword } from "@firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Button, TextInput } from "react-native";
import { router } from "expo-router";
import { useState } from "react";

const signUp = () => {
  const [email, setEmail] = useState<string>("");
  const [pass, setPass] = useState<string>("");
  const auth = getAuth();

  const signUp = async () => {
    if (!email && !pass) alert("Please Enter your email and password");
    if (!email) alert("Please enter your email");
    if (!pass) alert("Please enter your password");

    await createUserWithEmailAndPassword(auth, email, pass)
      .then(() => router.replace("/chat"))
      .catch((error) => alert(error.message));
  };

  return (
    <SafeAreaView className="flex-1 justify-center mx-2">
      <Text className="text-2xl font-bold">SignUp</Text>
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
      <Button title="SignUp" onPress={signUp} />
    </SafeAreaView>
  );
};

export default signUp;
