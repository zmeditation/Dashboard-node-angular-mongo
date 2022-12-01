export type GetUserCountReportsTotalAndByProgrammaticsResult = {
  total: number;
  byProgrammatics: CountReportsProgrammatic[];
};

export type CountReportsProgrammatic = {
  name: string;
  count: number;
};

