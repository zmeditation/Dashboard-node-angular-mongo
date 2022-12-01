export type KeyValueExtraValueObject = {
  key: string;
  value: string | number | boolean;
  extraValue?: string | number | boolean;
};

export type ValueObject = {
  value: string | number | boolean;
}

export type StringKeyObject = {
  [key: string]: any;
};
