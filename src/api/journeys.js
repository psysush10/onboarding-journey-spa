export async function fetchJourneys() {
  const res = await fetch("/server/journeys/execute");
  const data = await res.json();

  const parsed = JSON.parse(data.output);
  return parsed.journeys;
}