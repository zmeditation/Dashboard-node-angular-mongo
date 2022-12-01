import { UpdatePubAMResultType } from './types';

export interface PubAMUpdateReportsContract {
  update(publisherId: string): AsyncGenerator<any, any, any>;
}
