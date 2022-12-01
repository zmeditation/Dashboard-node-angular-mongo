import { FileServiceInterface } from '../../../interfaces/interfaces';
import { handleErrors } from '../handleErrors';
import fs from 'fs';


export default class RequiredPaths {

  protected requiredPathsFile = `${__dirname}/requiredPathsArray.json`;

  protected fileService: FileServiceInterface;

  constructor(fileService: FileServiceInterface) {
    this.fileService = fileService;
    this.fileService.setPaths(this.requiredPathsFile);
  }
    
  public async check(): Promise<void> {
    try {
      const requiredPaths: string[] = await this.fileService.readFile();
      
      if (!requiredPaths) {
        const filteredPaths = await this.filterPathsToFile();
        await this.fileService.writeFile(JSON.stringify(filteredPaths));
        await this.iterateByPaths(filteredPaths);
        return;
      }

      await this.iterateByPaths(requiredPaths);
    } catch (error) {
      handleErrors(error, 'RequiredPaths');
    }
  }

  protected async iterateByPaths(requiredPaths: string[]): Promise<void> {    
    for await (let value of this.asyncGenerator(requiredPaths)) {}
  }
  
  private async *asyncGenerator(paths: string[]): AsyncGenerator<any> {
    let index = 0;
    
    while (index < paths.length) {
      const path = paths[index];
      await this.checkPath(`${__dirname}/../../../../../${path}`);

      yield index++;
    }
  }

  protected async checkPath(path: string): Promise<void> {
    try {
      const isExistPath = await this.fileService.isSpecifiedPathExist(path);

      if (!isExistPath) {
        const isFile = this.fileService.isFileType(path);
        const pathType = isFile ? 'file' : 'folder';
        console.error(`----- Need create ${pathType} by path ${path} ----- \n`); 
      }
    } catch (error) {
      handleErrors(error, 'checkPath');
    }
  } 
    
    public async filterPathsToFile(): Promise<any> {
    try {
      const ignoreFilePath = `${__dirname}/../../../../../.gitignore`;
      const ignoreThesePaths = this.getIgnoredPaths();
      const ignoreFileData = await fs.promises.readFile(ignoreFilePath, 'utf8');
        
      const dataIgnore = ignoreFileData.split(/\r\n|\n/);
      
      const filteredPaths = dataIgnore.filter( (stringPath: string) => { 
        return (
          !ignoreThesePaths.includes(stringPath) 
          && stringPath.includes('server') 
          && !stringPath.includes('#')
          && !stringPath.includes('*')
        )
      });
              
      return filteredPaths;
    } catch (error) {
      handleErrors(error, 'filterPathsToFile');
    }
  }

  protected getIgnoredPaths(): string[] {
    return ['server/.env', 'server/.idea', 'server/README.md', 'server/node_modules', 'server/APIintegration/Criteo/importCriteo.json',
    'server/modules/APIintegration/Criteo/importCriteo.json', 'test/user.js', 'server/modules/wbid/services/Auth/token.json',
    'server/modules/wbid/services/Auth/oauth2.keys.json', '/server/modules/wbid/services/Socket/socket.js', 
    'server/services/API/GoogleAdManager/adUnitsFiles/testAdUnitsNames.json', '!server/dist/invoices/test2.png', 
    'server/modules/reporting/config/tokens.json',
    'server/server/services/helperFunctions/RequiredPaths/requiredPathsArray.json',
    '# server/modules/wbid/services/Auth/oauth2.keys.json', 
    '# server/modules/wbid/services/Auth/token.json'];
  }
}
