import { DestroyRef, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../models/pagination.models';
import { getApiErrorMessage } from './api-error';

// "Load more" state for a paginated endpoint: appends pages, dedupes by id,
// ignores calls while a request is in flight, and keeps loaded items when a request fails.
export class PagedList<T extends { id: string }> {
  readonly items = signal<T[]>([]);
  readonly totalCount = signal(0);
  readonly loading = signal(false);
  readonly loaded = signal(false);
  readonly hasNextPage = signal(true);
  readonly error = signal('');

  private lastPage = 0;
  private pageSize = 0;
  // Local adds/removes since the last load shift the backend's pages: removals pull
  // unseen items back onto pages we already loaded, so the next fetch has to step back.
  private shift = 0;

  constructor(
    private readonly fetchPage: (pageNumber: number) => Observable<PaginatedResponse<T>>,
    private readonly destroyRef: DestroyRef,
    private readonly errorMessage: string,
  ) {}

  loadMore(): void {
    if (this.loading() || !this.hasNextPage()) {
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.fetchPage(this.nextPageNumber())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (page) => {
          // Shifted pages can repeat items we already show, so skip those.
          const shownIds = new Set(this.items().map((item) => item.id));
          this.items.update((items) => [...items, ...page.items.filter((item) => !shownIds.has(item.id))]);
          this.totalCount.set(page.totalCount);
          this.lastPage = page.pageNumber;
          this.pageSize = page.pageSize;
          this.shift = 0;
          this.hasNextPage.set(page.hasNextPage);
          this.loaded.set(true);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(getApiErrorMessage(err, this.errorMessage));
          this.loading.set(false);
        },
      });
  }

  // For an item the user just created.
  prepend(item: T): void {
    const isNew = !this.items().some((existing) => existing.id === item.id);
    this.items.update((items) => [item, ...items.filter((existing) => existing.id !== item.id)]);

    if (isNew) {
      this.totalCount.update((count) => count + 1);
      this.shift++;
    }
  }

  // For an item the user just edited.
  replace(item: T): void {
    this.items.update((items) => items.map((existing) => (existing.id === item.id ? item : existing)));
  }

  // For an item the user just deleted.
  remove(id: string): void {
    const exists = this.items().some((item) => item.id === id);
    this.items.update((items) => items.filter((item) => item.id !== id));

    if (exists) {
      this.totalCount.update((count) => Math.max(0, count - 1));
      this.shift--;
    }
  }

  // The page holding the first item we haven't loaded yet. Without removals that's simply lastPage + 1;
  // after k removals it starts k positions earlier, possibly on a page we already loaded.
  private nextPageNumber(): number {
    if (this.lastPage === 0 || this.shift >= 0) {
      return this.lastPage + 1;
    }

    const firstUnseenIndex = Math.max(0, this.lastPage * this.pageSize + this.shift);
    return Math.floor(firstUnseenIndex / this.pageSize) + 1;
  }
}
