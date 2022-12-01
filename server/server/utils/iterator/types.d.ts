export type AsyncLimitIteratorParametersType = {
  from: number;
  to: number;
  limit: number;
  asyncFunction: Function;
  asyncFunctionParams: any;
}

export type IterationDataType = {
  from: number;
  to: number;
  limit: number;
  now: number;
};

