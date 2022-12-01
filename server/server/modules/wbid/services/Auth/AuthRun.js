const {OAuth2Client} = require("google-auth-library");
const http = require("http");
const url = require("url");
const open = require("open");
const destroyer = require("server-destroy");
const keys = require("./oauth2.keys");
const { pushByIDViaSocket } = require('../../../../services/websocket/websocket_service');

function getAuthenticatedClient({networkId, socket, additional: {wbidUserId: id}}) {
    return new Promise((resolve, reject) => {
        // create an oAuth client to authorize the API call.  Secrets are kept in a `keys.json` file,
        // which should be downloaded from the Google Developers Console.
        const oAuth2Client = new OAuth2Client(
            keys.web.client_id,
            keys.web.client_secret,
            keys.web.redirect_uris[0]
        );
        // Generate the url that will be used for the consent dialog.
        const authorizeUrl = oAuth2Client.generateAuthUrl({
            access_type: "offline",
            scope: "https://www.googleapis.com/auth/dfp"
        });
        
        const msgViaSocket = {
            socketId: socket,
            mes: authorizeUrl,
            last: true,
            event: 'prebid dfp integration'
        };

        pushByIDViaSocket(msgViaSocket);
        
        // Open an http server to accept the oauth callback. In this simple example, the
        // only request to our webserver is to /oauth2callback?code=<code>
        const server = http
            .createServer(async (req, res) => {
                try {
                    if (req.url.indexOf("/oauth2callback") > -1) {
                        // acquire the code from the querystring, and close the web server.
                        let baseURL;
                        switch (process.env.NODE_ENV) {
                            case 'production':
                                baseURL = 'https://dashboard.wmgroup.us';
                                break;
                            case 'staging':
                                baseURL = 'https://staging.dashboard.wmgroup.us';
                                break;
                            case 'development':
                                baseURL = 'http://localhost'
                        }
                        const qs = new url.URL(req.url, baseURL).searchParams;
                        const code = qs.get("code");
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        res.write(`<script>setTimeout( () => window.close(), 5000);</script>
                        Authentication successful! You can close this tab or tab will close by itself after 5 sec.`);
                        res.end(() => {
                        });
                        // Now that we have the code, use that to acquire tokens.
                        const r = await oAuth2Client.getToken(code);
                        // Make sure to set the credentials on the OAuth2 client.
                        oAuth2Client.setCredentials(r.tokens);
                        // console.info('Tokens acquired.');
                        server.destroy();
                        resolve(oAuth2Client);
                    }
                } catch (e) {
                    reject(e);
                }
            })
            .listen(3000, () => {
            });
        destroyer(server);
    });
}

module.exports = getAuthenticatedClient;
