import { HttpErrorResponse } from '@angular/common/http';
import { getApiErrorMessage } from './api-error';

describe('getApiErrorMessage', () => {
  it('returns a plain string body as-is', () => {
    const error = new HttpErrorResponse({ status: 401, error: 'Invalid Credentials!' });
    expect(getApiErrorMessage(error)).toBe('Invalid Credentials!');
  });

  it('returns the first ProblemDetails validation message', () => {
    const error = new HttpErrorResponse({
      status: 400,
      error: { title: 'One or more validation errors occurred.', errors: { Password: ['Too short.'] } },
    });
    expect(getApiErrorMessage(error)).toBe('Too short.');
  });

  it('returns the message of a { status, message } body', () => {
    const error = new HttpErrorResponse({ status: 403, error: { status: 403, message: 'Not your post' } });
    expect(getApiErrorMessage(error)).toBe('Not your post');
  });

  it('explains a network failure', () => {
    const error = new HttpErrorResponse({ status: 0 });
    expect(getApiErrorMessage(error)).toContain("Can't reach the server");
  });

  it('falls back when the body has nothing useful', () => {
    expect(getApiErrorMessage(new HttpErrorResponse({ status: 500, error: null }), 'Fallback')).toBe('Fallback');
    expect(getApiErrorMessage(new Error('not http'), 'Fallback')).toBe('Fallback');
  });
});
