const express = require('express');
const router = express.Router();

router.get('/ad-server/:id', removeFrameGuard, (req, res) => {
    const top = `<html>
                    <head>
                        <title>Ad Preview</title>
                        <style>
                            * { 
                                margin: 0; 
                                padding: 0;
                            }
                        </style>
                    </head>
                        <body>
                            <div id="ad-25484" style="border: 1px solid black; display: inline-block;">`;

    const bottom = `</div>
                </body>
            </html>`;

    const script = `
        const div = document.querySelector('#ad-25484');
        let divH = div.offsetHeight;
        let divW = div.offsetWidth;
        if (divH <= 50 && divH <= 50) {
            setTimeout(function() {
                divH = div.offsetHeight;
                divW = div.offsetWidth;
                window.top.postMessage({h: divH, w: divW}, '*');   
            }, 1000); 
        } else {
            window.top.postMessage({h: divH, w: divW}, '*');   
        } 
        // console.log('local',localStorage.getItem('currentUser'));
    `;

    res.send(`<h1>Preview Instantiated...</h1>
              <script>
                console.log('Iframe Works');
                window.addEventListener('message', (e) => {
                    if (e.data.m && e.data.m === 'preview') {
                        let code = decodeHtmlEntity(e.data.c);
                        // console.log(e);
                        document.write(\`${top}\` + code + \`${bottom}\`);
                        let d = document.querySelector('#ad-25484');
                        // console.log(d);
                        let s = document.createElement('script');
                        s.innerHTML = \`${script}\`;
                        d.appendChild(s);                        
                    }

                });
                let decodeHtmlEntity = function(str) {
                    // console.log('str', str);
                    return str.replace(/&#(\\d+);/g, function(match, dec) {
                        return String.fromCharCode(dec);
                    });
                };
              </script>
    `);
});

function removeFrameGuard (req, res, next) {
    res.removeHeader('X-Frame-Options');
    next()
}

module.exports = router;