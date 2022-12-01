import ReportModel from '../../../database/mongoDB/migrations/reportModel';
import GetUserCountOfReportsTotalAndByProgrammaticsMDBException from './exceptions/getUserCountOfReportsTotalAndByProgrammaticsMDBException';
import { CountReportsContract } from './interfaces';
import { GetUserCountReportsTotalAndByProgrammaticsResult, CountReportsProgrammatic } from './types';
import { PROGRAMMATICS } from '../../../constants/origins';

export default class CountReportsService implements CountReportsContract {
  public constructor() {
  }

  public async getUserCountOfReportsTotalAndByProgrammatics(id: string): Promise<GetUserCountReportsTotalAndByProgrammaticsResult | never> {
    let total: number;
    let byProgrammatics: CountReportsProgrammatic[];

    try {
      total = await ReportModel.countDocuments({ 'property.refs_to_user': id }).exec();
      byProgrammatics = await Promise.all(PROGRAMMATICS.map(async (programmatic) => {
        const count = await ReportModel.countDocuments({ 'property.refs_to_user': id, report_origin: programmatic }).exec();

        return {
          name: programmatic,
          count
        };
      }));
    } catch (error: any) {
      throw new GetUserCountOfReportsTotalAndByProgrammaticsMDBException(error.stack);
    }

    byProgrammatics = byProgrammatics.filter((programmatic) => programmatic.count);

    return {
      total,
      byProgrammatics
    }
  }
}

