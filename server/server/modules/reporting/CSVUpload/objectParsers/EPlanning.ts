import moment from 'moment';
import { Fields, FieldsTypeObject } from "./fieldMap";
import { ParsedCSVReportType, ReportInventory } from '../../../../database/mongoDB/migrations/reportModel/types';
import CSVParserHelper from '../helpers/index';

class EPlanning {

  private fields: FieldsTypeObject = Fields.EPlanning;
  private origin: string = 'E-Planning';

  constructor() {
  }

  public getReportsData(parsedJsonArray: any[], queryId?: string): ParsedCSVReportType[] {
    return parsedJsonArray.map(line => this.parseCSVReportLine(line));
  }

  private parseCSVReportLine(line: any): ParsedCSVReportType {
    return {
      property: {
        domain: line[this.fields.domain],
        property_id: this.getProperty(line[this.fields.domain]),
        refs_to_user: null,
        am: null
      },
      inventory: this.getInventory(),
      clicks: 0,
      ad_request: CSVParserHelper.convertToInteger(line[this.fields.requests].replace(',', ''), 10),
      matched_request: CSVParserHelper.convertToInteger(line[this.fields.impressions].replace(',', ''), 10),
      day: this.getDate(line[this.fields.date]),
      ecpm: parseFloat(line[this.fields.cpm]),
      report_origin: this.origin
    }
  }

  protected getProperty(placement: string): string {
    return `${ placement }_eplanning`;
  }

  protected getDate(date: string) {
    const parsedDate = date.split('/');
    return moment(`${parsedDate[2]}-${parsedDate[1]}-${parsedDate[0]}`).format('YYYY-MM-DD');
  }

  protected getInventory(): ReportInventory {
    return {
      sizes: '1x1',
      width: 1,
      height: 1,
      inventory_type: 'banner'
    }
  }
}

module.exports.EPlanning = EPlanning;

