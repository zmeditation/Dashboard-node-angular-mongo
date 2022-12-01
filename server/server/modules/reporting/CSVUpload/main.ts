import axios from 'axios';
import { ReportType } from '../../../database/mongoDB/migrations/reportModel/types';
import moment from 'moment';
const csv = require('csvtojson');
const fs = require('fs');
const { objectParserCollection } = require('./objectParsers/objectParserCollection');
const ReportSaver = require('../../../services/reporting/ReportSaver');

export type NBURates = {
  r030: number,
  txt: string,
  rate: number,
  cc: string,
  exchangedate: string
};

export class CSVUploader extends ReportSaver {
  constructor() {
    super();
  }

  async EURtoUSD(reports: ReportType[]): Promise<ReportType[]> {
    console.log('Start convert EUR to USD')
    const date = moment().format('YYYYMMDD')
    const NBUEndpoint = `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=${ date }&json`;
    const { data } = await axios.get(NBUEndpoint);
    const rates: NBURates[] = data;
    const EURRate = rates.filter(rate => rate.cc === 'EUR')[0];
    const USDRate = rates.filter(rate => rate.cc === 'USD')[0];
    return reports
      .filter(report => report.ecpm !== null)
      .map(report => {
        report.ecpm = parseFloat((report.ecpm * (EURRate.rate / USDRate.rate)).toFixed(2));
        return report;
      })
  }

  async upload(filePath: string, fileOrigin: string, userQuery: boolean, queryId: string) {
    const parserName = fileOrigin !== 'Google Ad Manager Commission'
      ? fileOrigin.split(' ').join('_')
      : 'Google_Ad_Manager';
    const pathToFile: string = filePath;
    const csvParserObject = parserName === 'EPlanning' ? {delimiter: ';'} : {};
    try {
      if (!objectParserCollection[parserName]) {
        throw new Error('NO_PARSER');
      }

      let result;
      const jsonArray = await csv(csvParserObject).fromFile(pathToFile);
      const parser = new objectParserCollection[parserName]();
      let parsedArr: ReportType[] = parser.getReportsData(jsonArray, queryId);

      if (parsedArr.length === 0) {
        throw new Error('EMPTY_FILE');
      }

      if (parserName === 'OneTag') { // convert EUR to USD
        parsedArr = await this.EURtoUSD(parsedArr);
      }

      if (queryId === '11452463613') {
        result = await this.parseCommissionObjects(parsedArr);
      } else {
        result = await this.saveToDataBase(parsedArr);
      }

      await fs.promises.unlink(pathToFile);
      console.log("File has been deleted");
      return result;

    } catch (error) {
      return error;
    }
  }
}
