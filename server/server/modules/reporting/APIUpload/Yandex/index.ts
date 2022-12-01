const ReportSaver = require('../../../../services/reporting/ReportSaver');
import moment from 'moment';
import { PlacementsOptionYandex, Points, PreparePlacementsParams, YandexParams } from './types';
import { YandexService } from './service';
import { ReportServerContract } from '../interfaces';
const { handleErrors } = require('../../../../services/helperFunctions/handleErrors');
const { checkResponseOnError } = require('../../../../handlers/checkResponseOnError');
const { getInventory } = require('../../../../services/reporting/helperFunctions/getInventory');
const { reportDates, getYesterdayDate } = require('../../../../services/helperFunctions/dateFunctions');
const sendReport = require('../../../../services/reporting/UploadAPIReports/helperFunctions/sendReport');

class YandexAPI extends ReportSaver implements ReportServerContract {
  readonly programmatic = 'Yandex';
  protected token = '';

  constructor(protected params: YandexParams) {
    super();
    this.setParams(params);
    this.yandexService = new YandexService(this.programmatic);
  }

  setParams(params: YandexParams): void | never {
    this.token = params?.token;
  }

  async start(startDate: Date | string, endDate: Date | string): Promise<any> {
    try {
      const period: string = this.createPeriod(startDate, endDate);
      this.yandexService.sendReportMessage.text = this.getTextDate(startDate, endDate);

      const previousExchangeRateUrlPath = await this.yandexService.getPrevExchRateUrlPath(endDate);
      const usdExchangeRate = await this.yandexService.getCurrentUSDExchRate(previousExchangeRateUrlPath);
      const placementsOptions = this.getPlacementsOptions(period);
      const placements = await this.getPlacements(placementsOptions);

      const reports = await this.preparePlacementsSave({ placements, usdExchangeRate });
      if (!reports.length) throw (this.yandexService.sendReportMessage.typeMsg = 'noData');

      return { uploaded: true };
    } catch (error) {
      handleErrors(error, this.programmatic);
      checkResponseOnError({ error, customText: this.programmatic }).catch(() => {
        sendReport({ message: this.yandexService.sendReportMessage });
      });
    }
  }

  createPeriod(startDate: Date | string, endDate: Date | string): string {
    let period = `period=yesterday`;

    if (startDate && endDate) {
      startDate = moment(startDate).format('YYYY-MM-DD');
      endDate = moment(endDate).format('YYYY-MM-DD');

      // Custom Dates are supplied by the &period=CUSTOM_DATE&period=CUSTOM_DATE query parameters
      period =
        moment(startDate).unix() > moment(endDate).unix()
          ? `period=${endDate}&period=${startDate}`
          : `period=${startDate}&period=${endDate}`;
    }

    return period;
  }

  getTextDate(startDate: Date | string, endDate: Date | string): string {
    const yesterday = startDate && endDate ? null : getYesterdayDate().stringDateYesterday;
    return yesterday || reportDates(startDate, endDate).textDate;
  }

  getPlacementsOptions(period: string): PlacementsOptionYandex[] {
    if (!this.token) throw new Error(`this.token is ${this.token}`);

    const hostname = 'partner2.yandex.ru';
    const method = 'GET';
    const adventName = 'advnet_context_on_site_rtb';
    const videoName = 'video_an_site_inpage';

    return [
      {
        method,
        hostname,
        path: `/api/statistics2/get.json?oauth_token=${ this.token }&lang=ru&pretty=1&level=${ adventName }&dimension_field=date|day&entity_field=domain&entity_field=block_type&entity_field=block_caption&${ period }&field=hits&field=shows&field=partner_wo_nds&field=clicks_direct&`
      }
    ];
  }

