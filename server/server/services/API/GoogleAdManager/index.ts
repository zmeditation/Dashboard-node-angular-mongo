import { Access } from './access.js';
import { toCollectAdUnit } from "./helperFuncForAdManager/helper.js";
import { handleErrors } from "../../helperFunctions/handleErrors.js";
import { FileServiceInterface } from '../../../interfaces/interfaces.js';

// Dfp Can not work with import 
const Dfp = require("node-google-dfp");

type AdUnit = {
    id: string,
    parentId: string,
    hasChildren: boolean,
    parentPath: any[],
    name: string,
    description: string,
    targetWindow: string,
    status: string,
    adUnitCode: string, // same as name
    adUnitSizes: any[],
    isInterstitial: boolean,
    isNative: boolean,
    isFluid: boolean,
    explicitlyTargeted: boolean,
    adSenseSettings: {
      adSenseEnabled: boolean,
      borderColor: string,
      titleColor: string,
      backgroundColor: string,
      textColor: string,
      urlColor: string,
      adType: string,
      borderStyle: string,
      fontFamily: string,
      fontSize: string
    },
    adSenseSettingsSource: string,
    lastModifiedDateTime: {
      date: any,
      hour: number,
      minute: number,
      second: number,
      timeZoneId: String
    },
    smartSizeMode: string,
    isSetTopBoxEnabled: boolean
}

type CreateAdUnitParams = {
    configname: string; 
    size: { 
        width: string, 
        height: string 
    }, 
    targetWindow: string, 
    environmentType: string, 
    isFluid: boolean 
}

type AllAdUnits = {
    parents: string[],
    resultOfAdUnits: AdUnit[],
    error: null|string
}

export default class GoogleAdManagerAPIAdUnit {

    protected filePath = `${__dirname}/adUnitsFiles/adUnitsNames.json`;

    protected statementAdUnits: any;

    protected inventoryService: any;

    protected fileService: FileServiceInterface;

    constructor(fileService: FileServiceInterface) {
      this.fileService = fileService;
      this.fileService.setPaths(this.filePath);
    }

    public async createAdUnit(parameters: CreateAdUnitParams): Promise<never|AdUnit[]> {
        try {
            const { 
                configname, 
                size: { width, height }, 
                targetWindow = 'BLANK', 
                environmentType = 'BROWSER', 
                isFluid 
            } = parameters;

            const isOnlyNumber = (string: string) => {
                return /^\d+$/.test(string)
            };
            if (typeof configname !== 'string' || configname.length < 5) {
                throw new Error('Error, configname is not specified.');
            }
            if (!isFluid) {
                if (!isOnlyNumber(width) && !isOnlyNumber(height)) {
                    throw new Error('Error, incorrect width and height values.');
                }
                if (!isOnlyNumber(width)) {
                    throw new Error('Error, incorrect width value.');
                }
                if (!isOnlyNumber(height)) {
                    throw new Error('Error, incorrect height value.');
                }
            }

            await this.init();
            
            const adUnit = toCollectAdUnit({ configname, width, height, targetWindow, environmentType, isFluid });
            const newUnit = await this.inventoryService.createAdUnits(adUnit)
                .catch((error: any) => {
                    throw {
                        statusCode: error.response.toJSON().statusCode,
                        statusMessage: JSON.stringify(error.body)?.split('message>')[1]
                    };
                });
            
            const adUnitsArray = await this.fileService.readFile() || [];
            adUnitsArray.push(newUnit[0].name);

            const newUnitCollection = JSON.stringify(adUnitsArray);

            await this.fileService.writeFile(newUnitCollection);
                
            return newUnit;
        } catch (error) {
            handleErrors(error, 'createAdUnit', true);            
            throw error;
        }
    }

    public async getAllAdUnits(parentsIds: string | string[] = '111081962'): Promise<AllAdUnits> {
        const parents: string[] = [];
        const resultOfAdUnits = [];

        try {
            let count = 0;

            const existUnits = await this.getAdUnit(parentsIds);

            const { totalResultSetSize, results } = existUnits;
            resultOfAdUnits.push(...results);

            while (count < totalResultSetSize) {
                if (results[count].hasChildren === true) {
                    parents.push(results[count].id);
                }
                ++count;
            }

            if (parents.length) {
                const { parents: Ids, resultOfAdUnits: results, error } = await this.getAllAdUnits(parents);
                if (error) {
                    return { parents, resultOfAdUnits, error };
                }

                parents.length > 0 && parents.push(...Ids);
                resultOfAdUnits.push(...results);
            }

            return {
                parents,
                resultOfAdUnits,
                error: null
            };
        } catch (error) {            
            return { parents, resultOfAdUnits, error: handleErrors(error, 'getAllAdUnits').error.msg }
        }
    }

    public async getAdUnit(parentsIds: string | string[] = '111081962'): Promise<any> {
        const copyParentsIds = JSON.parse(JSON.stringify(parentsIds));
        const stringOfParentsIds = this.stringifyIds(copyParentsIds);

        await this.initStatement(stringOfParentsIds);
        await this.init();

        const units = await this.inventoryService.getAdUnitsByStatement(this.statementAdUnits);

        if (!units.totalResultSetSize && !units.startIndex) {
            throw new Error('Not found children by parentId');
        }
        
        return units;
    }

    protected stringifyIds(parentsIds: string | string[]): string {
        let stringOfParentsIds = '(';

        if (Array.isArray(parentsIds)) {
            parentsIds.forEach((id, i, arr) => {
                if (arr.length - 1 === i) {
                    stringOfParentsIds += id + ')';
                    return;
                }
                stringOfParentsIds += id + ',';
            });
        }
        
        if (typeof parentsIds === 'string') {
            stringOfParentsIds += parentsIds + ')';
        }
        
        return stringOfParentsIds;
    }

    protected async initStatement(parentId = '(111081962)'): Promise<void> {
        this.statementAdUnits = new Dfp.Statement(`WHERE parentId IN ${parentId}`);        
    }

    protected async init(): Promise<void> {
        const ServiceInventory = new Access('InventoryService');
        this.inventoryService = await ServiceInventory.createAccess();        
    }
}
