import {LRUMap} from "@/algo/lrumap";

test('basic lrumap test', () => {

  const lru = new LRUMap<string | number, string | number>(3)
  lru.set(1, 1);
  lru.set(2, 2);
  lru.set(3, 3);
  lru.set(4, 4);
  lru.remove(2);
  lru.set('a', 'a');

  console.log(lru);
  console.log(lru.keys());
  console.log(lru.values());
  console.log(lru.entries());

  expect(lru.size).toBe(3)
});
