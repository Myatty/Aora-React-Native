import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { View, Text} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {Link } from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function Index() {
    return (
        <View className="flex-1 items-center justify-center bg-white">

            <Text className="text-3xl font-pblack">Aora!</Text>
            <StatusBar style='auto' />
            <Link href="/home" style={{ color: 'blue'}}>Go to Home</Link>
        </View>
    );
}
