export async function serialPromise(promiseArr: Promise<any>[], callback: (result: any) => void) {
  let result = [];
  for await (const p of promiseArr) {
    let res;
    try {
      res = await p;
      result.push(res)
      console.log('ok:', res);
    } catch (e) {
      res = e
      result.push(res)

      console.log('error:', res);
    }
  }

  callback(result)
  return result;
}

export async function serialPromise1(promiseArr: (Promise<any> | (() => Promise<any>))[], callback: (result: any) => void) {
  let resolves = [];

  while(promiseArr.length > 0) {
    let p = promiseArr.shift();
    let newP = new Promise((resolve, reject) => {
      if(p instanceof Promise) {
        p.then((res: unknown) => {
          resolve({ data: res, type: 'success'})
        }).catch((e: any) => {
          resolve({ data: e, type: 'error'})
        })
      }
      if(typeof p === 'function') {
        p().then((res: unknown) => {
          resolve({ data: res, type: 'success'})
        }).catch((e: any) => {
          resolve({ data: e, type: 'error'})
        })
      }
    })

    resolves.push(newP)
  }
  return Promise.all(resolves).then((arr) => {
    callback(arr)
    return arr
  });
}
