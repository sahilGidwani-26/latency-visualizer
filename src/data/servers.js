export const servers = [
  { name: "New York", lat: 40.7128, lon: -74.006, color: "blue" },
  { name: "London", lat: 51.5074, lon: -0.1278, color: "green" },
  { name: "Tokyo", lat: 35.6895, lon: 139.6917, color: "red" }
];

export const latencyPairs = [
  { from: { lat: 40.7128, lon: -74.006 }, to: { lat: 51.5074, lon: -0.1278 }, latency: 120 },
  { from: { lat: 51.5074, lon: -0.1278 }, to: { lat: 35.6895, lon: 139.6917 }, latency: 220 }
];
