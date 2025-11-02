export class PromisesUtil {
  static async runSequentially<T, R>(
    array: T[],
    asyncFn: (item: T) => Promise<R>,
  ): Promise<R[]> {
    return array.reduce<Promise<R[]>>(
      (promiseChain, currentItem) =>
        promiseChain.then(async (results) => {
          const result = await asyncFn(currentItem);

          return [...results, result];
        }),
      Promise.resolve([]),
    );
  }
}
