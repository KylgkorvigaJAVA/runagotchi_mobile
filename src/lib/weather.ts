export type WeatherType =
  | "sunny"
  | "rainy"
  | "cloudy"
  | "partly_cloudy"
  | "night_clear"
  | "night_rainy";

export function resolveWeatherType(
  weatherCode: number | null | undefined,
  isDay: boolean
): WeatherType {
  if (weatherCode == null) {
    return isDay ? "sunny" : "night_clear";
  }

  if (weatherCode === 0) {
    return isDay ? "sunny" : "night_clear";
  }

  // Partly cloudy
  if (weatherCode === 2) {
    return isDay ? "partly_cloudy" : "night_partly_cloudy";
  }

  // Mainly clear -> treat as sunny
  if (weatherCode === 1) {
    return isDay ? "sunny" : "night_clear";
  }
  // Overcast / cloud groups
  if ([3, 45, 48].includes(weatherCode)) {
    return isDay ? "cloudy" : "night_partly_cloudy";
  }

  if ([51, 53, 55, 56, 57, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(weatherCode)) {
    return isDay ? "rainy" : "night_rainy";
  }

  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
    return isDay ? "cloudy" : "night_partly_cloudy";
  }

  return isDay ? "sunny" : "night_clear";
}