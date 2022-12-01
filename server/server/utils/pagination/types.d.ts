/** @format */

export type SettingsMongoDB = {
  page: number;
  limit: number;
  step: number;
  indent: number;
  totalRows: number;
};

export type ResultSettingsMongoDb = {
  page: number;
  limit: number;
  startIndex: number;
  countPages: number;
  totalRows: number;
};

export type SettingsBreakObjectIntoPages = {
  items: any[];
  countPages: number;
  limit: number;
};
