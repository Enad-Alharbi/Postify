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

    this.fetchPage(this.lastPage + 1)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (page) => {
          // Items added since the last page shift later pages, so skip anything already shown.
          const shownIds = new Set(this.items().map((item) => item.id));
          this.items.update((items) => [...items, ...page.items.filter((item) => !shownIds.has(item.id))]);
          this.totalCount.set(page.totalCount);
          this.lastPage = page.pageNumber;
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
    }
  }
}
