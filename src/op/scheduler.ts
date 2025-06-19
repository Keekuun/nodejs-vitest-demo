export class Scheduler {
  private readonly queue: Array<() => Promise<void>>;
  private readonly maxCount: number;
  private runCounts: number;

  constructor() {
    this.queue = [];
    this.maxCount = 2;
    this.runCounts = 0;
  }

  add(promiseCreator: () => Promise<void>): void {
    this.queue.push(promiseCreator);
  }

  taskStart(): void {
    for (let i = 0; i < this.maxCount; i++) {
      this.request();
    }
  }

  private request(): void {
    const queueEmpty = this.queue.length === 0;
    const atMaxConcurrency = this.runCounts >= this.maxCount;

    if (queueEmpty || atMaxConcurrency) {
      return;
    }

    this.runCounts++;

    const promiseCreator = this.queue.shift();
    if (!promiseCreator) {
      this.runCounts--;
      return;
    }

    promiseCreator()
      .catch((error) => {
        // 可选：根据业务需求决定是否重新加入队列或记录日志
        console.error('Task failed:', error);
      })
      .finally(() => {
        this.runCounts--;
        this.request();
      });
  }
}
