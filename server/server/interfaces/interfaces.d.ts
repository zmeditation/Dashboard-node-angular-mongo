export interface Objecteble {
  toObject(): any;
}

export type SendReportMessage = {
  event: string,
  trigger: string,
  typeMsg: string,
  text: null | string
};

export type Paths = {
	filePath: string;
	folderPath: string;
}

export declare interface FileServiceInterface {
  setPaths(filePath: string): void
  getPaths(): Paths|never;
  readFile(): Promise<any|boolean|never>;
  readSpecifiedFile(filePath: string): Promise<any>;
  writeFile(writeData: string|Buffer): Promise<undefined|void|never>;
  writeFolder(): Promise<undefined|void|never>;
  writeSpecifiedFolder(folderPath: string): Promise<undefined|void|never>;  
  isFolderPathExist(): Promise<boolean|never>;
  isSpecifiedPathExist(path: string): Promise<boolean|never>;
  isFileType(filePath: string): boolean;
}
