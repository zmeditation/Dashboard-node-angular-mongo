import { GetUserCountReportsTotalAndByProgrammaticsResult } from './types';

export interface CountReportsContract {
  getUserCountOfReportsTotalAndByProgrammatics(id: string): Promise<GetUserCountReportsTotalAndByProgrammaticsResult|never>;
}
