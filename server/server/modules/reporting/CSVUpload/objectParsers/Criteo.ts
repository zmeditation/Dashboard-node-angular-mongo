import moment from 'moment';
import { Fields, FieldsTypeObject } from './fieldMap';
import { ParsedCSVReportType, ReportInventory } from '../../../../database/mongoDB/migrations/reportModel/types';
import CSVParserHelper from '../helpers/index';

class Criteo {

  private fields: FieldsTypeObject = Fields.Criteo;
  private origin: string = 'Criteo';

  constructor() {
  }

  public getReportsData(parsedJsonArray: any[], queryId?: string): ParsedCSVReportType[] {
    return parsedJsonArray.filter(line => line[this.fields.date]).map(line => this.parseCSVReportLine(line));
  }

  private parseCSVReportLine(line: any): ParsedCSVReportType {
    return {
      property: {
        domain: line[this.fields.domain] || '',
        property_id: this.getPropertyId(
          line[this.fields.placement],
          line[this.fields.specific.networkId],
          line[this.fields.specific.zoneName],
          line[this.fields.domain],
          line[this.fields.size]),
        refs_to_user: null,
        am: null
      },
      inventory: this.getInventory('banner', line[this.fields.size]),
      clicks: line[this.fields.clicks],
      ad_request: CSVParserHelper.convertToInteger(line[this.fields.impressions], 10),
      matched_request: CSVParserHelper.convertToInteger(line[this.fields.impressions], 10),
      day: moment(line[this.fields.date], 'MM/DD/YYYY HH:mm:ss', true).format('YYYY-MM-DD'),
      ecpm: parseFloat(line[this.fields.cpm]),
      report_origin: this.origin
    };
  }

  protected getPropertyId(subId: string, networkId: string, zoneName: string, domain: string, sizes: string): string {
    if (subId) {
      return `${networkId}-${subId}`;
    }
    if (zoneName) {
      return `${networkId}-${domain}_${sizes}`;
    }
    return `other`;
  }

  protected getInventory(mediaType: string, size?: string): ReportInventory {
    if (size) {
      return {
        sizes: size,
        width: parseInt(size.split('x')[0]),
        height: parseInt(size.split('x')[1]),
        inventory_type: mediaType
      };
    }

    return {
      sizes: '1x1',
      width: 1,
      height: 1,
      inventory_type: mediaType
    };
  }
}

module.exports.Criteo = Criteo;

