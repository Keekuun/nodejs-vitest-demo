"use strict";

// src/algo/lrumap.ts
var LRUMap = class {
  // https://kendaleiv.com/typescript-constructor-assignment-public-and-private-keywords/
  constructor(_maxSize) {
    this._maxSize = _maxSize;
    this._cache = /* @__PURE__ */ new Map();
  }
  _cache;
  /** Get the current size of the cache */
  get size() {
    return this._cache.size;
  }
  /** Get an entry or undefined if it was not in the cache. Re-inserts to update the recently used order */
  get(key) {
    const value = this._cache.get(key);
    if (value === void 0) {
      return void 0;
    }
    this._cache.delete(key);
    this._cache.set(key, value);
    return value;
  }
  /** Insert an entry and evict an older entry if we've reached maxSize */
  set(key, value) {
    if (this._cache.size >= this._maxSize) {
      this._cache.delete(this._cache.keys().next().value);
    }
    this._cache.set(key, value);
  }
  /** Remove an entry and return the entry if it was in the cache */
  remove(key) {
    const value = this._cache.get(key);
    if (value) {
      this._cache.delete(key);
    }
    return value;
  }
  /** Clear all entries */
  clear() {
    this._cache.clear();
  }
  /** Get all the keys */
  keys() {
    return [...this._cache.keys()];
  }
  /** Get all the values */
  values() {
    return [...this._cache.values()];
  }
  entries() {
    return [...this._cache.entries()];
  }
};

// src/algo/lrumap.spec.ts
test("basic lrumap test", () => {
  const lru = new LRUMap(3);
  lru.set(1, 1);
  lru.set(2, 2);
  lru.set(3, 3);
  lru.set(4, 4);
  lru.remove(2);
  lru.set("a", "a");
  console.log(lru);
  console.log(lru.keys());
  console.log(lru.values());
  console.log(lru.entries());
  expect(lru.size).toBe(3);
});
