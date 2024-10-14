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
import CustomButton from "../components/CustomButton";
import { Dimensions} from 'react-native';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
const { height, width } = Dimensions.get('window');

export default function App() {
  return (
    <SafeAreaView className="bg-updatedBg h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full items-center min-h-[85vh]">

          {/*<Image source={images.sa} className="w-[140px] h-[150px] bottom-10" /> */}

          <View style={styles.brandText} className="absolute top-3">
            <Text className="text-3xl font-bold text-left" style={{ fontWeight: '900'}}>
              <Text className="text-[#FEFEFE]">Maha</Text> {/* Color "Maha" */}
              <Text className="text-[#347928]"> Link</Text>
            </Text>
          </View>

          {/* Wrapper to align Text and Button */}
          <View style={styles.contentWrapper}>
            <Text
              className="text-4xl text-white font-bold text-left"
              style={{ lineHeight: 55 , fontWeight: '900'}}
            >
              Seamless <Text style={{ color: "#347928" }}>Communication</Text>
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
              handlePress={() => router.push("/map")}
              containerStyles="w-full mt-7 "
            />
          </View>
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#181716" style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  brandText: {
    width: "80%",
  }
  ,contentWrapper: {
    width: "80%",
    marginTop: height * 0.4, // 30% of the screen height

  },
  button: {
    marginTop: 150,
    //backgroundColor: "#3BFB06", communication = #3BFB06
    backgroundColor: "#3BFB06",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 19,
    fontWeight: "bold",
  },
});
