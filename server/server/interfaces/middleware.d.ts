export interface MiddlewareContract {
  use(request: any, response: any, next: any): any;
}
