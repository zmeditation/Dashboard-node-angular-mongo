import { expect } from 'chai';
import Iterator from '../../server/utils/iterator';
import { IterationDataType } from '../../server/utils/iterator/types';

describe('Utils => Iterator', () => {
  it('should generate async limit iterator', async () => {
    const from = 0;
    const to = 1000;
    const limit = 300;
    let now = 0;
    let id = 0;
    const data = { id };
    const asyncFunction = (params: { id: number }, iterationData: IterationDataType) => {
      expect(id).to.be.a('number');
      expect(params.id === id).to.be.true;
      expect(iterationData.from === from).to.be.true;
      expect(iterationData.to === to).to.be.true;
      expect(iterationData.limit === limit).to.be.true;
      expect(iterationData.now === now).to.be.true;

      id++;
      data.id++;
      now += limit;

      return true;
    };

    const iterator = Iterator.generateAsyncLimitIterator({
      asyncFunction,
      asyncFunctionParams: data,
      from,
      to,
      limit
    });

    for await (let value of iterator) {
      expect(value).to.be.true;
    }
  });
});
