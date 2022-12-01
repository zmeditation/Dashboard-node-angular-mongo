import { UserPermissions } from 'shared/services/user-permissions';
import { NgxPermissionsService } from 'ngx-permissions';
import { Period, PeriodName, QueryType, SortingOptions } from "shared/interfaces/reporting.interface";

export class MenuData extends UserPermissions {
  days: Period[] = [
    {
      periodName: 'Yesterday',
      value: PeriodName.yesterday
    },
    {
      periodName: 'Last 3 Days',
      value: PeriodName.lastThreeDays
    },
    {
      periodName: 'Last 7 Days',
      value: PeriodName.lastSevenDays
    },
    {
      periodName: 'Last 60 Days',
      value: PeriodName.lastSixtyDays
    },
    {
      periodName: 'Month to Yesterday',
      value: PeriodName.monthToYesterday
    },
    {
      periodName: 'Last Month',
      value: PeriodName.lastMonth
    }
  ];

  options: SortingOptions[] = [
    {
      optionName: 'BY_REVENUE',
      value: 'revenue'
    },
    {
      optionName: 'BY_CPM',
      value: 'averageCPM'
    },
    {
      optionName: 'BY_IMPRESSIONS',
      value: 'totalImpressions'
    }
  ];

  queryType: QueryType[] = [
    {
      optionName: 'DAILY',
      value: 'daily'
    },
    {
      optionName: 'TOTAL',
      value: 'total'
    }
  ];

  constructor(public NgxPermissionsS: NgxPermissionsService) {
    super(NgxPermissionsS);
  }
}
