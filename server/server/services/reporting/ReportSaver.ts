const mongoose = require("mongoose");
const ReportModel = mongoose.model("Reports");
const Domains = mongoose.model("Domains");
const HeaderBiddingService = require("./HeaderBiddingService");
const Properties = mongoose.model("Property");
const cluster = require("cluster");

///////////////////////////////

/* Do not remove this "if" section */
/* It use for for quick updates or check on prod */

if (cluster.isWorker) {

  //addReportsFields('5c9c8c6d256cd737cb73281d');

  const updatePropsAndReports = function (id: any, origin: any, props: any, plcmnt: any, am: any) {
    Domains.find({
        refs_to_user: {
          $in: [id]
        }
      })
      .distinct("domain")
      .then((doms: string[]) => {
        Properties.updateMany({
          refs_to_user: {
            $ne: id
          },
          domain: {
            $in: doms
          },
          property_origin: origin,
          property_id: {
            $in: props
          },
        }, {
          placement_name: plcmnt,
          refs_to_user: id,
        }).then((el: any) => {
          console.log('properties updated', el);

          ReportModel.updateMany({
            "property.domain": {
              $in: doms
            },
            "property.refs_to_user": {
              $ne: id
            },
            "property.property_id": {
              $in: props
            },
            report_origin: origin,
          }, {
            "property.refs_to_user": id,
            "property.am": am,
          }).then((el: any) => console.log('reports updated', el));
        });
      });
  }
}


import { ReportType } from '../../database/mongoDB/migrations/reportModel/types';
import { SaveUniqueUnits } from '../properties/index';

interface ReportSaverInterface {
  saveToDataBase(data: ReportType | ReportType[], hasHB: boolean): void;
}

type PropertyPopulatedType = {
  property_id: string,
  refs_to_user: {
    commission: {
      commission_number: number,
      commission_type: string
    },
    _id: string | object,
    am: string | object
  },
  domain: string,
  property_origin: string,
  placement_name: string,
  unique_string? : string
}

type ListGoogleHBUnits = {
  ids: string[],
  plcmnt: string[]
}

/**
 * @class ReportSaver
 * @implements { ReportSaverInterface }
 */

class ReportSaver extends HeaderBiddingService implements ReportSaverInterface {

  private startCount: number = 0;
  private endCount: number = 0;
  private fullLength: number = 0;

  private dividedReports: Array<ReportType[]> = [];
  private arrayPropsUniqueStrings: string[] = [];

  private HBProgrammaticGoogle: string = 'Google Ad Manager HB';
  private currentProgrammatic: string = '';

  constructor() {
    super();
  }

  /**
   * @param { ReportType | ReportType[] } data
   * @param { boolean } hasHB
   * @returns { Promise<any> }
   */

  public async saveToDataBase(data: ReportType | ReportType[], hasHB = false) {
    if (!data) throw new Error(`saveToDataBase data is ${data}`);

    const allHBConfigs: ListGoogleHBUnits = await this.getAllHBConfigs();

    if (Array.isArray(data)) {
      if (!data.length) throw new Error(`saveToDataBase data is empty, ${data}`);

      const dataLength = data.length;
      const limit = this.findLimitDivider(dataLength);
      return await this.saveMany(data, limit, allHBConfigs);
    }
    return await this.saveOne(data, allHBConfigs);
  };

  /**
   *
   * @param { ReportType } object
   * @param { ListGoogleHBUnits } allHBConfigs
   * @returns { Promise<any> }
   */

  private saveOne(object: ReportType, allHBConfigs: ListGoogleHBUnits): Promise<any> {
    return new Promise(async (resolve, reject) => {
      object.property.domain = this.getDomain(
        object.property.domain,
        object.property.property_id
      );

      const report = new ReportModel(object);
      const properties = await Properties.findOne({
            property_id: object.property.property_id,
            property_origin: object.report_origin,
            domain: object.property.domain,
            refs_to_user: {
              $ne: null
            },
          },
          "property_id refs_to_user domain property_origin placement_name"
        )
        .populate({
          path: "refs_to_user",
          select: "commission _id am",
        })
        .lean()
        .catch((error: any) => {
          reject(error);
        });

      if (properties) {

        let user = properties.refs_to_user;

        if (
          allHBConfigs.ids.includes(user._id.toString()) &&
          allHBConfigs.plcmnt.includes(properties.placement_name) &&
          properties.property_origin !== "Google Ad Manager HB"
        ) {
          console.log("User with HB");
          report.ad_request = 0;
        }

        report.property.placement_name = properties.placement_name;
        report.commission = user.commission;
        report.property.refs_to_user = user._id;
        report.property.am = user.am;
        resolve(report.save());
      } else {
        resolve(report.save());
      }
    });
  }

  /**
   * @param { ReportType[] } data
   * @param { number } limit
   * @param { ListGoogleHBUnits } allHBConfigs
   * @returns { Promise<any> }
   */

