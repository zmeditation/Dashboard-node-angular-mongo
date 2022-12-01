import { getInventory } from "services/reporting/helperFunctions/getInventory";

type ReportProperty = {
  domain: Lowercase<string>,
  property_id: string,
  placement_name: string,
  refs_to_user: string | object | null,
  am: string | object | null
};

type ParsedCSVPropertyType = {
  domain: string,
  property_id: string,
  refs_to_user: null,
  am: null
};

type ReportCommission = {
  commission_number: number,
  commission_type: string
};

type ReportPartnerCommission = {
  total_code_served_count: number,
  ad_exchange_impressions: number,
  commission_number: number,
  commission_type: string,
  commission_result: number
};

type ReportInventory = {
  sizes: string,
  width: number,
  height: number,
  inventory_type: string
};

export type ParsedCSVReportType = {
  property: ParsedCSVPropertyType,
  inventory: ReportInventory,
  clicks: number,
  inventory_sizes?: string,
  inventory_type?: string,
  ad_request: number,
  matched_request: number,
  day: string,
  ecpm: number,
  report_origin: string
}

export type ReportType = {
  property: ReportProperty,
  commission?: ReportCommission,
  partners_commission?: {
    google: ReportPartnerCommission
  },
  day: Date | string,
  inventory_sizes: string,
  inventory_type: string,
  inventory: ReportInventory,
  ad_request: number,
  matched_request: number,
  clicks: number,
  ecpm: number,
  report_origin: string,
  uploaded_by?: string | object | null
};
