function mergeSort(arr: number[], n = arr.length) {
  for (let width = 1; width < n; width *= 2) {
    for (let i = 0; i < n; i += 2 * width) {
      merge(arr, i, Math.min(i + width, n), Math.min(i + 2 * width, n));
    }
  }

  return arr;
}

function merge(arr: number[], start: number, mid: number, end: number) {
  for (let i = start, j = mid, canRun = true, temp: number[] = []; canRun; ) {
    if (i < mid && j < end) {
      temp.push(arr[arr[i] < arr[j] ? i++ : j++]);
    } else if (i < mid) {
      temp.push(arr[i++]);
    } else if (j < end) {
      temp.push(arr[j++]);
    } else {
      canRun = false;

      for (let idx = 0; idx < temp.length; idx++) arr[start + idx] = temp[idx];
    }
  }
}

console.log(mergeSort([5, 9, 2, 4]));
