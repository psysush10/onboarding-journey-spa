import type { Journey } from "../data/journey";
import { journeys } from "../data/journey";
import { fetchJourneyFromCatalyst } from "./journeyApi.catalyst";

const NETWORK_DELAY = 400; // ms

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const BASE_URL =
  "https://onboarding-journey-spa-897019082.development.catalystserverless.com";

export async function fetchJourney(customerId?: string) {
  const url = customerId
    ? `${BASE_URL}/server/journeys?customerId=${customerId}`
    : `${BASE_URL}/server/journeys`;

  console.log("[fetchJourney] URL:", url);

  const res = await fetch(url, {
    credentials: "include", // keep this
  });

  const text = await res.text();
  console.log("[fetchJourney] status:", res.status);
  console.log("[fetchJourney] raw response:", text);

  if (!res.ok) {
    throw new Error(`fetchJourney failed: ${res.status}`);
  }

  return JSON.parse(text);
}

export async function saveJourney(
  customerId: string,
  journey: Journey
): Promise<void> {
  await sleep(NETWORK_DELAY);
  localStorage.setItem(
    `journey_${customerId}`,
    JSON.stringify(journey)
  );
}