  private async saveMany(data: ReportType[], limit: number, allHBConfigs: ListGoogleHBUnits) {
    this.currentProgrammatic = data[0].report_origin;
    this.fullLength = data.length;
    console.log('Total count reports', this.fullLength, 'of', this.currentProgrammatic);
    const countOfChunks = Math.floor(this.fullLength / limit);
    console.log('Chunks length is', countOfChunks)
    let chunk = Math.floor(this.fullLength / countOfChunks);

    this.endCount = chunk + this.startCount;
    this.divideReports(countOfChunks, data, chunk);

    const allConnectedUnits = await this.allConnectedUnits(this.currentProgrammatic);

    const allConnectedUnitsMod = this.addUniqueString(allConnectedUnits);

    return new Promise((resolve, reject) => {
      try {
        this.initParseChunk(this.dividedReports, allConnectedUnitsMod, chunk, allHBConfigs).then((r: string) => {
          console.log(r);
          resolve(r);
        });
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  }

  /**
   *
   * @param { number } count
   * @param { ReportType[] } data
   * @param { number } chunk
   */

  divideReports(count: number, data: ReportType[], chunk: number) {
    let start = this.startCount;
    let end = this.endCount;

    for (let i = 0; i <= count; i++) {
      const chunkedReports = data.slice(start, end);
      if (chunkedReports.length) {
        this.dividedReports.push(chunkedReports);
      }
      start += chunk;
      end += chunk;
    }
  }

  /**
   * @param { number } length
   * @returns { number }
   */

  private findLimitDivider(length: number): number {
    switch (true) {
      case length >= 2000:
        return 2000;
      case length >= 1000 && length < 2000:
        return 1000;
      case length >= 500 && length < 1000:
        return 500;
      default:
        return length;
    }
  }

  private async allConnectedUnits(origin: string): Promise<PropertyPopulatedType[]> {
    return await Properties.find({
        'property_origin': origin,
        'refs_to_user': {
          $ne: null
        }
      }, 'property_id refs_to_user domain property_origin placement_name')
      .populate({
        path: 'refs_to_user',
        select: 'commission _id am'
      }).lean();
  }

  private addUniqueString(units: PropertyPopulatedType[]): PropertyPopulatedType[] {
    return units.map((el: PropertyPopulatedType) => {
      el.unique_string = el.property_id + el.domain;
      if (!this.arrayPropsUniqueStrings.includes(el.unique_string)) {
        this.arrayPropsUniqueStrings.push(el.unique_string);
      }
      return el;
    })
  }

  private async parseChunk(data: ReportType[], allConnectedUnits: PropertyPopulatedType[], chunk: number, allHBConfigs: ListGoogleHBUnits, index: number): Promise<number> {
    console.log(`Start chunk number ${index + 1} parsing...`)
    data.forEach(report => {
      this.changeDomainForHBUnit(report);
    });

    const statusSavedUnits = await SaveUniqueUnits(data, this.currentProgrammatic);
    console.log(statusSavedUnits);

    const reportsForSaving = this.prepareArrayReports(data, allConnectedUnits, allHBConfigs);
    const res = await ReportModel.create(reportsForSaving);
    console.log(`${res.length} reports saved successfully`);
    this.startCount += chunk;
    this.endCount += chunk;
    return res.length;
  }

  private changeDomainForHBUnit(report: ReportType): void {
    const currentDomain = report.property.domain;
    const currentProperty = report.property.property_id;
    report.property.domain = this.getDomain(currentDomain, currentProperty);
  }

  /**
   * @param { PropertyPopulatedType[] } allConnectedUnits
   * @param { ListGoogleHBUnits } allHBConfigs
   * @returns { Promise<any>[] }
   */

  private prepareArrayReports(chunkedReports: ReportType[], allConnectedUnits: PropertyPopulatedType[], allHBConfigs: ListGoogleHBUnits): ReportType[] {
    return chunkedReports.map(report => this.prepareReportToSave(report, allConnectedUnits, allHBConfigs));
  }

  /**
   * @param { ReportType } report
   * @param { PropertyPopulatedType[] } allConnectedUnits
   * @param { ListGoogleHBUnits } allHBConfigs
   */

  private prepareReportToSave(report: ReportType, allConnectedUnits: PropertyPopulatedType[], allHBConfigs: ListGoogleHBUnits): ReportType {
    const reportUniqueString = report.property.property_id + report.property.domain;

    if (this.arrayPropsUniqueStrings.includes(reportUniqueString)) {
      for (let unit of allConnectedUnits) {
        if (unit.unique_string === reportUniqueString) {
          if (
            allHBConfigs.ids.includes(unit.refs_to_user?._id.toString()) &&
            allHBConfigs.plcmnt.includes(unit.placement_name) &&
            unit.property_origin !== this.HBProgrammaticGoogle
          ) {
            report.ad_request = 0;
          }
          report.property.placement_name = unit.placement_name;
          report.property.refs_to_user = unit.refs_to_user?._id;
          report.property.am = unit.refs_to_user?.am;
          report.commission = unit.refs_to_user?.commission;
          continue;
        }
      }
    }
    return report;
  }

  /**
   * @param { Array<ReportType[]> } data
   * @param { Promise<PropertyPopulatedType[]> } allConnectedUnits
   * @param { ListGoogleHBUnits } allHBConfigs
   * @param { number } numberOfReportsInChunk
   */

  private async initParseChunk(
    data: Array<ReportType[]>, 
    allConnectedUnits: PropertyPopulatedType[], 
    numberOfReportsInChunk: number, 
    allHBConfigs: ListGoogleHBUnits): Promise<string> {
    console.log(`All chunks lenght is ${data.length}`);

    for (const [index, curChunk] of data.entries()) {
      await this.parseChunk(curChunk, allConnectedUnits, numberOfReportsInChunk, allHBConfigs, index);
    }

    return `All ${this.fullLength} reports of ${this.currentProgrammatic} was uploaded successfully!`;

    /*     const savePromises = data.map(chunkedReports => {
          return this.parseChunk(chunkedReports, allConnectedUnits, chunk, allHBConfigs);
        }); */
    /*     console.log(`Saved promises length is ${savePromises.length}`);
        for (const [index, promise] of savePromises.entries()) {
          console.log(`Chunk # ${index} starts to parse`);
          await promise
        } */


    /*     return await Promise.all(savePromises).then(result => {
          const sumOfLength = result.reduce((agr, cur) => {
            return agr + cur;
          });
          return `${sumOfLength} reports of ${this.currentProgrammatic} uploaded successful!`;
        }); */
  }
}

module.exports = ReportSaver;