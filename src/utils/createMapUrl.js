export function createMapUrl(latitude, longitude) {
  if (latitude == null || longitude == null) return '';

  const lat = Number(latitude);
  const lng = Number(longitude);
  const safeLat = Number.isFinite(lat) ? lat.toFixed(6) : latitude;
  const safeLng = Number.isFinite(lng) ? lng.toFixed(6) : longitude;

  return `https://maps.google.com/?q=${safeLat},${safeLng}`;
}
