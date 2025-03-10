// Bubble Sort
// i: 0 -> n - 1
// j: 0 -> n - i - 1
// key: arr[j] > arr[j+1] -> swap
// Space complexity: O(1)
// Time complexity: O(n^2)
/**
 * Sorts an array of numbers using the bubble sort algorithm.
 * Bubble sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent pairs and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.
 *
 * @param arr The array of numbers to be sorted
 * @returns The sorted array of numbers
 */
export function bubbleSort(arr: number[]): number[] {
    const n = arr.length;

    // Outer loop: Iterate through each element of the array
    for (let i = 0; i < n; i++) {
        // Inner loop: Compare adjacent elements and swap if necessary
        for (let j = 0; j < n - i - 1; j++) {
            // If the current element is greater than the next element, swap them
            if (arr[j] > arr[j + 1]) {
                // Swap arr[j] and arr[j + 1]
                const temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }

    // Return the sorted array
    return arr;
}

// Test array
const arr = [64, 34, 25, 12, 22, 11, 90];
// Output the sorted array
console.log(bubbleSort(arr))