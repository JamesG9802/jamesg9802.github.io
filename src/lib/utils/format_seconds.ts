export function format_seconds(seconds: number): string {
  if (seconds < 0) throw new Error("Seconds cannot be negative");

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts: string[] = [];
  if (hours) parts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
  if (minutes) parts.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);
  if (secs || parts.length === 0) parts.push(`${secs} second${secs !== 1 ? "s" : ""}`);

  return parts.join(" ");
}