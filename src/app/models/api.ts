/**
 * Async view of data exposed by the `PortfolioService` facade.
 * Adapted from the Headstack `AsyncState` pattern: static and future API
 * providers share identical loading/error shapes so skeletons keep working
 * after the backend swap.
 */
export type AsyncStatus = 'loading' | 'ok' | 'error';

export interface AsyncData<T> {
  status: AsyncStatus;
  data?: T;
  error?: string;
}

/** Success wrapper for synchronously available (static) data. */
export function okData<T>(data: T): AsyncData<T> {
  return { status: 'ok', data };
}

/** Loading placeholder (used by the future `ApiProvider` path). */
export function loadingData<T>(): AsyncData<T> {
  return { status: 'loading' };
}

/** Failure wrapper carrying a human-readable (translated at the call site) message. */
export function errorData<T>(error: string): AsyncData<T> {
  return { status: 'error', error };
}
