import { Subscription, Subject } from 'rxjs';
import { SocketDefault } from '../services/socket.service';

export type GeneralStatistic = {
  _id: string;
  totalRequests: number;
  totalImpressions: number;
  averageCPM: string;
  revenue: string;
}

export type MonthlyStatistic = {
  currentMonth: GeneralStatistic;
  previousMonth: GeneralStatistic;
}

export type PubAndDedStatistic = {
  name: string;
  sumOfDeduction: number;
  date?: {
    fromDate: Date;
    toDate: Date;
  };
}

export type SuccessResDedStatistic = {
  error: null;
  publisherDeductions: PubAndDedStatistic[];
  success: boolean;
}

export type UnSuccessResDedStatistic = {
  success: boolean;
  msg: string;
}

export type TAnalytics = {
  date: string;
  revenue: number;
}

export type TUserAnalytics = {
  _id: string;
  name: string;
  create_at: Date;
  analytics: TAnalytics[]
}

export type TAnalyticsData = {
  success: boolean;
  msg: string;
  analytics: TUserAnalytics[];
  last_update: number;
}

export type TPublishersRevenueSorted = {
  name: string;
  revenue: number;
}

export interface PublishersAnalyticInterface {
  subscriptions: Subscription;
  deliveryPubsAnalytics: Subject<TAnalyticsData>;
  socket: SocketDefault;
  runCheckLastUpdate: boolean;
  watchPubsResults(): void;
  socketConnectAndListen(): void;
}

export type TPublishersCountByMonth = {
  month: string;
  created: {
    count: number,
    publisherNames: string[]
  };
  earned: {
    count: number,
    publisherNames: string[]
  };
}

export type ConnectionAnalyticObject = {
  count: number,
  publisherNames: string[]
}

export type ConnectionOpenDialogData = {
  header: number,
  publisherNames: string[]
}

export type TPublishersConnectionAnalytics = {
  created: ConnectionAnalyticObject;
  earned: ConnectionAnalyticObject;
}

export type TPublishersStatisticsMonths = {
  Jan: TPublishersConnectionAnalytics;
  Feb: TPublishersConnectionAnalytics;
  Mar: TPublishersConnectionAnalytics;
  Apr: TPublishersConnectionAnalytics;
  May: TPublishersConnectionAnalytics;
  Jun: TPublishersConnectionAnalytics;
  Jul: TPublishersConnectionAnalytics;
  Aug: TPublishersConnectionAnalytics;
  Sep: TPublishersConnectionAnalytics;
  Oct: TPublishersConnectionAnalytics;
  Nov: TPublishersConnectionAnalytics;
  Dec: TPublishersConnectionAnalytics;
}

export type TPublishersConnectionStatistics = {
  publishersCountByMonth: TPublishersStatisticsMonths
}
