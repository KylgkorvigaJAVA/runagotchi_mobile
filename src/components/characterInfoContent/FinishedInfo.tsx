import { useEffect, useRef } from "react";
import { Platform, StyleSheet, View } from "react-native";
import MapView, { Polyline } from "react-native-maps";

import { useActivity } from "../../providers/ActivityContext";
import { AppText } from "../AppText";

export default function FinishedInfo() {
  const { latestFinishedActivity } = useActivity();
  const elapsedTime = latestFinishedActivity?.elapsedTime ?? 0;

  const hours = Math.floor(elapsedTime / 3600);
  const minutes = Math.floor((elapsedTime % 3600) / 60);
  const seconds = elapsedTime % 60;

  const distanceMeters = latestFinishedActivity?.distanceMeters ?? 0;
  const averageSpeedKmh = latestFinishedActivity?.averageSpeedKmh ?? 0;

  const route =
    latestFinishedActivity?.route.map((point) => ({
      latitude: point.latitude,
      longitude: point.longitude,
    })) ?? [];

  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (route.length > 1) {
      mapRef.current?.fitToCoordinates(route, {
        edgePadding: {
          top: 30,
          right: 30,
          bottom: 30,
          left: 30,
        },
        animated: false,
      });
    }
  }, [route]);

  return (
    <View style={styles.container}>

      {Platform.OS === "android" ? (
        <View style={styles.mapPlaceholder} />
      ) : (
        <MapView style={styles.map} ref={mapRef}>
          {route.length > 1 && (
            <Polyline
              coordinates={route}
              strokeWidth={4}
              strokeColor="#FF3B30"
            />
          )}
        </MapView>
      )}

      <AppText style={styles.info}>
        Distance: {(distanceMeters / 1000).toFixed(2)} km
      </AppText>

      <AppText style={styles.info}>
        Average speed: {averageSpeedKmh.toFixed(1)} km/h
      </AppText>

      <AppText style={styles.info}>
        Time: {hours}h {minutes}m {seconds}s
      </AppText>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 110,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
    zIndex: 10,
  },
  map: {
    width: 348,
    height: 200,
    borderRadius: 16,
  },
  mapPlaceholder: {
    width: 348,
    height: 200,
    backgroundColor: "#888",
    borderRadius: 16,
    marginBottom: 12,
  },
  info: {
    fontSize: 20,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    color: "#fff",
  },

});
