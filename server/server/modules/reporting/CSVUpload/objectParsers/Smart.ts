import { Fields, FieldsTypeObject } from "./fieldMap";
import { ParsedCSVReportType } from '../../../../database/mongoDB/migrations/reportModel/types';
import CSVParserHelper from '../helpers/index';
import { getInventory } from '../../../../services/reporting/helperFunctions/getInventory';

export type SmartInventoryParams = {
  width: number | string,
  height: number | string,
  name: string
}

class Smart {

  private fields: FieldsTypeObject = Fields.Smart;
  private origin: string = 'Smart';

  constructor() {
  }

  public getReportsData(parsedJsonArray: any[], queryId?: string): ParsedCSVReportType[] {
    return parsedJsonArray
      .map(line => this.parseCSVReportLine(line))
      .filter((el): el is ParsedCSVReportType => { // use Type Guard to prevent TS error
        return el !== undefined; // remove all incorrect objects from array
      });
  }

  protected parseCSVReportLine(line: any, queryId?: string): ParsedCSVReportType | undefined {
    const inventoryWidth = line[this.fields.width];
    const inventoryHeight = line[this.fields.height];
    const inventoryName = line[this.fields.placement];
    const inventoryParams: SmartInventoryParams = {
      width: inventoryWidth,
      height: inventoryHeight,
      name: inventoryName
    }
    const inventory_sizes = this.getSmartInventorySize(inventoryParams);
    const inventory_type = this.getSmartInventoryType(inventoryParams);

    return {
      property: {
        domain: CSVParserHelper.getURL(line[this.fields.domain]),
        property_id: line[this.fields.placement],
        refs_to_user: null,
        am: null
      },
      inventory: getInventory({ inventory_sizes, inventory_type }),
      clicks: 0,
      ad_request: CSVParserHelper.convertToInteger(line[this.fields.requests], 10),
      matched_request: CSVParserHelper.convertToInteger(line[this.fields.impressions], 10),
      day: this.parseSmartDate(line[this.fields.date]),
      ecpm: CSVParserHelper.cutProgrammaticCommission(CSVParserHelper.parseECPM(this.getCPM(line[this.fields.cpm])), 18),
      report_origin: this.origin
    };
  }

  protected getSmartInventorySize(inventoryParams: SmartInventoryParams): string {
    const { width, height, name } = inventoryParams;
    if ((width == 0 && height == 0) && name.search(/stream|roll|rol/i) === -1) {
      return '240x400';
    }
    return `${ width }x${ height }`;
  }

  protected getSmartInventoryType(inventoryParams: SmartInventoryParams) {
    const { width, height, name } = inventoryParams;
    if ((width == 0 && height == 0) && name.search(/stream|roll|rol/i) !== -1) {
      return 'video';
    }
    return 'banner';
  }

  protected getCPM(cpm: string): string {
    return cpm.replace('$', '');
  }

  protected parseSmartDate(date: string): string {
    return date.split('T')[0];
  }
}

module.exports.Smart = Smart;
