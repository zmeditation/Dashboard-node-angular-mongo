import { Fields, FieldsTypeObject } from "./fieldMap";
import { ParsedCSVReportType } from '../../../../database/mongoDB/migrations/reportModel/types';
import CSVParserHelper from '../helpers/index';
import { getInventory } from '../../../../services/reporting/helperFunctions/getInventory';

class Amazon {

  private fields: FieldsTypeObject = Fields.Amazon;
  private origin: string = 'Amazon';

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
    if (line[this.fields.placement] === 'unknown') {
      return;
    }

    const inventory_sizes = line[this.fields.size];
    const inventory_type = 'banner';

    return {
      property: {
        domain: CSVParserHelper.getURL(line[this.fields.domain]),
        property_id: this.getPropertyID(line[this.fields.placement]),
        refs_to_user: null,
        am: null
      },
      inventory: getInventory({ inventory_sizes, inventory_type }),
      inventory_sizes,
      inventory_type,
      clicks: 0,
      ad_request: CSVParserHelper.convertToInteger(line[this.fields.requests], 10),
      matched_request: CSVParserHelper.convertToInteger(line[this.fields.impressions], 10),
      day: CSVParserHelper.parseDate(line[this.fields.date]),
      ecpm: CSVParserHelper.parseECPM(this.getCPM(line[this.fields.cpm])),
      report_origin: this.origin
    };
  }

  protected getPropertyID(placement: string): string {
    const [propertyId] = placement.split(' ');
    return propertyId;
  }

  protected getCPM(cpm: string): string {
    return cpm.replace('$', '');
  }
}

module.exports.Amazon = Amazon;
