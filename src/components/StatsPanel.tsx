import { ActivityMetric } from "@/features/activity/types";
import { StyleSheet, View } from "react-native";
import { AppText } from "./AppText";

interface StatsPanelProps {
  metrics: ActivityMetric[];
}

export default function StatsPanel({ metrics }: StatsPanelProps) {
  return (
    <View style={styles.container}>
      <AppText style={styles.heading}>Stats</AppText>
      {metrics.map((metric) => (
        <View key={metric.key} style={styles.metricRow}>
          <AppText style={styles.metricLabel}>{metric.label}</AppText>
          <AppText style={styles.metricValue}>{metric.value}</AppText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 120,
    padding: 20,
    borderRadius: 24,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.24)",
    gap: 12,
  },
  heading: {
    fontSize: 34,
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.18)",
  },
  metricLabel: {
    fontSize: 18,
    color: "#E7F4FF",
    flex: 1,
  },
  metricValue: {
    fontSize: 18,
    color: "#fff",
  },
});
