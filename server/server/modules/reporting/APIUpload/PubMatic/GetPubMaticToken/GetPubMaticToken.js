
const fs = require('fs');
const request = require( 'request' );
const pubMaticData = require('./PubMaticData');
const { PUBMATIC_API_TOKEN } = require('../../config/tokens.json')

class GetPubMaticToken {

    constructor() {}
    
    async changePubMaticData() {
        try {
            const newDate = await this.newDate(pubMaticData.createdAt);
            if (!newDate) return;

            const { accessToken, refreshToken, error: refreshError } = await this.newToken(pubMaticData, PUBMATIC_API_TOKEN);
            if (!accessToken || !refreshToken) { throw { error: { msg: `Error to refresh token of PubMatic. ${refreshError}`}}}

            await this.overWritePubMaticData(newDate, refreshToken, pubMaticData.userEmail);

            await this.overWriteTokenPubMatJSON(accessToken);


        } catch (error) {
            console.log(error)
        }
    }

    async newDate (createdAtLast) {
        try {
            let today = new Date();
            const createdAt = today.toLocaleString();
            const tokenDaysRange = 55;

            let range = new Date() - new Date(createdAtLast);
            range = Math.ceil(range / (100000 * 36 * 24));

            if ( range < tokenDaysRange ) {
                return;
            }

            today.setDate( today.getDate() + tokenDaysRange );
            today = today.toDateString().split(' ');

            return {
                day: today[ 2 ],
                month: today[ 1 ],
                createdAt
            };
       } catch (error) {
           console.log(error)
       }
    }

    newToken (pubMaticData, accessTokenOld) {
        try {
            return new Promise( ( resolve ) => {

                const putData = {
                    "email": `${pubMaticData.userEmail}`,
                    "apiProduct": "PUBLISHER",
                    "refreshToken": `${pubMaticData.refreshToken}`
                };
    
                const clientServerOptions = {
                    uri: 'http://api.pubmatic.com/v1/developer-integrations/developer/refreshToken',
                    body: JSON.stringify( putData ),
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessTokenOld}`
                    }
                };
                
                request(clientServerOptions, ( err, res ) => {
                    if (err) throw new Error( 'Error to query refresh PubMatic token' );
                    resolve(JSON.parse(res.body));
                });
            })
            .then( res => {

                if (res.accessToken && res.refreshToken) {
                    return {
                        accessToken: res.accessToken,
                        refreshToken: res.refreshToken,
                        error: null
                    }
                }

                return { error: res.fault.faultstring }
            })
            .catch( er => console.log('Request error', er))           
    } catch (error) {
          console.log(error)
        }
    }

    async overWritePubMaticData (newDate, refreshToken, userEmail) {
        try {
            
            fs.open(`${__dirname}/PubMaticData.json`, "r+", (err, fd) => { 
                 
                if (err) throw err;
    
                const newPubMaticData = {
                    day: newDate.day,
                    month: newDate.month,
                    createdAt: newDate.createdAt,
                    userEmail: userEmail,
                    refreshToken: refreshToken,
                }

                const json = JSON.stringify(newPubMaticData);

                fs.write(fd, json, 0, "utf8", (err) => {
                    
                    if (err) throw new Error(err);
                       
                    fs.close( fd, err => {  
                      
                        if (err) throw new Error(err);
                  }); 
                });  
            });
        } catch (error) {
            console.log(error);
        }
    }

    async overWriteTokenPubMatJSON (accessToken) {
        try {
            const pathToToken = `${__dirname}/../../config/tokens.json`;

            fs.readFile(pathToToken , 'utf-8', (err, data) => {

                if (err) throw err;

                const tokens = JSON.parse(data);
                tokens.PUBMATIC_API_TOKEN = accessToken;
                const overwritedToken = JSON.stringify(tokens);

                fs.writeFile(pathToToken , overwritedToken, (err) => {
                    if(err) throw err;
                });
            }); 
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = GetPubMaticToken;


// const https = require('https')

// const putData = JSON.stringify({
    
//     "email": "m.pylypenko@wmgroup.us",
//     "apiProduct": "PUBLISHER",
//     "refreshToken": `KrzJYYQKCFzm9UJFLtZfQiCsxg6d0Xnv`,
//     "accessToken": "mEOKwNcyMxI1HGaGpf7G42Xk8sB8",

// });

// const options = {
//   hostname: 'pubmatic.com',
//   port: 443,
//   path: 'http://api.pubmatic.com/v1/developer-integrations/developer/refreshToken',
//   method: 'PUT',
//   headers: {
//     'Content-Type': 'application/json',
//     'Authorization': `Bearer mEOKwNcyMxI1HGaGpf7G42Xk8sB8`
// }
// }
// // 'Content-Length': data.length

// const req = https.request(options, (res) => {
//   console.log(`statusCode: ${res.statusCode}`)

//   res.on('data', (d) => {
//     // process.stdout.write(d)
//       console.log(JSON.parse(d))
//   })
// })

// req.on('error', (error) => {
//   console.error(error)
// })

// req.write(putData)
// req.end()
// "userEmail":"m.pylypenko@wmgroup.us","refreshToken":"KrzJYYQKCFzm9UJFLtZfQiCsxg6d0Xnv"



// const clientServerOptions = {

//     uri: 'http://api.pubmatic.com/v1/developer-integrations/developer/refreshToken',
//     body: JSON.stringify( putData ),
//     method: 'PUT',
//     headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${accessTokenOld}`
//     }

// };