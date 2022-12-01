import { Fields, FieldsTypeObject } from "./fieldMap";
import { ParsedCSVReportType, ReportInventory } from '../../../../database/mongoDB/migrations/reportModel/types';

class Adagio {

  private fields: FieldsTypeObject = Fields.adagio;
  private origin: string = 'Adagio';

  constructor() {
  }

  public getReportsData(parsedJsonArray: any[], queryId?: string): ParsedCSVReportType[] {
    return parsedJsonArray.map(line => this.parseCSVReportLine(line))
      .filter((el): el is ParsedCSVReportType => {
      return el !== undefined;
    });
  }

  private parseCSVReportLine(line: any): ParsedCSVReportType | undefined {

    if(!line[this.fields.domain]) {
      return;
    }

    return {
      property: {
        domain: this.getDomain(line[this.fields.domain]),
        property_id: line[this.fields.placement],
        refs_to_user: null,
        am: null
      },
      inventory: this.getInventory(line[this.fields.mediaType]),
      clicks: 0,
      ad_request: this.parseNumValues(line[this.fields.requests]),
      matched_request: this.parseNumValues(line[this.fields.impressions]),
      day: line[this.fields.date],
      ecpm: this.parseCpm(line[this.fields.cpm]),
      report_origin: this.origin
    };
  }

  private replaceAt (value: string, index: number, replacement: string): string {
    return value.substr(0, index) + replacement + value.substr(index + replacement.length);
  }

  protected getDomain(value: string): string {
    const index = value.lastIndexOf('-');
    return this.replaceAt(value, index, '.');
  }

  protected getInventory(value: string): ReportInventory {
    return {
      sizes: '1x1',
      width: 1,
      height: 1,
      inventory_type: value === 'ban' ? 'banner' : 'video'
    }
  }

  protected parseCpm(cpm: string): number {
    return parseFloat(parseFloat(cpm).toFixed(2));
  }

  protected parseNumValues(val: string): number {
    if (isNaN(parseInt(val, 10)) || !val) {
      return 0;
    } else {
      return parseInt(val, 10);
    }
  }
}

module.exports.Adagio = Adagio;

