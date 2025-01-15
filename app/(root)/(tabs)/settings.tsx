import { Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

const settings = () => {
  return (
    <SafeAreaView>
      <Text>settings</Text>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

export default settings;
