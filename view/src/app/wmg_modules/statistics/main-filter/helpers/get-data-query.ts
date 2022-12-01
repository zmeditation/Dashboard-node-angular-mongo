import { FilterRequestService } from "../filter-request-services/filter-request.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MenuData } from "./menu-data";
import { NgxPermissionsService } from "ngx-permissions";
import { UpdateChartsValueService } from '../filter-request-services/update-charts-value.service';

export class GetDataQuery extends MenuData {
  constructor(
    public filterRequestService: FilterRequestService,
    public snackBar: MatSnackBar,
    public NgxPermissionsS: NgxPermissionsService,
    public UpdateValueService: UpdateChartsValueService
  ) {
    super(NgxPermissionsS);
  }

  getData(params, typeOfReport?: string) {
    this.UpdateValueService.emit('requested');
    this.filterRequestService.getDataCharts(params, typeOfReport).subscribe(
      (data) => {
        this.UpdateValueService.emit('loaded');
        if (data) {
          const { filterResult, total } = data;
          const placeholderResp = {
            chartData: [
              {
                date: '',
                interval: params.request.interval,
                metrics: {
                  cpm: 0,
                  revenue: 0,
                  impressions: 0,
                  fillrate: 0,
                  requests: 0
                },
                dimensions: {}
              }
            ],
            tableData: {
              data: [
                {
                  date: '',
                  interval: params.request.interval,
                  metrics: {
                    cpm: 0,
                    revenue: 0,
                    impressions: 0,
                    fillrate: 0,
                    requests: 0
                  },
                  dimensions: {}
                }
              ],
              total: {
                cpm: 0,
                revenue: 0,
                impressions: 0,
                fillrate: 0,
                requests: 0
              }
            }
          };
          if (filterResult && filterResult.length === 0) {
            this.openSnackBar('No Data for This Period', '');
            this.filterRequestService.sendQuery(placeholderResp);
            return;
          }
          placeholderResp.chartData = filterResult;
          placeholderResp.tableData.data = filterResult;
          placeholderResp.tableData.total = total;
          if (typeOfReport && typeOfReport === 'oRTB') {
            placeholderResp.chartData = placeholderResp.chartData.map((res) => {
              res.interval = params.request.interval;
              return res;
            });
          }
          this.filterRequestService.sendQuery(placeholderResp);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000
    });
  }
}
