import { DestroyRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Observable, Subject, of, throwError } from 'rxjs';
import { PaginatedResponse } from '../models/pagination.models';
import { PagedList } from './paged-list';

interface Item {
  id: string;
}

function page(pageNumber: number, ids: string[], totalCount: number, pageSize = 2): PaginatedResponse<Item> {
  const totalPages = Math.ceil(totalCount / pageSize);
  return {
    items: ids.map((id) => ({ id })),
    pageNumber,
    pageSize,
    totalCount,
    totalPages,
    hasPreviousPage: pageNumber > 1,
    hasNextPage: pageNumber < totalPages,
  };
}

describe('PagedList', () => {
  let destroyRef: DestroyRef;

  beforeEach(() => {
    destroyRef = TestBed.inject(DestroyRef);
  });

  function createList(fetch: (pageNumber: number) => Observable<PaginatedResponse<Item>>): PagedList<Item> {
    return new PagedList<Item>(fetch, destroyRef, 'Failed');
  }

  it('appends pages and skips items already shown', () => {
    const pages: Record<number, PaginatedResponse<Item>> = {
      1: page(1, ['a', 'b'], 4),
      2: page(2, ['b', 'c'], 4),
    };
    const list = createList((n) => of(pages[n]));

    list.loadMore();
    list.loadMore();

    expect(list.items().map((item) => item.id)).toEqual(['a', 'b', 'c']);
    expect(list.totalCount()).toBe(4);
    expect(list.hasNextPage()).toBe(false);
  });

  it('ignores calls while a request is in flight', () => {
    const pending = new Subject<PaginatedResponse<Item>>();
    let calls = 0;
    const list = createList(() => {
      calls++;
      return pending;
    });

    list.loadMore();
    list.loadMore();

    expect(calls).toBe(1);
    expect(list.loading()).toBe(true);
  });

  it('keeps loaded items and reports the error when a later page fails', () => {
    const list = createList((n) => (n === 1 ? of(page(1, ['a', 'b'], 4)) : throwError(() => new Error('boom'))));

    list.loadMore();
    list.loadMore();

    expect(list.items().map((item) => item.id)).toEqual(['a', 'b']);
    expect(list.error()).toBe('Failed');
    expect(list.loading()).toBe(false);
  });

  it('steps back a page after a removal so no item is skipped', () => {
    const requested: number[] = [];
    // Server order: a b | c d | e. After "a" is deleted it's b c | d e, so "c" moved onto page 1.
    const list = createList((n) => {
      requested.push(n);
      const afterDelete = requested.length > 1;
      return of(afterDelete ? page(n, ['b', 'c'], 4) : page(n, ['a', 'b'], 5));
    });

    list.loadMore();
    list.remove('a');
    list.loadMore();

    expect(requested).toEqual([1, 1]);
    expect(list.items().map((item) => item.id)).toEqual(['b', 'c']);
  });

  it('updates totalCount on prepend and remove', () => {
    const list = createList(() => of(page(1, ['a'], 1)));
    list.loadMore();

    list.prepend({ id: 'new' });
    expect(list.items()[0].id).toBe('new');
    expect(list.totalCount()).toBe(2);

    list.remove('a');
    expect(list.totalCount()).toBe(1);
  });
});
