export function fetchQueue(urls: string[], limit: number, callback: Function) {
  const results: Response[] = [];
  for(let i=0; i<limit; i++) {
    _request(urls.shift()!);
  }
  function _request(url: string) {
    fetch(url).then(res => {
      results.push(res);
    }).catch(err => {
      results.push(err);
    }).finally(() => {
      if(urls.length) {
        _request(urls.shift()!);
      } else {
        callback(results);
      }
    })
  }
}

// Example usage
const urls = ['https://api.example.com/1', 'https://api.example.com/2', 'https://api.example.com/3'];
const limit = 2;

fetchQueue(urls, limit, (results: any) => {
  console.log(results);
});
