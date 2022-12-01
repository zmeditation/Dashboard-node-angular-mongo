export type DescriptionType = {
  in: string,
  out: string|null;
}

export type VersionType = {
  _id?: string | number;
  version: string;
  releaseDate: string | Date;
  description: string | DescriptionType | any;
};

export type UpdateVersionType = {
  lastVersion: string;
  newVersion: string;
  releaseDate: string | Date;
  description: DescriptionType;
};

export type GetVersionInformationParamsType = {
  version: string;
  userRole: string;
};
