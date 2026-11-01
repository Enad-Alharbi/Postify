import { HttpErrorResponse } from '@angular/common/http';

// The backend returns errors as plain strings, { message } objects or ProblemDetails.
export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (!(error instanceof HttpErrorResponse)) {
    return fallback;
  }

  if (error.status === 0) {
    return "Can't reach the server. Check your connection and try again.";
  }

  const body: unknown = error.error;

  if (typeof body === 'string' && body.trim()) {
    return body;
  }

  if (body && typeof body === 'object') {
    if ('errors' in body && body.errors && typeof body.errors === 'object') {
      const messages = Object.values(body.errors as Record<string, string[]>).flat();
      if (messages.length) {
        return messages[0];
      }
    }

    if ('message' in body && typeof body.message === 'string' && body.message) {
      return body.message;
    }
  }

  return fallback;
}
