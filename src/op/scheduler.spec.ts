import { test, expect } from 'vitest';
import {Scheduler} from "@/op/scheduler";

test('Scheduler - taskStart with added tasks', async () => {
  const scheduler = new Scheduler();
  const result: string[] = [];

  const delayTask = (time: number, order: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        result.push(order);
        resolve();
      }, time);
    });
  };

  scheduler.add(() => delayTask(500, '1'));
  scheduler.add(() => delayTask(250, '2'));
  scheduler.add(() => delayTask(150, '3'));
  scheduler.add(() => delayTask(200, '4'));

  scheduler.taskStart();

  await new Promise<void>((resolve) => {
    setTimeout(resolve, 1000); // Wait for tasks to complete
  });

  expect(result).toEqual(['2', '3', '1', '4']);
});

test('Scheduler - taskStart without added tasks', async () => {
  const scheduler = new Scheduler();
  const result: string[] = [];

  scheduler.taskStart();

  await new Promise<void>((resolve) => {
    setTimeout(resolve, 1000); // Wait for tasks to complete
  });

  expect(result).toEqual([]);
});
