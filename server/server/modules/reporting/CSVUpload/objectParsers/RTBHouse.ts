import { Fields, FieldsTypeObject } from "./fieldMap";
import { ParsedCSVReportType } from '../../../../database/mongoDB/migrations/reportModel/types';
import CSVParserHelper from '../helpers/index';
import { getInventory } from '../../../../services/reporting/helperFunctions/getInventory';

class RTBHouse {

  private fields: FieldsTypeObject = Fields.RTB_House;
  private origin: string = 'RTB House';

  constructor() {
  }

  public getReportsData(parsedJsonArray: any[], queryId?: string): ParsedCSVReportType[] {
    return parsedJsonArray
      .map(line => this.parseCSVReportLine(line))
      .filter((el): el is ParsedCSVReportType => {
        return el !== undefined;
      });
  }

  private parseCSVReportLine(line: any): ParsedCSVReportType | undefined {
    if (!line[this.fields.placement] || line[this.fields.placement] === null) {
      return;
    }

    const inventory_sizes = this.getSize(line[this.fields.size]);
    const inventory_type = this.getRTBInventoryType(line[this.fields.mediaType]);

    return {
      property: {
        domain: line[this.fields.domain] !== '' && line[this.fields.domain] !== null ? CSVParserHelper.getURL(line[this.fields.domain]) : CSVParserHelper.getURL(line['site']),
        property_id: this.getAdUnit(line[this.fields.placement]),
        refs_to_user: null,
        am: null
      },
      inventory: getInventory({ inventory_sizes, inventory_type }),
      clicks: 0,
      ad_request: CSVParserHelper.convertToInteger(line[this.fields.impressions], 10),
      matched_request: CSVParserHelper.convertToInteger(line[this.fields.impressions], 10),
      day: CSVParserHelper.parseDate(line[this.fields.date]),
      ecpm: this.parseRTBeCPM(line[this.fields.impressions], line[this.fields.cpm]),
      report_origin: this.origin
    };
  }

  protected parseRTBeCPM(imp: string, rev: string): number {
    const impressions = parseInt(imp);
    const revenue = Math.round(parseFloat(rev) * 100) / 100;
    return Math.round((revenue / impressions * 1000) * 100) / 100;
  }

  protected getAdUnit(unit: string): string {
    if (unit) {
      let replBegin = unit.replace(/^(www.|http:\/\/|https:\/\/|)/, '');
      let splitSpace = replBegin.split(/\s/g);
      return splitSpace[0].toLowerCase();
    }
    return 'other';
  }

  protected getRTBInventoryType(inventory: string): string {
    return inventory.search(/display/gi) ? 'video' : 'banner';
  }

  protected getSize(size: string): string {
    return size.includes(',Fluid') ? 'Native' : size;
  }
}

module.exports.RTB_House = RTBHouse;
