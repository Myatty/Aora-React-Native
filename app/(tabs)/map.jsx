import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
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
  const [floodRisk, setFloodRisk] = useState(false);
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
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarker({ latitude, longitude });
    await fetchWeatherData(latitude, longitude);
  };

  // Flood risk analysis function
  // pop = Probability of Precipitation(a metric that indicates the likelihood of precipitation occurring at a specific location and time)

  const analyzeFloodRisk = (weatherData) => {
    let highRainfallCount = 0;

    // Analyze the first 5 forecast periods (15 hours ahead)
    weatherData.list.slice(0, 5).forEach((forecast) => {
      const {
        pop,
        main: { humidity },
      } = forecast;

      if (pop > 0.6 && humidity > 80) {
        highRainfallCount++;
      }
    });

    // If there are 3 or more high-risk periods, flood risk is high
    return highRainfallCount >= 3;
  };

  const fetchWeatherData = async (lat, lon) => {
    try {
      const apiKey = "9fa7908f1082d055d948753d170644a0";
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
        50000 // Use metric units for temperature
      );
      const data = response.data;

      setWeatherData(data);
      const floodRiskDetected = analyzeFloodRisk(data);
      setFloodRisk(floodRiskDetected);

      if (floodRiskDetected) {
        alert("Flood risk detected! Please stay alert.");
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }

    // mock data
    /*
    const mockData = {
      list: [
        { pop: 0.7, main: { humidity: 85, temp: 30 }, weather: [{ description: "Clear sky" }] },
        { pop: 0.8, main: { humidity: 88, temp: 29 }, weather: [{ description: "Partly cloudy" }] },
        { pop: 0.9, main: { humidity: 90, temp: 28 }, weather: [{ description: "Rain" }] },
        { pop: 0.7, main: { humidity: 84, temp: 27 }, weather: [{ description: "Light rain" }] },
        { pop: 0.75, main: { humidity: 86, temp: 26 }, weather: [{ description: "Overcast clouds" }] },
      ],
      city: { name: "Test City" },
    };

    setWeatherData(mockData);
    const floodRiskDetected = analyzeFloodRisk(mockData);
    setFloodRisk(floodRiskDetected);

    if (floodRiskDetected) {
      alert("Flood risk detected! Please stay alert.");
    }
    */
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
            onRegionChangeComplete={handleRegionChange}
            onPress={handleMapPress}
          >
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

          {weatherData && weatherData.list && weatherData.list.length > 0 ? (
            <View style={styles.weatherContainer}>
              {weatherData.list[0].main && (
                <Text style={styles.weatherText}>
                  Temperature: {weatherData.list[0].main.temp} °C
                </Text>
              )}
              {weatherData.list[0].weather &&
                weatherData.list[0].weather[0] && (
                  <Text style={styles.weatherText}>
                    Weather: {weatherData.list[0].weather[0].description}
                  </Text>
                )}
              {weatherData.city && (
                <Text style={styles.weatherText}>
                  Township: {weatherData.city.name}
                </Text>
              )}
              {/* New Data Points */}
              <Text style={styles.weatherText}>
                Flood Risk Level: {floodRisk ? "High" : "Low"}
              </Text>
              {/* <Text style={styles.weatherText}>
                Probability of Flood Occurrence: {floodRisk ? "80%" : "0.5%"}
              </Text>
              <Text style={styles.weatherText}>
                Expected Rainfall: 50 mm (Next 24 hours)
              </Text> */}
              <Text style={styles.weatherText}>
                Current Humidity: {weatherData.list[0].main.humidity}%
              </Text>
              
            </View>
          ) : (
            <Text style={styles.weatherText}>No weather data available.</Text>
          )}
        </>
      )}
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },
  button: {
    position: "absolute",
    bottom: 30,
    right: "10%",
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
  buttonImage: { width: 25, height: 25 },
  weatherContainer: {
    position: "absolute",
    bottom: 100,
    left: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 10,
    borderRadius: 10,
  },
  weatherText: { fontSize: 16, color: "#333" },
});

export default Map;
