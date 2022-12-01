import path from 'path';
import fs from 'fs';
import { Paths, FileServiceInterface } from 'interfaces/interfaces';
import { isJson } from './stringFunctions';
const fsPromise = fs.promises;

export class FileService implements FileServiceInterface {
  
	protected filePath: string = '';
	protected folderPath: string = '';

	public setPaths(filePath: string): void {		
		if (typeof filePath !== 'string' || !filePath) {
			console.error(`Not valid filePath, filePath is ${!filePath}`);
			return;
		}
		
		this.filePath = filePath;
		this.folderPath = path.dirname(this.filePath);
	}

	public getPaths(): Paths|never {
			if (!this.filePath) throw new Error(`getPaths, filePath is ${this.filePath}`);
			if (!this.folderPath) throw new Error(`getPaths, folderPath is ${this.folderPath}`);

			return {
				filePath: this.filePath,
				folderPath: this.folderPath
			}
	}
	
  public async readFile(): Promise<any|boolean|never> {
		return await this.readSpecifiedFile(this.filePath);
  }

	public async readSpecifiedFile(filePath: string): Promise<any> {
		if (!this.isFileType(filePath)) {
			throw new Error(`filePath does not have file extension -> ${filePath}`);
		}

    const result = await this.isSpecifiedPathExist(filePath);		
		if (result === false) return result;
		
		const fileData = await fsPromise.readFile(filePath, 'utf8');
							
		return isJson(fileData) ? JSON.parse(fileData) : fileData;
	}

  public async writeFile(writeData: string|Buffer): Promise<undefined|void|never> {
    const isExistFolder = await this.isFolderPathExist();
    !isExistFolder && await this.writeFolder();

    return await this.writeSpecifiedFile(this.filePath, writeData);
		
  }

	public writeSpecifiedFile(filePath: string, writeData: string|Buffer ): Promise<undefined|void|never> {
		if (!this.isFileType(filePath)) {
			throw new Error(`filePath does not have file extension -> ${filePath}`);
		}

		return fsPromise.writeFile(filePath, writeData);
	}

	public async writeFolder(): Promise<undefined|void|never> {
		if (!this.folderPath) throw new Error(`folderPath is ${this.folderPath}`);

		return await this.writeSpecifiedFolder(this.folderPath);
	}

	public async writeSpecifiedFolder(folderPath: string): Promise<undefined|void|never> {
		if (!folderPath) throw new Error(`folderPath is ${folderPath}`);

		return await fsPromise.mkdir(folderPath, { recursive: true });
	}
	
  public async isFolderPathExist(): Promise<boolean|never> {
		if (!this.folderPath) throw new Error(`isFolderPathExist, folderPath is ${this.folderPath}`);

    return this.isSpecifiedPathExist(this.folderPath);
  }

  public async isSpecifiedPathExist(path: string): Promise<boolean|never> {
		if (!path) throw new Error(`isSpecifiedPathExist, path is ${path}`);

		try {
			await fsPromise.access(path);
			return true;
		} catch (error) {
			return false;	
		}
  }

	public isFileType(filePath: string): boolean {
		if (!filePath) throw new Error(`filePath is ${filePath}`);

		const parsedPath = path.extname(filePath);
		return parsedPath ? true : false;
	}

	public deleteFile(): Promise<void> {
		if (!this.filePath) throw new Error(`filePath is ${this.filePath}`);
		return this.deleteBySpecifiedPath(this.filePath);
	}

	public deleteFolder(): Promise<void> {
		if (!this.folderPath) throw new Error(`folderPath is ${this.folderPath}`);

		return this.deleteBySpecifiedPath(this.folderPath);
	}

	public async deleteBySpecifiedPath(path: string): Promise<void> {
		await fsPromise.unlink(path);
	}
}