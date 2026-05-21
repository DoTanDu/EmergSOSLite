export function createMapUrl(latitude, longitude) {
  if (latitude == null || longitude == null) return '';
  return `https://maps.google.com/?q=${latitude},${longitude}`;
}
