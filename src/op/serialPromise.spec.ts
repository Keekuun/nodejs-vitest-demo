import { test, expect } from 'vitest';
import {serialPromise, serialPromise1} from './serialPromise';

test('[serialPromise] - Sequential Processing 1', async () => {
  const promises = [
    Promise.resolve(1),
    Promise.resolve(2),
    Promise.resolve(3),
    Promise.resolve(4)
  ];

  // const results: number[] = [];
  const callback = (result: number) => {
    console.log('Result:', result);
    expect(result).toEqual([1, 2, 3, 4]);
  };

  await serialPromise(promises, callback);
});

test('[serialPromise] - Sequential Processing 2', async () => {
  const promises = [
    Promise.resolve(1),
    Promise.resolve(2),
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(3);
      }, 500);
    }),
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(4);
      }, 200);
    }),

    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(5);
      }, 10000);
    }),
  ];

  // const results: number[] = [];
  const callback = (result: number) => {
    console.log('Result:', result);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  };

  await serialPromise(promises, callback);
});


test('[serialPromise]  - Error Handling', async () => {
  const errorPromise = Promise.reject('Error');

  const callback = vitest.fn();
  const errorSpy = vitest.fn(() => {
    console.log('Something went wrong. Error handled successfully');
  });

  await serialPromise([errorPromise], callback).catch(errorSpy);

  expect(callback).not.toHaveBeenCalled();
  expect(errorSpy).toHaveBeenCalled();
});

test('[serialPromise1]  - Sequential Processing 1', async () => {
  const promises = [
    Promise.resolve(1),
    Promise.resolve(2),
    Promise.resolve(3),
    Promise.resolve(4)
  ];

  // const results: number[] = [];
  const callback = (result: any[]) => {
    console.log('Result:', result);
    expect(result.map((r: { data: any; }) => r.data)).toEqual([1, 2, 3, 4]);
  };

  await serialPromise1(promises, callback);
});

test('[serialPromise1] - Sequential Processing 2', async () => {
  const promises = [
    Promise.resolve(1),
    Promise.reject(2),
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(3);
      }, 500);
    }),
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(4);
      }, 200);
    }),

    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(5);
      }, 10000);
    }),
    function() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(6);
        }, 400);
      });
    },
    function() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(7);
        }, 100);
      });
    }
  ];

  // const results: number[] = [];
  const callback = (result:  any[]) => {
    console.log('Result:', result);
    expect(result.map((r: { data: any; }) => r.data)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  };

  await serialPromise1(promises, callback);
});

