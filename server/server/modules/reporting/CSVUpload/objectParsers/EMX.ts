import moment from 'moment';
import { Fields, FieldsTypeObject } from "./fieldMap";
import { ParsedCSVReportType, ReportInventory } from '../../../../database/mongoDB/migrations/reportModel/types';
import CSVParserHelper from '../helpers/index';

class EMX {

  private fields: FieldsTypeObject = Fields.EMX;
  private origin: string = 'EMX';

  constructor() {
  }

  public getReportsData(parsedJsonArray: any[], queryId?: string): ParsedCSVReportType[] {
    return parsedJsonArray.map(line => this.parseCSVReportLine(line));
  }

  private parseCSVReportLine(line: any): ParsedCSVReportType {
    return {
      property: {
        domain: line[this.fields.domain],
        property_id: this.getProperty(line[this.fields.placement]),
        refs_to_user: null,
        am: null
      },
      inventory: this.getInventory(line[this.fields.placement]),
      clicks: 0,
      ad_request: CSVParserHelper.convertToInteger(line[this.fields.requests].replace(',', ''), 10),
      matched_request: CSVParserHelper.convertToInteger(line[this.fields.requests].replace(',', ''), 10),
      day: moment.utc(line[this.fields.date]).toISOString(),
      ecpm: parseFloat(line[this.fields.cpm]),
      report_origin: this.origin
    };
  }

/*  protected getDomain(placement: string): string {
    return placement.replace(/(wmgroup.us(\s?-?\s?\s?))|(ROS)/gi, '')
      .split(' ')[0]
      .replace('_', '');
  }*/

  protected getProperty(placement: string): string {
    return placement.replace(/(wmgroup.us(\s?-?\s?\s?))|(ROS)/gi, '')
      .replace(/\s/g, '_')
      .trim();
  }

  protected getInventory(placement: string): ReportInventory {
    const size = placement.match(/\d+x\d+/);
    return size !== null
      ? {
        sizes: size[0],
        width: parseInt(size[0].split('x')[0]),
        height: parseInt(size[0].split('x')[1]),
        inventory_type: 'banner'
      }
      : {
        sizes: '1x1',
        width: 1,
        height: 1,
        inventory_type: 'banner'
      };
  }
}

module.exports.EMX = EMX;

