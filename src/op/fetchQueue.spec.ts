import {fetchQueue} from "@/op/fetchQueue";

const urls = ['https://api.vvhan.com/api/dailyEnglish', 'https://api.xygeng.cn/one', 'https://api.vvhan.com/api/wyMusic/热歌榜', 'https://api.vvhan.com/api/bing'];
test('fetchQueue - Limit 2', async () => {
  const limit = 2;

  const callback = (results: Response[]) => {
    expect(results).toHaveLength(urls.length); // Check if all URLs have been processed
    expect(results).toContainEqual({ status: 200 }); // Example assertion for successful response
    // Add more assertions based on your requirements
  };

  await new Promise<void>((resolve) => {
    fetchQueue(urls, limit, callback);
    setTimeout(resolve, 2000); // Wait for requests to complete
  });
});

test('fetchQueue - Limit 1', async () => {
  const limit = 1;

  const callback = (results: Response[]) => {
    expect(results).toHaveLength(urls.length); // Check if all URLs have been processed
    expect(results).toContainEqual({ status: 200 }); // Example assertion for successful response
    // Add more assertions based on your requirements
  };

  await new Promise<void>((resolve) => {
    fetchQueue(urls, limit, callback);
    setTimeout(resolve, 3000); // Wait for requests to complete
  });
});
