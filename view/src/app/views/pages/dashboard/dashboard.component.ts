import { Component, OnDestroy, OnInit } from '@angular/core';
import { egretAnimations } from 'shared/animations/egret-animations';
import { EventCollectorService } from 'shared/services/event-collector/event-collector.service';
import { FilterRequestService } from '../../../wmg_modules/statistics/main-filter/filter-request-services/filter-request.service';
import { QueryResultTableDataBuilderService } from '../../../wmg_modules/statistics/tables/report-table/query-result-table-data-builder.service';
import { Subscription } from 'rxjs';
import { SocketDefault } from 'shared/services/socket.service';
import { Subject } from 'rxjs/Rx';
import { UserInfo } from 'shared/interfaces/common.interface';
import { UpdateChartsValueService } from '../../../wmg_modules/statistics/main-filter/filter-request-services/update-charts-value.service';
import { QueryObject } from "shared/interfaces/reporting.interface";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: egretAnimations
})
export class DashboardComponent implements OnInit, OnDestroy {
  public user: UserInfo;

  public userLoaded = false;

  public dataLoaded = false;

  tableData = {
    columns: [],
    data: []
  };

  totalData = {};

  protected subscriptions: Subscription[] = [];

  reportType: string;

  oRTBType: string;

  typeReportSubj: Subject<string> = new Subject<string>();

  constructor(
    public event: EventCollectorService,
    public filterRequestService: FilterRequestService,
    public queryResultTableDataBuilderService: QueryResultTableDataBuilderService,
    private socket: SocketDefault,
    public UpdateValueService: UpdateChartsValueService
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.UpdateValueService.status().subscribe((status: string) => {
        this.dataLoaded = status === 'loaded';
      })
    );

    this.connectSocket();

    this.subscriptions.push(
      this.event.managedUserInfo$.subscribe((data: UserInfo) => {
        this.user = data;
        this.userLoaded = true;
        if (this.user.oRTBType) {
          this.oRTBType = this.user.oRTBType
        } else {
          this.oRTBType = this.user.adWMGAdapter === true ? 'SSP' : undefined
        }
      })
    );

    this.subscriptions.push(
      this.filterRequestService.query$.subscribe(async (query: QueryObject) => {
        const { tableData, total } = this.queryResultTableDataBuilderService.buildDataTable(
          {
            result: query.tableData.data,
            queryType: query.tableData.data[0].interval,
            total: query.tableData.total,
            filters: undefined,
            type: this.reportType === 'oRTB' ? 'ortb' : undefined,
            oRTBType: this.oRTBType
          }
        );
        this.tableData = tableData;
        this.totalData = total;
      })
    );
  }

  connectSocket() {
    const SocketId = sessionStorage.getItem('socketId');

    if (this.socket.ioSocket.id !== SocketId) {
      this.subscriptions.push(
        this.socket.fromEvent('id').subscribe((data: string) => {
          const storageObj = { socket: data.toString() };
          sessionStorage.setItem('socketId', JSON.stringify(storageObj));
        })
      );
    }
  }

  setReportType(e: string) {
    this.reportType = e;
    this.sendReportType(e);
  }

  sendReportType(reportType: string) {
    this.typeReportSubj.next(reportType);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.typeReportSubj.next();
    this.typeReportSubj.complete();
    this.typeReportSubj.unsubscribe();
  }
}
