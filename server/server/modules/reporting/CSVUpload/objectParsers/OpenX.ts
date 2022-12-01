import moment from 'moment';
import { Fields, FieldsTypeObject } from './fieldMap';
import { ParsedCSVReportType, ReportInventory } from '../../../../database/mongoDB/migrations/reportModel/types';
import CSVParserHelper from '../helpers/index';

class OpenX {

  private fields: FieldsTypeObject = Fields.OpenX;
  private origin: string = 'OpenX';

  constructor() {
  }

  public getReportsData(parsedJsonArray: any[], queryId?: string): ParsedCSVReportType[] {
    return parsedJsonArray.filter(line => line[this.fields.domain]).map(line => this.parseCSVReportLine(line));
  }

  private parseCSVReportLine(line: any): ParsedCSVReportType {
    console.log(line[this.fields.domain]);
    return {
      property: {
        domain: line[this.fields.domain] || '',
        property_id: line[this.fields.placement],
        refs_to_user: null,
        am: null
      },
      inventory: this.getInventory(line[this.fields.mediaType], line[this.fields.size]),
      clicks: parseInt(line[this.fields.clicks]),
      ad_request: CSVParserHelper.convertToInteger(line[this.fields.requests], 10),
      matched_request: CSVParserHelper.convertToInteger(line[this.fields.impressions], 10),
      day: moment(line[this.fields.date]).format('YYYY-MM-DD'),
      ecpm: CSVParserHelper.parseECPM(line[this.fields.cpm]),
      report_origin: this.origin
    };
  }

  /*  protected getDomain(placement: string): string {
      return placement.replace(/(wmgroup.us(\s?-?\s?\s?))|(ROS)/gi, '')
        .split(' ')[0]
        .replace('_', '');
    }*/

/*  protected getProperty(placement: string): string {
    return placement.replace(/(wmgroup.us(\s?-?\s?\s?))|(ROS)/gi, '')
      .replace(/\s/g, '_')
      .trim();
  }*/

  protected getInventory(mediaType?: string, size?: string): ReportInventory {
    if (size) {
      return {
        sizes: size,
        width: parseInt(size.split('x')[0]),
        height: parseInt(size.split('x')[1]),
        inventory_type: mediaType === 'Display' ? 'banner' : 'other'
      };
    }

    return {
      sizes: '1x1',
      width: 1,
      height: 1,
      inventory_type: mediaType === 'Display' ? 'banner' : 'other'
    };
  }
}

module.exports.OpenX = OpenX;

