const fs = require('fs');
const { handleErrors } = require('./handleErrors');

const helperToReadFile = (path) => {
    const errorMsg = { error: { msg: 'Error read file.', path }};

    return new Promise ( (resolve, reject) => {
        fs.exists(path, exists => {
            if (!exists) {
                reject({ error: { msg: `Not found file by path: -> ${path}`}})
            } else {

                fs.open(path, 'r', (err, fd) => {
                    if (err) { reject(errorMsg) }

                    fs.readFile(fd, 'utf8', (err, data) => {
                        if (err) reject(err);
                        resolve({ data, error: null })

                        fs.fstat(fd, (err, stats) => {
                            if (err) reject(errorMsg);

                            fs.close(fd, (err) => {
                                if (err) reject(errorMsg);
                            });
                        })
                    });
                });
            }
        });
    } );
}

const helperToWriteFile = (path, data) => {
    const errorMsg = { error: { msg: 'Error write file.', path}};

    return new Promise ( (resolve, reject) => {

        fs.open(path, 'w', (err, fd) => {
            if (err) reject(errorMsg);

            fs.writeFile(fd, data, 'utf8', (err) => {
                if (err) reject(errorMsg);
                resolve({ success: true, error: null, data })

                fs.fstat(fd, (err, stats) => {
                    if (err) reject(errorMsg);

                    fs.close(fd, (err) => {
                        if (err) reject(errorMsg);
                    });
                })
            });
        });
    })
    .catch( er => {
        console.dir(er);
        return errorMsg;
    });
}

const writeFile = (params) => {
    return new Promise((resolve, reject) => {
        try {
            const { path, writeData } = params;
            if (!path) throw { msg: `path is ${path}` }
            if (!writeData) throw { msg: `writeData is ${writeData}` }

            fs.writeFile(path, writeData, (err) => {
                if (err) throw err;
                console.log(`File ${path} was saved.`);
                resolve({ success: true });
            });
        } catch (error) {
            reject(handleErrors(error, 'writeFile').error);
        }
    });
}

const isExistDirOrFile = async(path) => {
    try {
        const arrayPath = path.split('/' || '\\');
        const maybeFile = arrayPath.splice(-1, 1);
        const folderPath = arrayPath.join('//');
        const validFile = maybeFile[0].includes('*');
        const whatCreatedInfo = [];

        const ar = ['.json', '.js', '.txt', '.ts'];
        const isFile = ar.some(el => maybeFile[0].includes(el));

        const isExistFolder = await isExist(folderPath);
        if (isExistFolder === false) {
            const { success: workSuc, error: workEr } = await workWithDirectives(folderPath, createFolder)
            (workSuc === true && workEr === null) && whatCreatedInfo.push({created: 'folder', path: folderPath});
        }

        const isExistFile = await isExist(path);
        if (isFile && !validFile && isExistFile === false) {

            const { success: workSuc, error: workEr } = await workWithDirectives(path, createFile);
            (workSuc === true && workEr === null) && whatCreatedInfo.push({created: 'file', path});

        } else if (!isFile && !validFile && isExistFile === false) {

            const { success: workSuc, error: workEr } = await workWithDirectives(path, createFolder);
            (workSuc === true && workEr === null) && whatCreatedInfo.push({created: 'folder', path: folderPath});
        }

        return { whatCreatedInfo, error: null };
    } catch (error) {
        const errorMsg = error && error.msg ? error :
            { error: { msg: 'Error in detection of directory or file.', path}};

        console.log(errorMsg);
        return errorMsg;
    }
}

const createFolder = (path) => {
    const errorMsg = { error: { msg: 'Error to create folder', path}};

     return new Promise((resolve, reject) => {
        fs.mkdir(path, { recursive: true }, (err) => {

        if (err) reject(errorMsg);
            resolve({ success: true, error: null });
        });
     })
}

const createFile = async(path) => {
   return new Promise((resolve, reject) => {

        fs.open(path, 'w', (err, f) => {

            if ( err && Object.getOwnPropertyNames(err).includes('code') && err.code == 'ENOENT' ) {

                reject({ error: { msg: 'Error, not exist file path.', path}});

            } else if (err) { reject({ error: { msg: 'Error to create file.'}})}

            resolve({ success: true, error: null });
        });
   })
}

const isExist = async(path) => {
   return fs.existsSync(path);
}

const workWithDirectives = (path, func) => {
   return new Promise((resolve, reject) => {

        isExist(path).then( res => {
            if(res === false) {

                func(path)
                    .then(result => resolve(result))
                    .catch( err => {

                        if (err.code === 'ENOENT') {
                            reject({ error: { msg: 'Error, not exist directory.', path}});
                        }
                        reject({ error: { msg: 'Error, work with directory.'}});
                    });

            } else if (res === true) { resolve({error: null}) }
        })
        .catch(err => reject(err));
    });
}

module.exports = {
    writeFile,
    helperToWriteFile,
    isExistDirOrFile,
    isExist,
    helperToReadFile,
    createFile,
    createFolder
}
