import * as alertService from './alertService';
import type { ApiResponse } from './apiClient';
import { getApiBaseUrl, setApiBaseUrl } from './config';

export type Occurrence = alertService.Occurrence;

export { getApiBaseUrl, setApiBaseUrl };

export async function getOccurrences(): Promise<ApiResponse<Occurrence[]>> {
  const res = await alertService.getAlerts();
  return res as ApiResponse<Occurrence[]>;
}

export async function getOccurrenceById(id: string | number): Promise<ApiResponse<Occurrence>> {
  return alertService.getAlertById(id) as Promise<ApiResponse<Occurrence>>;
}

export async function createOccurrence(data: Omit<Occurrence, 'id'>): Promise<ApiResponse<Occurrence>> {
  return alertService.createAlert(data) as Promise<ApiResponse<Occurrence>>;
}

export async function updateOccurrence(id: string | number, data: Partial<Omit<Occurrence, 'id'>>): Promise<ApiResponse<Occurrence>> {
  return alertService.updateAlert(id, data) as Promise<ApiResponse<Occurrence>>;
}

export async function deleteOccurrence(id: string | number): Promise<ApiResponse<null>> {
  return alertService.deleteAlert(id) as Promise<ApiResponse<null>>;
}

