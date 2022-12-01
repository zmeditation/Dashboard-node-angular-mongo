import { Types } from 'mongoose';

const versionsData = [
  {
    version: 'v1.1.1.1',
    release_date: '2021-05-13T21:00:00Z',
    description: 'Anime forever\nAnime'
  },
  {
    version: 'v1.2.2.3',
    release_date: '2021-06-10T21:00:00Z',
    description: {
      in: 'qwefqwef11111',
    }
  },

  {
    version: 'v1.2.3.3',
    release_date: '2021-07-10T21:00:00Z',
    description: {
      in: 'qwefqwef11111',
      out: 'qwefqwefqwef1234'
    }
  },
  {
    version: 'v1.4.2.3',
    release_date: '2021-08-10T21:00:00Z',
    description: {
      in: 'qwefqwef11111',
    }
  }
];

export {
  versionsData
};
