export type PublisherDataType = {
  publisherId: string;
  accountManagerId: string;
  pubName: string;
};

export type UpdatePubAMResultType = {
  completed: boolean;
  updatedItemsPerLimit?: number;
  countUpdatedItems?: number;
  data: PublisherDataType;
};
