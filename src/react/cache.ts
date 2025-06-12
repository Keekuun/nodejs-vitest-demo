type AsyncFunction = (...args: any[]) => Promise<any>;

/**
 * 创建一个新的缓存实例。在真实的服务器环境中，
 * 你会在每个服务器请求开始时调用它。
 */
function createRequestCache() {
  // 这个 WeakMap 用于存储每个函数的缓存。
  // 结构是：WeakMap<Function, Map<Key, Value>>
  // 我们使用 WeakMap，这样如果函数本身被垃圾回收，它的缓存也会被自动移除。
  const cacheStore = new WeakMap();

  console.log('[系统]一个新的请求作用域缓存已被创建。');

  /**
   * 缓存函数，功能类似于 React.cache。
   * @param {Function} fn 要被记忆化的异步函数。
   */
  function cache(fn: AsyncFunction) {
    // 返回一个新的、包含了缓存逻辑的包装函数。
    return async function(...args: any[]) {
      // 1. 获取或创建针对这个特定函数 `fn` 的参数缓存。
      if (!cacheStore.has(fn)) {
        cacheStore.set(fn, new Map());
      }
      const argumentCache = cacheStore.get(fn);

      // 2. 从参数创建一个稳定的键。
      // 注意：这是一个简化的键生成策略。React 的内部实现更健壮。
      // JSON.stringify 并不完美（例如，对于对象键的顺序），但用于演示已经足够好。
      const key = JSON.stringify(args);

      // 3. 检查缓存是否命中。
      if (argumentCache.has(key)) {
        console.log(`[缓存命中] 函数: ${fn.name}, 参数: ${key}`);
        return argumentCache.get(key);
      }

      // 4. 处理缓存未命中的情况。
      console.log(`[缓存未命中] 函数: ${fn.name}, 参数: ${key}`);

      // 执行原始函数。其结果是一个 Promise。
      const resultPromise = fn(...args);

      // 将这个 Promise 存入缓存。
      argumentCache.set(key, resultPromise);

      return resultPromise;
    };
  }

  return { cache };
}

// --- 模拟场景 ---

// 定义一个我们假想的、很慢的数据获取函数。
async function getUser(id) {
  console.log(`[网络] 正在获取 ID 为 ${id} 的用户... (这会很慢)`);
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { id, name: `用户 ${id}` };
}

// 这个函数模拟一次完整的服务器请求和页面渲染。
async function handleServerRequest() {
  console.log("--- 收到新的服务器请求 ---");

  // 对每个请求，我们都获取一个全新的、干净的缓存实例。
  const { cache } = createRequestCache();

  // 用我们自己实现的 cache 来包装数据获取函数。
  const getCachedUser = cache(getUser);

  // 现在，我们模拟一个组件树的渲染过程。
  console.log("正在渲染组件树...");

  // 想象 Layout.js 调用它，然后 Page.js 也调用它。
  const userPromise1 = getCachedUser(123); // 第一次调用
  const userPromise2 = getCachedUser(123); // 第二次调用，参数相同
  const userPromise3 = getCachedUser(456); // 第三次调用，参数不同

  // 等待所有结果返回
  const [user1, user2, user3] = await Promise.all([
    userPromise1,
    userPromise2,
    userPromise3,
  ]);

  console.log("\n--- 渲染完成 ---");
  console.log("结果 1:", user1);
  console.log("结果 2:", user2);
  console.log("结果 3:", user3);

  console.assert(user1 === user2, "断言失败: user1 和 user2 应该是同一个对象引用！");
  console.log("\n断言通过: user1 和 user2 指向同一份数据，证明去重成功。");
}

// 运行模拟
handleServerRequest();
