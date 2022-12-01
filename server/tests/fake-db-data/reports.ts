import { Types } from 'mongoose';

const reports = [
  {
    _id: Types.ObjectId('5fda1793e6bd0e1f68070f68'),
    property: {
      placement_name: 'mail.ru_160x600',
      refs_to_user: Types.ObjectId('5fd9e3ddaf4ae2d75536f7d7'),
      am: null,
      domain: 'e.mail.ru',
      property_id: 'e.mail.ru_1_300x250'
    },
    commission: {
      commission_number: 0,
      commission_type: 'eCPM'
    },
    day: '2020-12-15T00:00:00Z',
    report_origin: 'RTB House',
    inventory_sizes: '300x250',
    inventory_type: 'display',
    clicks: 200,
    ad_request: 53,
    matched_request: 53,
    ecpm: 1.51,
    updatedAt: '2020-12-16T14:20:03.261Z',
    createdAt: '2020-12-16T14:20:03.261Z',

    inventory: {
      sizes: '300x250',
      width: '300',
      height: '250',
      inventory_type: 'banner'
    }
  },
  {
    _id: Types.ObjectId('5fda1793e6bd0e1f68070f73'),
    property: {
      placement_name: 'rtb_plcmnt',
      refs_to_user: Types.ObjectId('5fd9e3ddaf4ae2d75536f7d7'),
      am: null,
      domain: 'e.mail.ru',
      property_id: 'mail.ru_short_tag_160x600'
    },
    commission: {
      commission_number: 0,
      commission_type: 'eCPM'
    },
    day: '2020-12-15T00:00:00Z',
    report_origin: 'RTB House',
    inventory_sizes: '160x600',
    inventory_type: 'display',
    clicks: 200,
    ad_request: 23491,
    matched_request: 23491,
    ecpm: 1.59,
    updatedAt: '2020-12-16T14:20:03.312Z',
    createdAt: '2020-12-16T14:20:03.312Z',

    inventory: {
      sizes: '160x600',
      width: '160',
      height: '600',
      inventory_type: 'banner'
    }
  },
  {
    _id: Types.ObjectId('5fda1793e6bd0e1f68070f74'),
    property: {
      placement_name: 'rtb_plcmnt',
      refs_to_user: Types.ObjectId('5fd9e3ddaf4ae2d75536f7d7'),
      am: null,
      domain: 'e.mail.ru',
      property_id: 'mail.ru_short_tag_160x600'
    },
    commission: {
      commission_number: 0,
      commission_type: 'eCPM'
    },
    day: '2020-12-15T00:00:00Z',
    report_origin: 'RTB House',
    inventory_sizes: '160x600',
    inventory_type: 'display',
    clicks: 200,
    ad_request: 4,
    matched_request: 4,
    ecpm: 0,
    updatedAt: '2020-12-16T14:20:03.331Z',
    createdAt: '2020-12-16T14:20:03.331Z',

    inventory: {
      sizes: '160x600',
      width: '160',
      height: '600',
      inventory_type: 'banner'
    }
  },
  {
    _id: Types.ObjectId('5fda1794e6bd0e1f68070fe1'),
    property: {
      placement_name: 'rtb_plcmnt',
      refs_to_user: Types.ObjectId('5fd9e3ddaf4ae2d75536f7d7'),
      am: null,
      domain: 'mail.ru',
      property_id: 'new_mail_ru_2_300x250'
    },
    commission: {
      commission_number: 0,
      commission_type: 'eCPM'
    },
    day: '2020-12-15T00:00:00Z',
    report_origin: 'RTB House',
    inventory_sizes: '300x250',
    inventory_type: 'display',
    clicks: 200,
    ad_request: 6,
    matched_request: 6,
    ecpm: 1.67,
    updatedAt: '2021-04-21T22:31:32.592Z',
    createdAt: '2020-12-16T14:20:04.421Z',

    inventory: {
      sizes: '300x250',
      width: '300',
      height: '250',
      inventory_type: 'banner'
    }
  },
  {
    _id: Types.ObjectId('5fda1794e6bd0e1f68070fe3'),
    property: {
      placement_name: 'rtb_plcmnt',
      refs_to_user: Types.ObjectId('5fd9e3ddaf4ae2d75536f7d7'),
      am: null,
      domain: 'mail.ru',
      property_id: 'new_mail_ru_2_300x250'
    },
    commission: {
      commission_number: 0,
      commission_type: 'eCPM'
    },
    day: '2020-12-15T00:00:00Z',
    report_origin: 'RTB House',
    inventory_sizes: '300x250',
    inventory_type: 'display',
    clicks: 200,
    ad_request: 31,
    matched_request: 31,
    ecpm: 0.97,
    updatedAt: '2021-04-21T22:31:32.592Z',
    createdAt: '2020-12-16T14:20:04.429Z',

    inventory: {
      sizes: '300x250',
      width: '300',
      height: '250',
      inventory_type: 'banner'
    }
  },
  {
    _id: Types.ObjectId('5fda1794e6bd0e1f68070fe2'),
    property: {
      placement_name: 'rtb_plcmnt',
      refs_to_user: Types.ObjectId('5fd9e3ddaf4ae2d75536f7d7'),
      am: null,
      domain: 'mail.ru',
      property_id: 'new_mail_ru_2_300x250'
    },
    commission: {
      commission_number: 0,
      commission_type: 'eCPM'
    },
    day: '2020-12-15T00:00:00Z',
    report_origin: 'RTB House',
    inventory_sizes: '300x250',
    inventory_type: 'display',
    clicks: 200,
    ad_request: 24,
    matched_request: 24,
    ecpm: 1.67,
    updatedAt: '2021-04-21T22:31:32.592Z',
    createdAt: '2020-12-16T14:20:04.424Z',

    inventory: {
      sizes: '300x250',
      width: '300',
      height: '250',
      inventory_type: 'banner'
    }
  },
  {
    _id: Types.ObjectId('5fda1794e6bd0e1f68070fe4'),
    property: {
      placement_name: 'rtb_plcmnt',
      refs_to_user: Types.ObjectId('5fd9e3ddaf4ae2d75536f7d7'),
      am: null,
      domain: 'mail.ru',
      property_id: 'new_mail_ru_2_300x250'
    },
    commission: {
      commission_number: 0,
      commission_type: 'eCPM'
    },
    day: '2020-12-15T00:00:00Z',
    report_origin: 'RTB House',
    inventory_sizes: '300x250',
    inventory_type: 'display',
    clicks: 200,
    ad_request: 152,
    matched_request: 152,
    ecpm: 1.64,
    updatedAt: '2021-04-21T22:31:32.592Z',
    createdAt: '2020-12-16T14:20:04.434Z',

    inventory: {
      sizes: '300x250',
      width: '300',
      height: '250',
      inventory_type: 'banner'
    }
  },
  {
    _id: Types.ObjectId('5fda1794e6bd0e1f68070fe5'),
    property: {
      placement_name: 'rtb_plcmnt',
      refs_to_user: Types.ObjectId('5fd9e3ddaf4ae2d75536f7d7'),
      am: null,
      domain: 'tv.mail.ru',
      property_id: 'new_mail_ru_2_300x250'
    },
    commission: {
      commission_number: 0,
      commission_type: 'eCPM'
    },
    day: '2020-12-15T00:00:00Z',
    report_origin: 'RTB House',
    inventory_sizes: '300x250',
    inventory_type: 'display',
    clicks: 200,
    ad_request: 5,
    matched_request: 5,
    ecpm: 2,
    updatedAt: '2021-04-21T22:31:32.592Z',
    createdAt: '2020-12-16T14:20:04.437Z',

    inventory: {
      sizes: '300x250',
      width: '300',
      height: '250',
      inventory_type: 'banner'
    }
  },
  {
    _id: Types.ObjectId('5fda1794e6bd0e1f68070ff6'),
    property: {
      placement_name: 'rtb_plcmnt',
      refs_to_user: Types.ObjectId('5fd9e3ddaf4ae2d75536f7d7'),
      am: null,
      domain: 'ok.ru',
      property_id: 'ok_ru_left_panel_1_300x250'
    },
    commission: {
      commission_number: 0,
      commission_type: 'eCPM'
    },
    day: '2020-12-15T00:00:00Z',
    report_origin: 'RTB House',
    inventory_sizes: '300x250',
    inventory_type: 'display',
    clicks: 200,
    ad_request: 275,
    matched_request: 275,
    ecpm: 2.22,
    updatedAt: '2021-04-21T22:31:32.592Z',
    createdAt: '2020-12-16T14:20:04.511Z',

    inventory: {
      sizes: '300x250',
      width: '300',
      height: '250',
      inventory_type: 'banner'
    }
  },
  {
    _id: Types.ObjectId('5fda1794e6bd0e1f68070ffd'),
    property: {
      placement_name: 'rtb_plcmnt',
      refs_to_user: Types.ObjectId('5fd9e3ddaf4ae2d75536f7d7'),
      am: null,
      domain: 'mail.ru',
      property_id: 'pogoda_mail_ru_2_300x250'
    },
    commission: {
      commission_number: 0,
      commission_type: 'eCPM'
    },
    day: '2020-12-15T00:00:00Z',
    report_origin: 'RTB House',
    inventory_sizes: '300x250',
    inventory_type: 'display',
    clicks: 200,
    ad_request: 147,
    matched_request: 147,
    ecpm: 1.43,
    updatedAt: '2021-04-21T22:31:32.592Z',
    createdAt: '2020-12-16T14:20:04.534Z',

    inventory: {
      sizes: '300x250',
      width: '300',
      height: '250',
      inventory_type: 'banner'
    }
  },
  {
    _id: Types.ObjectId('5fda1794e6bd0e1f68070ffc'),
    property: {
      placement_name: 'rtb_plcmnt',
      refs_to_user: Types.ObjectId('5fd9e3ddaf4ae2d75536f7d7'),
      am: null,
      domain: 'mail.ru',
      property_id: 'pogoda_mail_ru_2_300x250'
    },
    commission: {
      commission_number: 0,
      commission_type: 'eCPM'
    },
    day: '2020-12-15T00:00:00Z',
    report_origin: 'RTB House',
    inventory_sizes: '300x250',
    inventory_type: 'display',
    clicks: 200,
    ad_request: 1,
    matched_request: 1,
    ecpm: 0,
    updatedAt: '2021-04-21T22:31:32.592Z',
    createdAt: '2020-12-16T14:20:04.532Z',

    inventory: {
      sizes: '300x250',
      width: '300',
      height: '250',
      inventory_type: 'banner'
    }
  },
  {
    _id: Types.ObjectId('5fda20224f5eb83cd48348ab'),
    property: {
      placement_name: 'ok.ru_300x250',
      refs_to_user: Types.ObjectId('5fd9e3ddaf4ae2d75536f7d7'),
      am: null,
      domain: 'ok.ru',
      property_id: 'ok.ru_300x250_leftpanel'
    },
    commission: {
      commission_number: 0,
      commission_type: 'eCPM'
    },
    day: '2020-12-15T00:00:00Z',
    report_origin: 'Smart',
    inventory_sizes: '300x250',
    inventory_type: 'banner',
    clicks: 200,
    ad_request: 21616,
    matched_request: 269,
    ecpm: 1.0824,
    updatedAt: '2021-06-14T13:52:30.859Z',
    createdAt: '2020-12-16T14:56:34.754Z',

    inventory: {
      sizes: '300x250',
      width: '300',
      height: '250',
      inventory_type: 'banner'
    }
  },
  {
    _id: Types.ObjectId('5fda20224f5eb83cd48348a6'),
    property: {
      placement_name: 'ok.ru_300x250',
      refs_to_user: Types.ObjectId('5fd9e3ddaf4ae2d75536f7d7'),
      am: null,
      domain: 'mail.ru',
      property_id: '300x250'
    },
    commission: {
      commission_number: 0,
      commission_type: 'eCPM'
    },
    day: '2020-12-15T00:00:00Z',
    report_origin: 'Smart',
    inventory_sizes: '300x250',
    inventory_type: 'banner',
    clicks: 200,
    ad_request: 1090476,
    matched_request: 22006,
    ecpm: 1.4842,
    updatedAt: '2021-06-14T13:52:30.860Z',
    createdAt: '2020-12-16T14:56:34.403Z',

    inventory: {
      sizes: '300x250',
      width: '300',
      height: '250',
      inventory_type: 'banner'
    }
  },
  {
    _id: Types.ObjectId('5fda20224f5eb83cd48348b0'),
    property: {
      placement_name: 'ok.ru_300x250',
      refs_to_user: Types.ObjectId('5fd9e3ddaf4ae2d75536f7d7'),
      am: null,
      domain: 'ok.ru',
      property_id: 'ok.ru_300x250'
    },
    commission: {
      commission_number: 0,
      commission_type: 'eCPM'
    },
    day: '2020-12-15T00:00:00Z',
    report_origin: 'Smart',
    inventory_sizes: '300x250',
    inventory_type: 'banner',
    clicks: 200,
    ad_request: 1450679,
    matched_request: 15033,
    ecpm: 1.066,
    updatedAt: '2021-06-14T13:52:30.860Z',
    createdAt: '2020-12-16T14:56:34.762Z',

    inventory: {
      sizes: '300x250',
      width: '300',
      height: '250',
      inventory_type: 'banner'
    }
  },
  {
    _id: Types.ObjectId('5fda202ab501882ae4ed723f'),
    property: {
      placement_name: 'ok.ru_300x250',
      refs_to_user: Types.ObjectId('5fd9e3ddaf4ae2d75536f7d7'),
      am: null,
      domain: 'ok.ru',
      property_id: 'ok.ru_300x250_leftpanel'
    },
    commission: {
      commission_number: 0,
      commission_type: 'eCPM'
    },
    day: '2020-12-15T00:00:00Z',
    report_origin: 'Smart',
    inventory_sizes: '300x250',
    inventory_type: 'banner',
    clicks: 200,
    ad_request: 21616,
    matched_request: 269,
    ecpm: 1.0824,
    updatedAt: '2021-06-14T13:52:30.860Z',
    createdAt: '2020-12-16T14:56:42.967Z',

    inventory: {
      sizes: '300x250',
      width: '300',
      height: '250',
      inventory_type: 'banner'
    }
  },
  {
    _id: Types.ObjectId('5fda202ab501882ae4ed7222'),
    property: {
      placement_name: 'ok.ru_300x250',
      refs_to_user: Types.ObjectId('5fd9e3ddaf4ae2d75536f7d7'),
      am: null,
      domain: 'mail.ru',
      property_id: '300x250'
    },
    commission: {
      commission_number: 0,
      commission_type: 'eCPM'
    },
    day: '2020-12-15T00:00:00Z',
    report_origin: 'Smart',
    inventory_sizes: '300x250',
    inventory_type: 'banner',
    clicks: 200,
    ad_request: 1090476,
    matched_request: 22006,
    ecpm: 1.4842,
    updatedAt: '2021-06-14T13:52:30.860Z',
    createdAt: '2020-12-16T14:56:42.879Z',

    inventory: {
      sizes: '300x250',
      width: '300',
      height: '250',
      inventory_type: 'banner'
    }
  },
  {
    _id: Types.ObjectId('5fda202bb501882ae4ed726b'),
    property: {
      placement_name: 'ok.ru_300x250',
      refs_to_user: Types.ObjectId('5fd9e3ddaf4ae2d75536f7d7'),
      am: null,
      domain: 'ok.ru',
      property_id: 'ok.ru_300x250'
    },
    commission: {
      commission_number: 0,
      commission_type: 'eCPM'
    },
    day: '2020-12-15T00:00:00Z',
    report_origin: 'Smart',
    inventory_sizes: '300x250',
    inventory_type: 'banner',
    clicks: 200,
    ad_request: 1450679,
    matched_request: 15033,
    ecpm: 1.066,
    updatedAt: '2021-06-14T13:52:30.860Z',
    createdAt: '2020-12-16T14:56:43.107Z',

    inventory: {
      sizes: '300x250',
      width: '300',
      height: '250',
      inventory_type: 'banner'
    }
  },
  {
    _id: Types.ObjectId('5fdcba94f52cf429081e43fd'),
    property: {
      placement_name: 'mail.ru_160x600',
      refs_to_user: Types.ObjectId('5fd9e3ddaf4ae2d75536f7d7'),
      am: null,
      domain: 'e.mail.ru',
      property_id: 'e.mail.ru_1_300x250'
    },
    commission: {
      commission_number: 0,
      commission_type: 'eCPM'
    },
    day: '2020-12-17T00:00:00Z',
    report_origin: 'RTB House',
    inventory_sizes: '300x250',
    inventory_type: 'display',
    clicks: 200,
    ad_request: 46,
    matched_request: 46,
    ecpm: 1.74,
    updatedAt: '2020-12-18T14:20:04.404Z',
    createdAt: '2020-12-18T14:20:04.404Z',

    inventory: {
      sizes: '300x250',
      width: '300',
      height: '250',
      inventory_type: 'banner'
    }
  },
  {
    _id: Types.ObjectId('5fdcba94f52cf429081e440c'),
    property: {
      placement_name: 'rtb_plcmnt',
      refs_to_user: Types.ObjectId('5fd9e3ddaf4ae2d75536f7d7'),
      am: null,
      domain: 'e.mail.ru',
      property_id: 'mail.ru_short_tag_160x600'
    },
    commission: {
      commission_number: 0,
      commission_type: 'eCPM'
    },
    day: '2020-12-17T00:00:00Z',
    report_origin: 'RTB House',
    inventory_sizes: '160x600',
    inventory_type: 'display',
    clicks: 200,
    ad_request: 8,
    matched_request: 8,
    ecpm: 1.25,
    updatedAt: '2020-12-18T14:20:04.476Z',
    createdAt: '2020-12-18T14:20:04.476Z',

    inventory: {
      sizes: '160x600',
      width: '160',
      height: '600',
      inventory_type: 'banner'
    }
  },
  {
    _id: Types.ObjectId('5fdcba94f52cf429081e440e'),
    property: {
      placement_name: 'rtb_plcmnt',
      refs_to_user: Types.ObjectId('5fd9e3ddaf4ae2d75536f7d7'),
      am: null,
      domain: 'e.mail.ru',
      property_id: 'mail.ru_short_tag_160x600'
    },
    commission: {
      commission_number: 0,
      commission_type: 'eCPM'
    },
    day: '2020-12-17T00:00:00Z',
    report_origin: 'RTB House',
    inventory_sizes: '160x600',
    inventory_type: 'display',
    clicks: 200,
    ad_request: 29151,
    matched_request: 29151,
    ecpm: 1.8,
    updatedAt: '2020-12-18T14:20:04.494Z',
    createdAt: '2020-12-18T14:20:04.494Z',

    inventory: {
      sizes: '160x600',
      width: '160',
      height: '600',
      inventory_type: 'banner'
    }
  }
];

export { reports };
