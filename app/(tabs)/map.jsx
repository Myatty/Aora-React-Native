import { SafeAreaView ,View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import MapView, { Circle, Marker } from "react-native-maps"; 
import * as Location from "expo-location";
import axios from "axios"; 
import { StatusBar } from "expo-status-bar";

const Map = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [radius, setRadius] = useState(150);
  const [marker, setMarker] = useState(null); 
  const [weatherData, setWeatherData] = useState(null); 
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  const centerMap = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        1250
      );
    }
  };

  const handleRegionChange = (region) => {
    const newRadius = Math.max(50, Math.round(1000 * region.latitudeDelta));
    setRadius(newRadius);
  };

  const handleMapPress = async (event) => {

    // Get the coordinates where the user pressed
    const { latitude, longitude } = event.nativeEvent.coordinate;
       
    setMarker({ latitude, longitude });
    await fetchWeatherData(latitude, longitude);
  };

  // axios nae api ka ny data fetch tr
  const fetchWeatherData = async (lat, lon) => {
    const apiKey = "9fa7908f1082d055d948753d170644a0"; 
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,(50000) // Use metric units for temperature
      );
      setWeatherData(response.data); 
    } catch (error) {
      console.error("Error fetching weather data:", error.message);
      setWeatherData(null); 
    }
  };

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {location && (
        <>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            optimize={true} 
            onRegionChangeComplete={handleRegionChange}
            onPress={handleMapPress} 
          >
            {/* Outer white circle */}
            <Circle
              center={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              radius={radius + 10}
              fillColor="rgba(255, 255, 255, 0.3)"
              strokeColor="rgba(255, 255, 255, 0.5)"
              strokeWidth={4}
            />

            {/* Inner sky blue circle */}
            <Circle
              center={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              radius={radius}
              fillColor="rgba(135, 206, 235, 0.5)"
              strokeColor="rgba(0, 0, 255, 0.7)"
              strokeWidth={3}
            />

            {/* marker rendering if exists */}
            {marker && (
              <Marker coordinate={marker} title={"Selected Location"} />
            )}
          </MapView>
          <TouchableOpacity style={styles.button} onPress={centerMap}>
            <Image
              source={require("../../assets/images/location.png")}
              style={styles.buttonImage}
            />
          </TouchableOpacity>

          {/* display weather data */}
          {weatherData && (
            <View style={styles.weatherContainer}>
              <Text style={styles.weatherText}>Weather Data:</Text>
              <Text style={styles.weatherText}>
                Temperature: {weatherData.list[0].main.temp} °C
              </Text>
              <Text style={styles.weatherText}>
                Weather: {weatherData.list[0].weather[0].description}
              </Text>
              <Text style={styles.weatherText}>
                Township: {weatherData.city.name}
              </Text>
              
            </View>
          )}
        </>
      )}
       <StatusBar style="auto"/>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  button: {
    position: "absolute",
    bottom: 30,
    right: "10%",
    marginLeft: -75,
    backgroundColor: "#FFFF",
    borderRadius: 100,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  weatherContainer: {
    position: "absolute",
    bottom: 100,
    left: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 10,
    borderRadius: 10,
  },
  weatherText: {
    fontSize: 16,
    color: "#333",
  },
  buttonImage: {
    width: 25,
    height: 25,
    color: "#FFF",
  },
});

export default Map;
