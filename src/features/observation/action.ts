"use server";

import * as service from "./service";

export async function createObservation(...args: Parameters<typeof service.createObservation>) {
  return await service.createObservation(...args);
}

export async function updateObservation(...args: Parameters<typeof service.updateObservation>) {
  return await service.updateObservation(...args);
}

export async function deleteObservation(...args: Parameters<typeof service.deleteObservation>) {
  return await service.deleteObservation(...args);
}

export async function searchObservation(...args: Parameters<typeof service.searchObservation>) {
  return await service.searchObservation(...args);
}

export async function filterObservation(...args: Parameters<typeof service.filterObservation>) {
  return await service.filterObservation(...args);
}