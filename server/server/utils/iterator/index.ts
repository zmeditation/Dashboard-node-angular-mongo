import { AsyncLimitIteratorParametersType } from './types';

export default class Iterator {
  public static generateAsyncLimitIterator(data: AsyncLimitIteratorParametersType) {
    const { from, to, limit, asyncFunction, asyncFunctionParams } = data;

    return {
      async *[Symbol.asyncIterator]() {
        for(let now = from; now < to; now += limit) {          
          yield await asyncFunction(asyncFunctionParams, { from, to, limit, now });
        }
      }
    };
  }
}