  protected async getPlacements(optionsArray: PlacementsOptionYandex[]): Promise<Points[] | void | never> {
    try {
      if (!Array.isArray(optionsArray)) throw 'optionsArray is not array';
      if (!optionsArray.length) throw 'optionsArray is empty';

      const iterator = this.placementsIterator(optionsArray);

      for await (let value of iterator) {
        if (value.done && value.placementsArr) {
          return value.placementsArr;
        }
      }
    } catch (error) {
      const customText = `${this.programmatic}, error in getPlacements`;
      throw handleErrors(error, customText).error;
    }
  }

  protected placementsIterator(optionsArray: PlacementsOptionYandex[]): any | never {
    try {
      const placementsArr: Points[] = [];

      return {
        from: 0,
        to: optionsArray.length,
        funcData: optionsArray,
        runFunc: this.yandexService.getPlacementsRequest.bind(this.yandexService),

        [Symbol.asyncIterator]() {
          return {
            current: this.from,
            last: this.to,
            asyncFunc: this.runFunc,
            dataForFunc: this.funcData,

            async next() {
              const placement = await this.asyncFunc(this.dataForFunc[this.current]);
              placementsArr.push(...placement);
              ++this.current;

              if (this.current <= this.last) {
                return {
                  done: false,
                  value: this.current === this.last ? { done: true, placementsArr } : { done: false }
                };
              }

              return { done: true };
            }
          };
        }
      };
    } catch (error) {
      const customText = 'placementsIterator';
      throw handleErrors(error, customText).error;
    }
  }

  // Must be to rewrite
  async preparePlacementsSave(params: PreparePlacementsParams) {
    const { placements, usdExchangeRate } = params;
    const objectsToUpload = [];

    if (placements !== undefined) {
      objectsToUpload.push(
        placements.map((placement: any) => {
          return this.prepareObject(placement, usdExchangeRate);
        })
      );
    } else {
      objectsToUpload.push([]);
    }

    if (objectsToUpload[1]) {
      for (const obj of objectsToUpload[1]) {
        objectsToUpload[0].push(obj);
      }
    }

    const resultArray = objectsToUpload[0];

    return await this.saveToDataBase(resultArray, true);
  }

  prepareObject(placement: any, exchangeRate: number) {
    const checkForTypeReport = placement.type_label ? placement.type_label : placement.dimensions.block_type;
    const inventory_sizes = checkForTypeReport === 'Inpage' ? placement.type_label : placement.dimensions.block_type;
    const inventory_type = checkForTypeReport === 'modernAdaptive' || checkForTypeReport === 'Inpage' ? checkForTypeReport : 'banner';

    return {
      property: {
        domain: placement.dimensions.domain,
        property_id: placement.dimensions.block_caption,
        refs_to_user: null,
        am: null
      },
      inventory: getInventory({ inventory_sizes, inventory_type }),
      clicks: checkForTypeReport === 'Inpage' ? placement.inpage_block_direct_clicks : placement.measures[0].clicks_direct,
      ad_request: checkForTypeReport === 'Inpage' ? placement.inpage_block_hits : placement.measures[0].hits,
      matched_request: checkForTypeReport === 'Inpage' ? placement.inpage_block_shows : placement.measures[0].shows,
      day: this.parseDay(placement.dimensions.date),
      ecpm:
        checkForTypeReport === 'Inpage'
          ? this.getCPM(placement.inpage_partner_wo_nds, placement.inpage_block_shows, exchangeRate, placement.inpage_block_hits)
          : this.getCPM(placement.measures[0].partner_wo_nds, placement.measures[0].shows, exchangeRate, placement.measures[0].hits),
      report_origin: this.programmatic
    };
  }

  getCPM(revenue: number, impressions: number, exchangeRate: number, requests: number): number {
    const revenueInUSD = revenue / exchangeRate;
    if (revenueInUSD === 0) return 0;
    let cpm;
    if (impressions !== 0) {
      cpm = (revenueInUSD / impressions || 1) * 1000;
    } else { // if Yandex send impressions = 0
      cpm = (revenueInUSD / requests || 1) * 1000;
    }
    return parseFloat(cpm.toFixed(2));
  }

  parseDay(day: string[]): string {
    return day[0];
  }
}

exports.YandexAPI = YandexAPI;
