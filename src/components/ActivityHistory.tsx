import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { ActivityRecord, loadActivities, } from "@/features/profile/storage";
import { AppText } from "./AppText";

const formatDuration = (seconds: number) => {
  const hours = String(Math.floor(seconds / 3600));
  const minutes = String(Math.floor((seconds % 3600) / 60));
  const secs = String(seconds % 60);

  return `${hours}h ${minutes}m ${secs}s`;
};

export default function ActivityHistory() {
  const [activities, setActivities] = useState<ActivityRecord[]>([]);

  useEffect(() => {
    loadActivities().then(setActivities);
  }, []);
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {activities.map((activity) => (
        <View
          key={activity.id}
          style={styles.card}
        >
          <AppText style={styles.text}>
            {new Date(activity.startedAt).toLocaleString([], {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </AppText>

          <AppText style={styles.text}>
            Distance: {(activity.distanceMeters / 1000).toFixed(2)} km
          </AppText>

          <AppText style={styles.text}>
            Avg Speed: {activity.averageSpeedKmh.toFixed(1)} km/h
          </AppText>

          <AppText style={styles.text}>
            Duration: {formatDuration(activity.elapsedTime)}
          </AppText>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    paddingBottom: 40,
    gap: 12,
  },
  card: {
    backgroundColor: "#5f7d5d",
    borderRadius: 12,
    padding: 12,
  },
  text: {
    color: "#fff",
  },
});