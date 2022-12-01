import { Fields, FieldsTypeObject } from "./fieldMap";
import { ParsedCSVReportType } from '../../../../database/mongoDB/migrations/reportModel/types';
import { getInventory } from '../../../../services/reporting/helperFunctions/getInventory';
import CSVParserHelper from '../helpers/index';

class Rubicon {

  private fields: FieldsTypeObject = Fields.Rubicon;
  private origin: string = 'Rubicon';

  constructor() {
  }

  public getReportsData(parsedJsonArray: any[], queryId?: string): ParsedCSVReportType[] {
    return parsedJsonArray
      .map(line => this.parseCSVReportLine(line))
      .filter((el): el is ParsedCSVReportType => {
        return el !== undefined;
      });
  }

  protected parseCSVReportLine(line: any, queryId?: string): ParsedCSVReportType | undefined {

    const siteId = line['Site ID'];

    if (siteId === '0') {
      return;
    }

    const inventory_sizes = this.getRubiconInventorySize(line[this.fields.size]);
    const inventory_type = this.getRubiconInventoryType(line[this.fields.mediaType]);

    return {
      property: {
        domain: this.getRubiconURL(line[this.fields.domain], line[this.fields.placement]),
        property_id: `${ this.getRubiconURL(line[this.fields.domain], line[this.fields.placement]) }_${ this.getRubiconInventorySize(line[this.fields.size]) }_${ siteId }`,
        refs_to_user: null,
        am: null
      },
      inventory: getInventory({ inventory_sizes, inventory_type }),
      clicks: 0,
      ad_request: CSVParserHelper.convertToInteger(line[this.fields.requests], 10),
      matched_request: CSVParserHelper.convertToInteger(line[this.fields.impressions], 10),
      day: CSVParserHelper.parseDate(line[this.fields.date]),
      ecpm: CSVParserHelper.cutProgrammaticCommission(CSVParserHelper.parseECPM(line[this.fields.cpm]), 20),
      report_origin: this.origin
    };
  }

  protected getRubiconInventorySize(inventory: string): string {
    if (inventory === '- N/A -') {
      return 'Other';
    }

    if (inventory !== '0') {
      const size = /\((.*?)\)/gm.exec(inventory);
      return !(size) || size[1] === 'Video' ? 'Video/Overlay' : size[1];
    } else {
      return 'Other';
    }
  }

  protected getRubiconInventoryType(inventory: string): string {
    return inventory.toLowerCase() === 'display' ? 'banner' : 'video';
  }

  protected getRubiconURL(url: string, site: string): string {
    const cutUrl = url === '' ? site.split(' ')[0] : url.split(' ')[0];
    return CSVParserHelper.getURL(cutUrl);
  }
}

module.exports.Rubicon = Rubicon;

