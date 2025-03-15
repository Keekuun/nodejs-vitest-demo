// 桶排序
export function bucketSort(arr: number[], bucketSize = 5) {
  if (arr.length < 2) return arr;

  const minValue = Math.min(...arr);
  const maxValue = Math.max(...arr);

  // 桶的数量
  const bucketCount = Math.floor((maxValue - minValue) / bucketSize) + 1;
  const buckets = new Array(bucketCount);

  // 放入桶中
  for (let i = 0; i < arr.length; i++){
      const bucketIndex = Math.floor((arr[i] - minValue) / bucketSize);
      if (!buckets[bucketIndex]) {
          buckets[bucketIndex] = [];
      }
      buckets[bucketIndex].push(arr[i]);
  }

  // 对每个桶进行排序
  for (let i = 0; i < buckets.length; i++) {
      if (!buckets[i]) continue;
      // insertionSort(buckets[i]);
      buckets[i].sort((a: number, b: number) => a - b);
  }

  // 合并
  for (let i = 0, k = 0; i < buckets.length; i++) {
      if (!buckets[i]) continue;
      for (let j = 0; j < buckets[i].length; j++) {
          arr[k++] = buckets[i][j];
      }
  }

  return arr;
}

// 测试
// len=15 , max=50, min=2
// bucketCount = Math.floor((maxValue - minValue) / bucketSize) + 1 = ~~(50 - 2) / 15 + 1 = 4;
// [[], [], [], []]
// arr[i] --> bucketIndex = Math.floor((arr[i] - minValue) / bucketSize)
// 5 ~~(5 - 2) / 15 = 0
// 44 ~~(44 - 2) / 15 = 3
const arr = [3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48];
console.log(bucketSort(arr))