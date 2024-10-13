import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import {
  Image,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";
import CustomButton from "../components/CustomButton"; // Corrected import statement

 
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function App() {
  return (
    <SafeAreaView className="bg-background h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full items-center min-h-[85vh]">
          <Image source={images.sa} className="w-[140px] h-[150px] bottom-10" />

          {/* Wrapper to align Text and Button */}
          <View style={styles.contentWrapper}>
            <Text
              className="text-4xl text-white font-bold text-left"
              style={{ lineHeight: 55 }}
            >
              Seamless <Text style={{ color: "#3BFB06" }}>Communication</Text>
              {"\n"}
              for rapid{"\n"}
              Emergency{"\n"}
              Response
            </Text>



             {/* TouchableOpacity with Link
            <TouchableOpacity style={styles.button}>
              <Link href="/map" style={styles.link}>
                <Text style={styles.buttonText}>Continue</Text>
              </Link>
            </TouchableOpacity> */}

            <CustomButton 
            title="Continue"
            handlePress={()=> router.push('/map')}
            containerStyles="w-full mt-7 " />    
          </View>
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#181716" style="light"/>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentWrapper: {
    width: "80%", // Adjust this width as needed
    marginTop: 80,
  },
  button: {
    marginTop: 150, // Space between text and button
    backgroundColor: "#3BFB06",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center", // Center text inside button
  },
  buttonText: {
    color: "white",
    fontSize: 19,
    fontWeight: "bold",
  },
});
