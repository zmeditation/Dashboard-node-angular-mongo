export type DomainType = {
  id: string | number;
  name: string;
  refsToUser?: string[];
};

export type GetDomainByNameParamsType = {
  name: string;
  fields?: string[];
};
