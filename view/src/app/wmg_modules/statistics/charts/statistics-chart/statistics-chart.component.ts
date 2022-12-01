import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { EventCollectorService } from "shared/services/event-collector/event-collector.service";
import { egretAnimations } from "shared/animations/egret-animations";
import { NgxPermissionsService } from "ngx-permissions";
import { StatisticsChartVariables } from "./services/statistics-chart-variables";
import { Subscription } from "rxjs";
import { SocketDefault } from "shared/services/socket.service";
import { AnalyticsEndpointsService } from '../../../../shared/services/cruds/analytics-endpoints.service';
import { ManagersAnalyticsLastThirtyDays } from './services/managers-analytics-last-thirty-days.service';
import { TAnalyticsData } from '../../../../shared/interfaces/statistic.interface';
import { ManagerRevenueObject } from "shared/types/reports";

@Component({
  selector: "app-statistics-chart",
  templateUrl: "./statistics-chart.component.html",
  styleUrls: ["./statistics-chart.component.scss"],
  animations: egretAnimations
})
export class StatisticsChartComponent
  extends StatisticsChartVariables
  implements OnInit, OnDestroy {

  queryOption: string;

  private subscriptions: Subscription = new Subscription();

  // действия для группирования медиа баеров
  private arrayMediaBuyers: Array<string> = [];

  public lineChartLabels: Array<any> = ["Empty"];

  public accountManagersData;

  public sumRevenue: ManagerRevenueObject[] = [];

  public sumOfEveryDay = [];

  @Input() managersDataBase;

  constructor(
    public event: EventCollectorService,
    public NgxPermissionsS: NgxPermissionsService,
    public analyticChartService: AnalyticsEndpointsService,
    private socket: SocketDefault,
    protected managersAnalyticsLastThirtyDays: ManagersAnalyticsLastThirtyDays
  ) {
    super(NgxPermissionsS);
  }

  ngOnInit() {
    this.managersAnalyticsLastThirtyDays.watchManagersResults();
    this.managersAnalyticsLastThirtyDays.socketConnectAndListen();
    this.permissionsByReports();
    this.socketConnectAndListen();
    this.watchChangeManagersAnalytics();
  }

  socketConnectAndListen() {
    const SocketId = sessionStorage.getItem("socketId");

    if (this.socket.ioSocket.id !== SocketId) {
      const socketIdSub = this.socket
        .fromEvent("id")
        .subscribe((data: string) => {
          const storageObj = { socket: data.toString() };
          sessionStorage.setItem("socketId", JSON.stringify(storageObj));
        });

      this.subscriptions.add(socketIdSub);
    }
  }

  protected watchChangeManagersAnalytics(): void {
    if (!this.byReportsPerm) {
      return;
    }

    const getManagersData = this.managersAnalyticsLastThirtyDays.deliveryManagersAnalytics
      .subscribe((data: TAnalyticsData) => this.setManagersData(data));

    this.subscriptions.add(getManagersData);
  }

  protected setManagersData(data: TAnalyticsData): void {
    this.lineChartSteppedData = [];
    this.sumRevenue = [];
    this.sumOfEveryDay = [];

    // do 30 days analytics from 31
    this.accountManagersData = data.analytics.map(manager => {
      manager.analytics.pop();
      return manager;
    });

    this.updateChartData(this.accountManagersData);
  }

  // need change
  updateChartData(object) {
    this.lineChartLabels = [];
    const labelsArr = [];
    let propName = [];
    let propData = [];
    const tempMediaArrSum = [];
    // Беру даты
    object[0].analytics.forEach((res) => {
      labelsArr.push(res.date.split("-").splice(1, 2).join("."));
    });

    object.forEach((e, i) => {
      let temp = JSON.parse(JSON.stringify(e.analytics));
      let sum = temp.reduce(function (prev, current) {
        prev.revenue = +prev.revenue + +current.revenue;
        return prev;
      });
      if (sum.revenue > 10) {
        propData[i] = [];
        propName.push({ name: e.name, photo: e.photo });
        e.analytics.forEach(({ date, revenue }, j) => {
          propData[i].push(revenue);
        });
      }

    });

    propData = [...propData].filter(el => el !== undefined);
    propData.forEach((arr, i) => {
      const sumOfArray = Math.round(arr.reduce((sum, current) => +sum + +current) * 100) / 100;
      const tempObjManagers: ManagerRevenueObject = {
        account: propName[i],
        revenue: sumOfArray
      };

      // действия для группирования медиа баеров
      if (this.arrayMediaBuyers.includes(propName[i].name)) {
        tempMediaArrSum.push(sumOfArray);
      } else if (!this.arrayMediaBuyers.includes(propName[i].name)) {
        this.sumRevenue.push(tempObjManagers);
      }

      for (const g of arr) {
        if (i === 0) {
          this.sumOfEveryDay.push(+g);
        } else {
          this.sumOfEveryDay.splice(
            arr.indexOf(g),
            1,
            (Math.round(this.sumOfEveryDay[arr.indexOf(g)] + +g) * 100) / 100
          );
        }
      }


    });

    this.sumRevenue.sort((a, b) => {
      if (a.revenue > b.revenue) {
        return -1;
      }
      if (a.revenue < b.revenue) {
        return 1;
      }
    });

    //do not show managers with very low revenue
    this.sumRevenue = this.sumRevenue.filter(val => val.revenue > 10);
    const tempNameArray = this.sumRevenue.map(revenue => revenue.account.name);
    propName = propName.filter(user => {
      if (tempNameArray.includes(user.name)) {
        return user;
      }
    });

    this.chartMethods.updateLineChartData(
      this.lineChartSteppedData,
      this.sumOfEveryDay,
      propData,
      propName,
      this.arrayMediaBuyers
    );
    this.lineChartColors = this.setColors();
    this.lineChartLabels = labelsArr;

    this.updateScaleYAxes(this.lineChartSteppedData.length);
  }

  updateScaleYAxes(length) {
    this.lineChartOptions.scales.yAxes = [];
    for (let i = 0; i < length; i++) {
      const scaleYAxesOption = {
        id: "yAxes_managers",
        display: true,
        stacked: true,
        gridLines: {
          display: true,
          tickMarkLength: 0,
          drawOnChartArea: true,
          lineWidth: 0.1,
          color: "rgba(0, 0, 0, 0)",
          zeroLineColor: "rgba(0,0,0,0.08)"
        },
        ticks: {
          display: true,
          beginAtZero: true,
          suggestedMax: 0.5,
          fontStyle: "regular",
          fontColor: "rgba(25, 25, 77, 0.8)",
          callback: this.callbackFunc
        }
      };
      this.lineChartOptions.scales.yAxes.push(scaleYAxesOption);
    }
  }

  // действия для группирования медиа баеров
  mediaBuyersAggregation(arr) {
    return {
      account: {
        name: "Media buyers",
        photo: undefined
      },
      revenue: arr.length
        ? Math.round(arr.reduce((agr, cur) => agr + cur) * 100) / 100
        : 0
    };
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }

    if (this.socket) {
      this.socket.removeListener("id");
    }

    if (this.managersAnalyticsLastThirtyDays.socket) {
      this.managersAnalyticsLastThirtyDays.socket.removeListener('analytics');
    }

    if (this.managersAnalyticsLastThirtyDays.subscriptions) {
      this.managersAnalyticsLastThirtyDays.subscriptions.unsubscribe();
      this.managersAnalyticsLastThirtyDays.subscriptions.closed = false;
    }

    if (!this.managersAnalyticsLastThirtyDays.runCheckLastUpdate) {
      this.managersAnalyticsLastThirtyDays.runCheckLastUpdate = true;
    }
  }
}
