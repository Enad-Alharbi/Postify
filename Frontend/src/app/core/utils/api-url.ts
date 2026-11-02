import { environment } from '../../../environments/environment';

// Image paths from the API are relative (/uploads/...), so they need the API origin.
export function toApiUrl(path: string): string {
  return `${environment.apiBaseUrl}${path}`;
}
