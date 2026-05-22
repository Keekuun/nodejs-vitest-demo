// react use debounce function hook

import {useCallback, useEffect, useRef, useState} from 'react';
import {clearTimeout} from "node:timers";

function useDebouncedFn<T extends (...args: any[]) => any>(fn: T, delay: number = 200): T {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedFn = useCallback(
    (...args: Parameters<T>): void => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        fn(...args);
        timeoutRef.current = null;
      }, delay);
    },
    [fn, delay]
  );

  return debouncedFn as T;
}

export default useDebouncedFn;

export function useDebouncedSearch<T>(
    searchFn: (query: string, signal: AbortSignal) => Promise<T>,
    delay = 300,
    reqTimeout = 8000,
    maxCacheSize = 30
) {
    const [query, setQuery] = useState('');
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const abortRef = useRef<AbortController | null>(null);
    // Map天然有序，实现LRU：新访问放末尾，淘汰头部
    const lruCacheRef = useRef<Map<string, T>>(new Map());
    const pendingQueryRef = useRef<string | null>(null);

    // 统一清理
    const clearAll = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (abortRef.current) abortRef.current.abort();
        timerRef.current = null;
        abortRef.current = null;
    };

    // LRU 更新+淘汰
    const updateLRUCache = (key: string, value: T) => {
        const cache = lruCacheRef.current;
        // 已存在先删除，重新插入尾部标记为最近使用
        if (cache.has(key)) cache.delete(key);
        cache.set(key, value);
        // 超出容量删除头部最久未使用
        if (cache.size > maxCacheSize) {
            const oldestKey = cache.keys().next().value!;
            cache.delete(oldestKey);
        }
    };

    // 读取缓存，触发LRU刷新顺序
    const getCache = (key: string): T | null => {
        const cache = lruCacheRef.current;
        if (!cache.has(key)) return null;
        const val = cache.get(key)!;
        cache.delete(key);
        cache.set(key, val);
        return val;
    };

    useEffect(() => {
        clearAll();
        const trimQuery = query.trim();

        if (!trimQuery) {
            setData(null);
            setError(null);
            setLoading(false);
            pendingQueryRef.current = null;
            return;
        }

        // LRU缓存命中
        const cacheData = getCache(trimQuery);
        if (cacheData) {
            setData(cacheData);
            setError(null);
            setLoading(false);
            return;
        }

        // 拦截重复并发请求
        if (pendingQueryRef.current === trimQuery) return;
        pendingQueryRef.current = trimQuery;

        setLoading(true);
        setError(null);

        timerRef.current = setTimeout(async () => {
            const controller = new AbortController();
            abortRef.current = controller;

            // 请求超时自动中止
            const timeoutTimer = setTimeout(() => controller.abort(), reqTimeout);

            try {
                const result = await searchFn(trimQuery, controller.signal);
                updateLRUCache(trimQuery, result);
                setData(result);
            } catch (err: unknown) {
                const errObj = err as Error;
                if (errObj.name !== 'AbortError') {
                    setError(errObj instanceof Error ? errObj : new Error('search failed !'));
                    setData(null);
                }
            } finally {
                clearTimeout(timeoutTimer);
                setLoading(false);
                pendingQueryRef.current = null;
                abortRef.current = null;
            }
        }, delay);

        return clearAll;
    }, [query, delay, reqTimeout, maxCacheSize, searchFn]);

    const reset = () => {
        setQuery('');
        setData(null);
        setError(null);
        setLoading(false);
        pendingQueryRef.current = null;
        clearAll();
    };

    const clearCache = () => lruCacheRef.current.clear();

    return {
        query,
        setQuery,
        data,
        loading,
        error,
        reset,
        clearCache
    };
}

// example use
const { query, setQuery, data, loading } = useDebouncedSearch(
    async (q, signal) => {
        const res = await fetch(`/api/search?q=${q}`, { signal });
        return res.json();
    },
    300,   // 防抖时延
    8000,  // 请求超时
    20     // LRU最大缓存条数
);