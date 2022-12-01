import { Types } from 'mongoose';

const domains = [
  {
    _id: Types.ObjectId('5fe0aa3a68284940946d7359'),
    last_modify: {
      user: Types.ObjectId('5fd9dc21af4ae2d75536f7d6'),
      date: '2021-03-16T10:51:13Z',
      changes: 'Connected domain to publisher'
    },
    refs_to_user: [
      Types.ObjectId('5fe47d588acefd39cc2f7472'),
      Types.ObjectId('5fd9e3ddaf4ae2d75536f7d7'),
      Types.ObjectId('60508cf9ab6ca4002be73551'),
      Types.ObjectId('5fdb3d3f36efda18b4b1701a')
    ],
    approved: true,
    enabled: true,
    domain: 'click.my.mail.ru',
    createdAt: '2020-12-21T13:59:24.079Z',
    updatedAt: '2021-03-16T10:51:13.249Z',
    ortb: false
  },
  {
    _id: Types.ObjectId('5fe0aa3a68284940946d735b'),
    last_modify: {
      user: Types.ObjectId('5fd9dc21af4ae2d75536f7d6'),
      date: '2021-05-12T12:16:53Z',
      changes: 'Connected domain to publisher'
    },
    refs_to_user: [
      Types.ObjectId('5fe47d588acefd39cc2f7472'),
      Types.ObjectId('5fd9e3ddaf4ae2d75536f7d7'),
      Types.ObjectId('60508cf9ab6ca4002be73551'),
      Types.ObjectId('6078179aeb7ec19b76fb5ed1'),
      Types.ObjectId('5fdcbb46c7d6ff1da4fb4392')
    ],
    approved: true,
    enabled: true,
    domain: 'e.mail.ru',
    createdAt: '2020-12-21T13:59:24.085Z',
    updatedAt: '2021-05-12T12:16:53.210Z',
    ortb: false
  },
  {
    _id: Types.ObjectId('5fe0aa3a68284940946d735c'),
    last_modify: {
      user: Types.ObjectId('5fd9dc21af4ae2d75536f7d6'),
      date: '2021-03-16T10:52:01Z',
      changes: 'Connected domain to publisher'
    },
    refs_to_user: [Types.ObjectId('5fd9e3ddaf4ae2d75536f7d7'), Types.ObjectId('60508cf9ab6ca4002be73551')],
    approved: true,
    enabled: true,
    domain: 'games.ok.ru',
    createdAt: '2020-12-21T13:59:24.086Z',
    updatedAt: '2021-03-16T10:52:01.656Z',
    ortb: false
  },
  {
    _id: Types.ObjectId('5fe0aa3a68284940946d7362'),
    last_modify: {
      user: Types.ObjectId('5fd9dc21af4ae2d75536f7d6'),
      date: '2021-03-16T10:51:13Z',
      changes: 'Connected domain to publisher'
    },
    refs_to_user: [
      Types.ObjectId('5fe47d588acefd39cc2f7472'),
      Types.ObjectId('5fd9e3ddaf4ae2d75536f7d7'),
      Types.ObjectId('60508cf9ab6ca4002be73551')
    ],
    approved: true,
    enabled: true,
    domain: 'mobs.mail.ru',
    createdAt: '2020-12-21T13:59:24.114Z',
    updatedAt: '2021-03-16T10:51:13.250Z',
    ortb: false
  },
  {
    _id: Types.ObjectId('5fe0aa3a68284940946d735a'),
    last_modify: {
      user: Types.ObjectId('5fd9dc21af4ae2d75536f7d6'),
      date: '2021-05-12T12:16:53Z',
      changes: 'Connected domain to publisher'
    },
    refs_to_user: [
      Types.ObjectId('5fe47d588acefd39cc2f7472'),
      Types.ObjectId('5fd9e3ddaf4ae2d75536f7d7'),
      Types.ObjectId('60508cf9ab6ca4002be73551'),
      Types.ObjectId('6078179aeb7ec19b76fb5ed1')
    ],
    approved: true,
    enabled: true,
    domain: 'dom.mail.ru',
    createdAt: '2020-12-21T13:59:24.081Z',
    updatedAt: '2021-05-12T12:16:53.211Z',
    ortb: false
  },
  {
    _id: Types.ObjectId('5fe0aa3a68284940946d735e'),
    last_modify: {
      user: Types.ObjectId('5fd9dc21af4ae2d75536f7d6'),
      date: '2021-05-12T12:16:53Z',
      changes: 'Connected domain to publisher'
    },
    refs_to_user: [
      Types.ObjectId('5fe47d588acefd39cc2f7472'),
      Types.ObjectId('5fd9e3ddaf4ae2d75536f7d7'),
      Types.ObjectId('60508cf9ab6ca4002be73551'),
      Types.ObjectId('6078179aeb7ec19b76fb5ed1')
    ],
    approved: true,
    enabled: true,
    domain: 'go.mail.ru',
    createdAt: '2020-12-21T13:59:24.092Z',
    updatedAt: '2021-05-12T12:16:53.211Z',
    ortb: false
  },
  {
    _id: Types.ObjectId('5fe0aa3a68284940946d7363'),
    last_modify: {
      user: Types.ObjectId('5fd9dc21af4ae2d75536f7d6'),
      date: '2021-03-16T10:52:01Z',
      changes: 'Connected domain to publisher'
    },
    refs_to_user: [Types.ObjectId('5fd9e3ddaf4ae2d75536f7d7'), Types.ObjectId('60508cf9ab6ca4002be73551')],
    approved: true,
    enabled: true,
    domain: 'ok.ru',
    createdAt: '2020-12-21T13:59:24.116Z',
    updatedAt: '2021-03-16T10:52:01.656Z',
    ortb: false
  },
  {
    _id: Types.ObjectId('5fe0aa3a68284940946d735f'),
    last_modify: {
      user: Types.ObjectId('5fd9dc21af4ae2d75536f7d6'),
      date: '2021-05-12T12:16:53Z',
      changes: 'Connected domain to publisher'
    },
    refs_to_user: [
      Types.ObjectId('5fe47d588acefd39cc2f7472'),
      Types.ObjectId('5fd9e3ddaf4ae2d75536f7d7'),
      Types.ObjectId('60508cf9ab6ca4002be73551'),
      Types.ObjectId('6078179aeb7ec19b76fb5ed1')
    ],
    approved: true,
    enabled: true,
    domain: 'horo.mail.ru',
    createdAt: '2020-12-21T13:59:24.095Z',
    updatedAt: '2021-05-12T12:16:53.211Z',
    ortb: false
  },
  {
    _id: Types.ObjectId('5fe0aa3a68284940946d7361'),
    last_modify: {
      user: Types.ObjectId('5fd9dc21af4ae2d75536f7d6'),
      date: '2021-05-12T12:16:53Z',
      changes: 'Connected domain to publisher'
    },
    refs_to_user: [
      Types.ObjectId('5fe47d588acefd39cc2f7472'),
      Types.ObjectId('5fd9e3ddaf4ae2d75536f7d7'),
      Types.ObjectId('60508cf9ab6ca4002be73551'),
      Types.ObjectId('6078179aeb7ec19b76fb5ed1')
    ],
    approved: true,
    enabled: true,
    domain: 'mail.ru',
    createdAt: '2020-12-21T13:59:24.097Z',
    updatedAt: '2021-05-12T12:16:53.211Z',
    ortb: false
  },
  {
    _id: Types.ObjectId('5fe0aa3a68284940946d7360'),
    last_modify: {
      user: Types.ObjectId('5fd9dc21af4ae2d75536f7d6'),
      date: '2021-03-16T10:52:01Z',
      changes: 'Connected domain to publisher'
    },
    refs_to_user: [Types.ObjectId('5fd9e3ddaf4ae2d75536f7d7'), Types.ObjectId('60508cf9ab6ca4002be73551')],
    approved: true,
    enabled: true,
    domain: 'm.ok.ru',
    createdAt: '2020-12-21T13:59:24.093Z',
    updatedAt: '2021-03-16T10:52:01.656Z',
    ortb: false
  },
  {
    _id: Types.ObjectId('5fe0aa3a68284940946d7367'),
    last_modify: {
      user: Types.ObjectId('5fd9dc21af4ae2d75536f7d6'),
      date: '2021-05-12T12:16:53Z',
      changes: 'Connected domain to publisher'
    },
    refs_to_user: [
      Types.ObjectId('5fe47d588acefd39cc2f7472'),
      Types.ObjectId('5fd9e3ddaf4ae2d75536f7d7'),
      Types.ObjectId('60508cf9ab6ca4002be73551'),
      Types.ObjectId('6078179aeb7ec19b76fb5ed1')
    ],
    approved: true,
    enabled: true,
    domain: 'tv.mail.ru',
    createdAt: '2020-12-21T13:59:24.137Z',
    updatedAt: '2021-05-12T12:16:53.211Z',
    ortb: false
  },
  {
    _id: Types.ObjectId('5fe0aa3a68284940946d736d'),
    last_modify: {
      user: Types.ObjectId('5fd9dc21af4ae2d75536f7d6'),
      date: '2021-03-16T10:52:01Z',
      changes: 'Connected domain to publisher'
    },
    refs_to_user: [Types.ObjectId('5fd9e3ddaf4ae2d75536f7d7'), Types.ObjectId('60508cf9ab6ca4002be73551')],
    approved: true,
    enabled: true,
    domain: 'connect.ok.ru',
    createdAt: '2020-12-21T13:59:24.154Z',
    updatedAt: '2021-03-16T10:52:01.656Z',
    ortb: false
  },
  {
    _id: Types.ObjectId('5fe0aa3a68284940946d736e'),
    last_modify: {
      user: Types.ObjectId('5fd9dc21af4ae2d75536f7d6'),
      date: '2021-05-12T12:16:53Z',
      changes: 'Connected domain to publisher'
    },
    refs_to_user: [
      Types.ObjectId('5fe47d588acefd39cc2f7472'),
      Types.ObjectId('5fd9e3ddaf4ae2d75536f7d7'),
      Types.ObjectId('60508cf9ab6ca4002be73551'),
      Types.ObjectId('6078179aeb7ec19b76fb5ed1')
    ],
    approved: true,
    enabled: true,
    domain: 'octavius.mail.ru',
    createdAt: '2020-12-21T13:59:24.158Z',
    updatedAt: '2021-05-12T12:16:53.211Z',
    ortb: false
  },
  {
    _id: Types.ObjectId('5fe0aa3a68284940946d7373'),
    last_modify: {
      user: Types.ObjectId('5fd9dc21af4ae2d75536f7d6'),
      date: '2021-05-12T12:16:53Z',
      changes: 'Connected domain to publisher'
    },
    refs_to_user: [
      Types.ObjectId('5fe47d588acefd39cc2f7472'),
      Types.ObjectId('5fd9e3ddaf4ae2d75536f7d7'),
      Types.ObjectId('60508cf9ab6ca4002be73551'),
      Types.ObjectId('6078179aeb7ec19b76fb5ed1')
    ],
    approved: true,
    enabled: true,
    domain: 'sq2.go.mail.ru',
    createdAt: '2020-12-21T13:59:24.196Z',
    updatedAt: '2021-05-12T12:16:53.211Z',
    ortb: false
  },
  {
    _id: Types.ObjectId('603e26f6903fcd2428436a46'),
    last_modify: {
      user: Types.ObjectId('5fd9dc21af4ae2d75536f7d6'),
      date: '2021-05-12T12:16:53Z',
      changes: 'Connected domain to publisher'
    },
    refs_to_user: [
      Types.ObjectId('5fd9e3ddaf4ae2d75536f7d7'),
      Types.ObjectId('60508cf9ab6ca4002be73551'),
      Types.ObjectId('6078179aeb7ec19b76fb5ed1')
    ],
    approved: true,
    enabled: true,
    ortb: false,
    domain: 'ad.mail.ru',
    createdAt: '2021-03-02T11:52:22.636Z',
    updatedAt: '2021-05-12T12:16:53.211Z'
  },
  {
    _id: Types.ObjectId('6040e55f644dd44f24e8ebd7'),
    last_modify: {
      date: '2021-03-04T01:49:19Z',
      changes: 'just created',
      user: Types.ObjectId('5fd9dc21af4ae2d75536f7d6')
    },
    refs_to_user: [
      Types.ObjectId('5fd9e3ddaf4ae2d75536f7d7'),
      Types.ObjectId('5fdcdceba2418c45d855a377'),
      Types.ObjectId('5fdcbb46c7d6ff1da4fb4392')
    ],
    approved: true,
    enabled: true,
    ortb: false,
    domain: 'ads.ok.ru',
    createdAt: '2021-03-04T13:49:19.574Z',
    updatedAt: '2021-03-04T13:49:19.574Z'
  }
];

export { domains };
