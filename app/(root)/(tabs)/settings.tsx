import { StatusBar } from "expo-status-bar";
import { getAuth, signOut } from "firebase/auth";
import { Button, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const settings = () => {
  const auth = getAuth();
  const signOutUser = () => signOut(auth);

  return (
    <SafeAreaView className="h-full bg-white">
      <Text className="m-5 text-3xl font-bold">Profile</Text>
      <View className="mx-5 my-auto">
        <Button title="SignOut" onPress={signOutUser} />
      </View>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

export default settings;
