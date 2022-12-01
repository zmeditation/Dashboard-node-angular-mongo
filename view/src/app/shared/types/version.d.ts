export type DescriptionType = {
  out: string;
  in: string;
};

export type VersionType = {
  version: string;
  releaseDate: Date;
  description: string | DescriptionType;
};

export type UpdateVersionType = {
  lastVersion: string;
  newVersion: string;
  releaseDate: Date;
  description: DescriptionType;
};

export type GetVersionIntoParamsTypes = {
  version: string;
  userRole: string;
};
