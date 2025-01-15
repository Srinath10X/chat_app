import { APIKEY } from "@env";
import { router } from "expo-router";
import { Button, View } from "react-native";

export default () => {
  console.log(APIKEY);
  return (
    <View className="flex-1 items-center justify-center">
      <Button title="Login" onPress={() => router.push("/login")} />
      <Button title="Signup" onPress={() => router.push("/signup")} />
    </View>
  );
};
