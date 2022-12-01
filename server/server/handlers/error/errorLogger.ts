import { ErrorLoggerInterface } from './type';

export class ErrorLogger implements ErrorLoggerInterface {
  error;
  stackList = ['Problem with modules and synchronize, not in project.'];
  stackCount = 0;

  /**
   * @param error supposed to be a generic object enhanced by the JSONAPI specification
   */
  constructor(error: any) {
    this.error = error;
    this.matchFilter();
  }

  logStack() {
    if (this.stackList) {
      this.stackList.forEach(el => {
        console.error(`STACK TO ERROR --> ${ ++this.stackCount }`, el.trim());
      });
    }
  }

  logError() {
    if (process.env.NODE_ENV === 'development') {
      console.log('∨∨∨ !!! DEBUG LOG FROM ERROR HANDLER !!! ∨∨∨');
      console.error(this.error);
      console.log('∧∧∧ !!! DEBUG LOG FROM ERROR HANDLER !!! ∧∧∧');
    }
  }

  private matchFilter() {
    if (this.error.hasOwnProperty('stack')) {
      this.stackList = this.error.stack.match(/.*at.*server\\server\\.*([0-9][0-9]|[0-9]):([0-9][0-9]|[0-9])\)/gi);
    } else {
      this.stackList = ['Error object do not have property "stack".'];
    }
  }
}
