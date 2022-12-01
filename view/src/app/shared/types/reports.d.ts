export type FormIntervalsType = {
  name: string,
  value: string,
  enabled?: boolean
}

export type FormFiltersType = {
  name: string,
  value: string,
  permissions: Array<string>,
  selected: {
    status: string,
    values: Array<string>,
    names: Array<string>,
  }
}

export type FormDimensionsType = {
  name: string,
  value: string,
  selected: boolean,
  permissions: Array<string>
}

export type FormMetricsType = {
  name: string,
  value: string,
  selected: boolean
}

export type Metric = {
  name: string,
  value: string,
  selected: boolean
}

export type Filter = {
  name: string,
  value: string,
  permissions: string[],
  selected: {
    status: any,
    values: Array<any>,
    names: Array<any>
  }
}

export type Dimension = {
  name: string,
  value: string,
  selected: boolean,
  permissions: string[]
}

export type ManagerRevenueObject = {
  revenue: number;
  account: {
    name: string,
    photo: string | undefined
  }
}
