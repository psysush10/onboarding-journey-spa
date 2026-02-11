import type { Journey } from "../data/journey";
import { getCatalyst } from "./catalystClient";

export async function fetchJourneyFromCatalyst(
  customerId: string
): Promise<Journey> {
  const catalyst = getCatalyst();

  const response = await catalyst
    .request({
      method: "GET",
      path: `/journeys/${customerId}`,
    });

  if (!response || !response.data) {
    throw new Error("Invalid journey response from Catalyst");
  }

  return response.data as Journey;
}