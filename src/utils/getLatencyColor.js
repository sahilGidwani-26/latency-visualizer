export function getLatencyColor(latency) {
  if (latency < 100) return 'green';
  if (latency < 200) return 'yellow';
  return 'red';
}
