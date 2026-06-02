export type WeatherType =
  | "sunny"
  | "rainy"
  | "cloudy"
  | "night_cloudy"
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

  if ([1, 2, 3, 45, 48].includes(weatherCode)) {
    return isDay ? "cloudy" : "night_cloudy";
  }

  if ([51, 53, 55, 56, 57, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(weatherCode)) {
    return isDay ? "rainy" : "night_rainy";
  }

  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
    return isDay ? "cloudy" : "night_cloudy";
  }

  return isDay ? "sunny" : "night_clear";
}