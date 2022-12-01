import GetFilterValues from '../../reporting/GetFilterValues/GetFilterValues';
import http, { Agent } from 'http';
import { handleErrors } from '../../helperFunctions/handleErrors';
import { ObjectId } from 'mongoose';
import { FileService } from '../../../services/helperFunctions/FileService';
import { REPORT_FILTERS } from '../../../constants/reportFilters';

type CheckDomainsParams = {
  body: {
    additional: {
      permission: string, id: string
    }
  },
  filterId: string
}

// Any type in each fields for avoid error;

type ReportsFiltered = {
  success: boolean | any,
  name: undefined | string | any,
  results: Reports[] | any,
}

type Reports = {
  _id: ObjectId | string;
  name: string;
  am: ObjectId | string;
  domains: Domain;
  enabled: Enabled;
}

type Domain = {
  domain: string;
  origins: string[]
}

type Enabled = {
  changed: boolean;
  status: boolean;
}

type ReceiveDomains = {
  options: http.ClientRequestArgs,
  reportsForCheck: string
}

type SocketMessage = {
  message: {
    message: string,
    last: boolean,
    event: string
  }
  eventHandler: string;
}

// Flag for Update, important.
class DomainsUpdatingState {
  private updating = false;

  public getState() {
    return this.updating;
  }

  public setState(state: boolean): void {
    this.updating = state;
  }
}

const domainsUpdatingState = new DomainsUpdatingState();


// this class is for requesting by POST list of domains and origins for receiving response with object of checked domains
export class CheckedDomains {

  protected settings: CheckDomainsParams = {
    body: { additional: { permission: 'canReadAllReports', id: 'onlyForAdstxtMonitoring_ID' } },
    filterId: REPORT_FILTERS.FOR_ADS_TXT
  };

  protected pathToFile = '';

  protected fileService = new FileService();

  constructor(
    pathToFile: string
  ) {
    this.pathToFile = pathToFile;
    this.fileService.setPaths(pathToFile);
  }

  public async update(userId: string): Promise<void> {
    try {
      domainsUpdatingState.setState(true);
      this.sendMessageBySocket('UPDATING');

      const reports: ReportsFiltered = await new GetFilterValues(this.settings).execute(this.settings);

      const reportsForCheck: string = JSON.stringify({ results: reports.results });
      const receiveDomainsParams: ReceiveDomains = this.createReceiveDomainsParams(reportsForCheck);      
      const joinedResponse = await this.receiveDomains(receiveDomainsParams);

      const writeFileParams = this.getWriteFileParams(joinedResponse, userId);
      await this.fileService.writeFile(writeFileParams);
      console.log(`File ${this.pathToFile} was successful written`);

      this.sendMessageBySocket('UPDATED_DATA');
      domainsUpdatingState.setState(false);
    } catch (error) {
      throw handleErrors(error, 'CheckedDomains').error;
    }
  }

  protected createReceiveDomainsParams(reportsForCheck: string): ReceiveDomains {
    const httpAgent: Agent = new http.Agent({
      maxFreeSockets: 10,
      maxSockets: 100,
      timeout: 60000,
      keepAlive: true
    });
    const options: http.ClientRequestArgs = {
      host: "199.247.0.74",
      port: 4444,
      path: "/checkDomains",
      method: "POST",
      agent: httpAgent,
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(reportsForCheck)
      }
    };

    return {
      options, reportsForCheck
    }
  }

  protected receiveDomains(params: ReceiveDomains): Promise<string|any> {
    return new Promise((resolve, reject) => {
      try {
        const { options, reportsForCheck } = params;
        console.log('start - ads.txt request');

        const responseArray: Buffer[]  = [];
        const req = http.request(options, (res: any) => {
          console.log(`STATUS: ${res.statusCode}`);

          res.on('data', (chunk: Buffer) => {
            responseArray.push(chunk);
          });

          res.on("end", () => {
            const joinedResponse = responseArray.join('');
            resolve(joinedResponse);
          });
        });

        req.on("error", error => { throw error });

        req.write(reportsForCheck);
        req.end();
      } catch (error) {
        reject(handleErrors(error, 'sendMessageBySocket').error);
      }
    });
  }

  protected getWriteFileParams(joinedResponse: string, userId: string): string {
    const lastUpdate: number = new Date().getTime();
    const domainsData = JSON.parse(joinedResponse);
    domainsData.lastUpdate = lastUpdate;
    domainsData.userWhoUpdated = userId;
    !domainsData.results && (domainsData.results = [])

    return JSON.stringify(domainsData);
  }

  public stateUpdating(): boolean {
    return domainsUpdatingState.getState(); 
  }

  // Send Message by socket to front that file was edited
  protected sendMessageBySocket(messageText: string): void {
    try {
      const message: SocketMessage = {
        message: {
          message: messageText,
          last: true,
          event: 'ads.txt',
        },
        eventHandler: 'push_to_all'
      }

      process?.send && (<any> process).send(message);
    } catch (error) {
      throw handleErrors(error, 'sendMessageBySocket').error;
    }
  }
}
