import { handleErrors } from '../../../../services/helperFunctions/handleErrors';
const { isJson } = require('../../../../services/helperFunctions/stringFunctions');
import { httpsRequest } from '../helperFunctions/httpsRequest';
import { SendReportMessage } from 'interfaces/interfaces';
import { GetPlacementsResponse, PlacementsOptionYandex, Points, RequestExchangeDate } from './types';

export class YandexService {
  readonly hostname = 'www.cbr-xml-daily.ru';

  public sendReportMessage: SendReportMessage = {
    event: 'reports',
    trigger: this.programmatic,
    typeMsg: 'error',
    text: null
  };

  constructor(readonly programmatic: string) {}

  getPrevExchRateUrlPath(endDate: Date | string): Promise<string | void | never> {
    const customText = `${this.programmatic}, error in getPrevExchRateUrlPath`;

    try {
      let minusDay = 0;
      const maxRecursiveCount = 30;

      const recursiveRequestExchange = async (): Promise<string | void> => {
        const path = await this.requestExchange(minusDay, endDate);

        if (path) {
          return path;
        } else if (!path && minusDay < maxRecursiveCount) {
          ++minusDay;
          return recursiveRequestExchange();
        } else {
          throw `Maximum recursive count exceeded ${maxRecursiveCount}`;
        }
      };

      return recursiveRequestExchange();
    } catch (error) {
      throw handleErrors(error, customText).error;
    }
  }

  async requestExchange(minusDay: number, endDate: Date | string): Promise<string | null | never> {
    const customText = `${this.programmatic}, error in requestExchange`;

    try {
      const lastDay = endDate ? endDate : new Date().toLocaleDateString();
      const { year, month, day }: RequestExchangeDate = this.setDate(lastDay, minusDay);
      const options = {
        method: 'GET',
        hostname: this.hostname,
        path: `/archive/${year}/${month}/${day}/daily_json.js`
      };

      return await httpsRequest({ options, customText }).then((response) => {
        return this.requestExchangeHandleResponse(response);
      });
    } catch (error) {
      throw handleErrors(error, customText).error;
    }
  }

  setDate(lastDay: Date | string, minusDay: number): RequestExchangeDate {
    let date = new Date(lastDay);
    date.setDate(date.getDate() - minusDay);

    return {
      year: date.getFullYear(),
      month: date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1,
      day: date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    };
  }

  async requestExchangeHandleResponse(response: string): Promise<string | null | never> {
    const customText = `${this.programmatic}, error in requestExchangeHandleResponse`;

    try {
      if (!isJson(response)) throw 'response is not JSON';

      const parsedResponse: any = JSON.parse(response);
      if (parsedResponse.error && parsedResponse.code == 404) {
        return null;
      }

      const previousUrl = parsedResponse.PreviousURL;
      if (previousUrl) {
        const searchString = '.ru';
        const strIndex = previousUrl.indexOf(searchString) + searchString.length;
        const path = previousUrl.substring(strIndex);

        return path;
      } else {
        console.error('Response not contain PreviousURL');
        return null;
      }
    } catch (error) {
      throw handleErrors(error, customText).error;
    }
  }

  async getCurrentUSDExchRate(path: string): Promise<number | never> {
    const customText = `${this.programmatic}, error in getCurrentUSDExchRate`;

    try {
      if (!path) throw `path is ${path}`;

      const options = {
        method: 'GET',
        hostname: this.hostname,
        path
      };

      return await httpsRequest({ options, customText }).then((response) => {
        return this.getCurrentUSDExchRateHandleResponse(response);
      });
    } catch (error) {
      throw handleErrors(error, customText).error;
    }
  }

  async getCurrentUSDExchRateHandleResponse(response: string): Promise<number | never> {
    try {
      if (isJson(response)) {
        const parsedResponse = JSON.parse(response);
        const usdExchangeForRU = parsedResponse?.Valute?.USD?.Value;
        if (!usdExchangeForRU) throw `usdExchangeForRU is ${usdExchangeForRU}`;

        return usdExchangeForRU;
      } else {
        throw response;
      }
    } catch (error) {
      const customText = `${this.programmatic}, getReportJobStatusHandleResponse response not valid`;
      throw handleErrors(error, customText).error;
    }
  }

  public async getPlacementsRequest(options: PlacementsOptionYandex): Promise<Points[] | never> {
    const customText = `${this.programmatic}, error in getPlacementsRequest`;

    try {
      const response = await httpsRequest({ options, customText });
      return this.getPlacementsHandleResponse(response);
    } catch (error) {
      throw handleErrors(error, customText, false).error;
    }
  }

  public getPlacementsHandleResponse(response: string): Points[] | never {
    try {
      if (isJson(response)) {
        const parsedResponse: GetPlacementsResponse = JSON.parse(response);
        if (!parsedResponse?.data) throw `field data is ${parsedResponse?.data}`;

        const placements: Points[] = parsedResponse?.data?.points;
        if (!placements) throw 'placements not valid';

        return placements;
      } else {
        throw response;
      }
    } catch (error) {
      const customText = `${this.programmatic}, getPlacementsHandleResponse response not valid`;
      throw handleErrors(error, customText, false).error;
    }
  }
}
