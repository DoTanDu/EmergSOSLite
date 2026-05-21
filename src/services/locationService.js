import * as Location from 'expo-location';

export async function requestLocationPermission() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
}

export async function getCurrentLocation() {
  const granted = await requestLocationPermission();
  if (!granted) {
    throw new Error('Bạn chưa cấp quyền vị trí. Không thể tạo cảnh báo SOS kèm GPS.');
  }

  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High
  });

  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude
  };
}
