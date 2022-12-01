import { Fields, FieldsTypeObject } from "./fieldMap";
import { ParsedCSVReportType } from '../../../../database/mongoDB/migrations/reportModel/types';
import CSVParserHelper from '../helpers/index';
import { getInventory } from '../../../../services/reporting/helperFunctions/getInventory';

class GoogleAdManager {

  private fields: FieldsTypeObject = Fields.GAM;
  private origin: string = 'Google Ad Manager';

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
    if (!line[this.fields.placement] || line[this.fields.placement] === 'Total') {
      return;
    }

    const inventory_sizes = CSVParserHelper.getGoogleSize(line[this.fields.size]);
    const inventory_type = CSVParserHelper.getGoogleInventoryType(line[this.fields.size]);

    return {
      property: {
        domain: CSVParserHelper.getURL(line[this.fields.domain]),
        property_id: CSVParserHelper.getGoogleAdUnit(line[this.fields.placement]) || CSVParserHelper.getGoogleReportName(line[this.fields.domain]),
        refs_to_user: null,
        am: null
      },
      inventory: getInventory({ inventory_sizes, inventory_type }),
      inventory_sizes,
      inventory_type,
      clicks: parseInt(line[this.fields.clicks], 10),
      ad_request: CSVParserHelper.convertToInteger(line[this.fields.requests], 10),
      matched_request: CSVParserHelper.convertToInteger(line[this.fields.impressions], 10),
      day: CSVParserHelper.parseDate(line[this.fields.date]),
      ecpm: CSVParserHelper.parseECPM(line[this.fields.cpm]),
      report_origin: this.origin
    };
  }
}

module.exports.Google_Ad_Manager = GoogleAdManager;
