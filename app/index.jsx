import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {Link } from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function Index() {
    return (
        <View style={styles.container}>
            <Text>Aora!</Text>
            <StatusBar style='auto' />
            <Link href="/profile" style={{ color: 'blue'}}>Go to Profile</Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: 'center',
        justifyContent: 'center',
    }
});
