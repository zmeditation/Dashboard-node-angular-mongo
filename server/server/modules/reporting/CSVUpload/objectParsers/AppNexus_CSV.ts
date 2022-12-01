import { Fields, FieldsTypeObject } from "./fieldMap";
import { ParsedCSVReportType } from '../../../../database/mongoDB/migrations/reportModel/types';
import CSVParserHelper from '../helpers/index';
import { getInventory } from '../../../../services/reporting/helperFunctions/getInventory';

class AppNexus_CSV {

  private fields: FieldsTypeObject = Fields.appnexus;
  private origin: string = 'AppNexus';

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
    if (line[this.fields.mediaType] === 'Unknown' || !line[this.fields.mediaType]) {
      return;
    }

    const inventory_sizes = CSVParserHelper.getInventorySize(line[this.fields.size]);
    const inventory_type = CSVParserHelper.getInventoryType(line[this.fields.mediaType]);

    return {
      property: {
        domain: this.getDomain(line[this.fields.placement]),
        property_id: this.getPropertyId(line[this.fields.placement]),
        refs_to_user: null,
        am: null
      },
      inventory: getInventory({ inventory_sizes, inventory_type }),
      clicks: parseInt(line[this.fields.clicks], 10),
      ad_request: CSVParserHelper.convertToInteger(line[this.fields.requests], 10),
      matched_request: CSVParserHelper.convertToInteger(line[this.fields.impressions], 10),
      day: line[this.fields.date],
      ecpm: CSVParserHelper.parseECPM(line[this.fields.cpm]),
      report_origin: this.origin
    };
  }

  protected getDomain(placement: string): string {
    const [domain] = placement.split('_');
    return domain ? CSVParserHelper.getURL(domain) : 'invalid.domain';
  }

  protected getPropertyId(placement: string): string {
    const [propertyId] = placement.split(' ');
    return propertyId;
  }
}

module.exports.AppNexus_CSV = AppNexus_CSV;
