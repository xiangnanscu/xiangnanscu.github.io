# JS简易内置并发函数
## 代码
```javascript
async function concurrentExecutor(array, asyncCallback, concurrency = 5) {
  const results = [];
  let currentIndex = 0;

  async function executeNext() {
    if (currentIndex >= array.length) return;

    const index = currentIndex++;
    try {
      const result = await asyncCallback(array[index], index);
      results[index] = result;
    } catch (error) {
      results[index] = new Error(`Task at index ${index} failed: ${error.message}`);
    }

    await executeNext();
  }

  const workers = Array(concurrency).fill().map(executeNext);
  await Promise.all(workers);

  return results;
}

// 示例用法
const concurrency = 3;
const array = [1, 2, 3, 4, 5];

concurrentExecutor(array, async (item, index) => {
  console.log(`Processing item ${item} at index ${index}`);
  await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟异步操作
  console.log(`Finished processing item ${item} at index ${index}`);
  return `Result of item ${item}`;
}, concurrency)
  .then(results => {
    console.log('All tasks are done');
    console.log('Results:', results);
  })
  .catch(err => {
    console.error('An error occurred:', err);
  });
```

## 解释

1. **concurrentExecutor 函数**:
   - 接受三个参数：`concurrency`（并发数）、`array`（数组）和 `asyncCallback`（异步回调函数）。
   - 使用 `results` 数组来存储每个任务的结果或错误。
   - `currentIndex` 用于跟踪当前处理到的数组索引。
   - `executeNext` 函数负责递归调用自身，处理下一个任务，并确保并发数不超过限制。
   - 创建一个包含 `concurrency` 个 `executeNext` 函数的数组，并使用 `Promise.all` 等待所有任务完成。

2. **示例用法**:
   - 调用 `concurrentExecutor` 函数，传入并发数、数组和一个模拟的异步回调函数。
   - 在所有任务完成后，打印结果或处理可能发生的错误。

这个实现确保了异步任务的并发执行，并且不会超过指定的并发数。