import moment from 'moment';
import { Fields, FieldsTypeObject } from './fieldMap';
import { ParsedCSVReportType, ReportInventory } from '../../../../database/mongoDB/migrations/reportModel/types';
import CSVParserHelper from '../helpers/index';

class OneTag {

  private fields: FieldsTypeObject = Fields.OneTag;
  private origin: string = 'OneTag';

  constructor() {
  }

  public getReportsData(parsedJsonArray: any[], queryId?: string): ParsedCSVReportType[] {
    return parsedJsonArray.filter(line => line[this.fields.date]).map(line => this.parseCSVReportLine(line));
  }

  private parseCSVReportLine(line: any): ParsedCSVReportType {
    return {
      property: {
        domain: line[this.fields.domain] || '',
        property_id: `${line[this.fields.domain]}_OneTag`,
        refs_to_user: null,
        am: null
      },
      inventory: this.getInventory('banner', '1x1'),
      clicks: 0,
      ad_request: CSVParserHelper.convertToInteger(line[this.fields.requests], 10),
      matched_request: CSVParserHelper.convertToInteger(line[this.fields.impressions], 10),
      day: moment(line[this.fields.date], 'DD/MM/YYYY', true).format('YYYY-MM-DD'),
      ecpm: parseFloat(line[this.fields.cpm]),
      report_origin: this.origin
    };
  }

  protected getInventory(mediaType?: string, size?: string): ReportInventory {
    if (size) {
      return {
        sizes: size,
        width: parseInt(size.split('x')[0]),
        height: parseInt(size.split('x')[1]),
        inventory_type: mediaType || 'banner'
      };
    }

    return {
      sizes: '1x1',
      width: 1,
      height: 1,
      inventory_type: mediaType || 'banner'
    };
  }
}

module.exports.OneTag = OneTag;

