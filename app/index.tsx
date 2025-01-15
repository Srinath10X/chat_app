import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default () => {
  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <Button title="Login" onPress={() => router.push("/login")} />
      <Button title="Signup" onPress={() => router.push("/signup")} />
      <StatusBar style="dark" />
    </SafeAreaView>
  );
};
