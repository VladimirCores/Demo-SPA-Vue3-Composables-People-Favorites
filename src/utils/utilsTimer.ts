export const debounce = (callback: (...args:unknown[]) => unknown, wait: number) => {
  let timeoutId: number | undefined;
  return (...args:unknown[]) => {
    timeoutId && clearTimeout(timeoutId);
    // eslint-disable-next-line prefer-spread
    timeoutId = setTimeout(() => callback.apply(null, args), wait);
  };
};

export function delay(ms:number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
