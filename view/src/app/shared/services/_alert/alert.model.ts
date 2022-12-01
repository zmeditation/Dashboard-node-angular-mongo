export enum AlertType {
  Success,
  Error,
  Info,
  Warning
}

export class Alert {
  type: AlertType;

  message: string;

  alertId: string;

  keepAfterRouteChange: boolean;

  constructor(init?: Partial<Alert>) {
    Object.assign(this, init);
  }
}


