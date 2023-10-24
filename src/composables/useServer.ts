import { IPeopleData } from '~/interfaces';

const fetchPages = (
  url: string,
  controller: AbortController,
  onProgress?: (pageResult:IPeopleData, finalResult:IPeopleData | undefined) => void,
):Promise<IPeopleData | undefined> => {
  let finalResult:IPeopleData | undefined;
  return new Promise((resolve, reject) => {
    const getPage = (url:string):Promise<IPeopleData | undefined> =>
      fetch(url, {signal: controller.signal})
        .then((res) => {
          if (!res.ok) throw new Error(res.statusText);
          return res.json() as Promise<IPeopleData>;
        })
        .then((pageResult:IPeopleData) => {
          if (onProgress) onProgress(pageResult, finalResult);
          if (!finalResult) {
            finalResult = pageResult as IPeopleData;
          } else {
            finalResult.next = pageResult.next;
            finalResult.results.push(...pageResult.results);
          }
          // if (pageResult.next) return getPage(pageResult.next);
          return finalResult;
        });
    getPage(url)
      .then(resolve)
      .catch((error) => error.code !== 20 && reject(error) || resolve(undefined)); // name === 'AbortError'
  });
};

export default () => {
  return { fetchPages };
};
