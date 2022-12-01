const { CDN } = require("../../../wbid/services/CDN/controller");
const fse = require("fs-extra");
const UglifyJS = require("uglify-es");
const cdn = new CDN();

module.exports = async (query) => {

  /**
   * @type {object}
   * @property {string | number} network_id - DFP Network ID
   * @property {string | number} child_network_id - Child Network ID
   * @property {string} placement_id - DFP Placement ID
   * @property {string} page_url - URL of page
   * @property {string} slot_element_id - ID of DIV with ad
   * @property {string} pub_id - Publisher's ID from dashboard
   * @property {string} ad_type - type of ad, banner or InBannerVideo. Default is banner
   * @property {Array.<number>} sizes - Sizes of banner
   * @property {boolean} collapse_empty_divs - Collapse divs if empty
   * @property {boolean} centered - Banner should be centered
   * @property {boolean} logo - Add WMG Logo
   * @property {string} programmatic - Programmatic (Google, Yandex etc.)
   * @property {boolean} isFluid - is banner should be with fluid width
   * @property {string} fluid_height - height for fluid banner
   * @property {object} fluidSettings - settings for fluid banner
   * @property {string} fluidSettings.position - banner position on the page: top, bottom or not set
   * @property {boolean} fluidSettings.background - background for banner
   * @property {boolean} fluidSettings.closeButton - close button for banner
   * @property {boolean} pm - Protected media on/off
   **/

  const payload = query;

  /**
   *
   * @param {string} page_url
   * @param {string} placement_id
   * @param {string} pub_id
   * @param {string} sizes
   * @returns {{img: string, script: string}}
   */

  const protectedMediaGenerator = (page_url, placement_id, pub_id, sizes) => {

    function extractHostname(url) {
      let hostname;

      if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
      } else {
        hostname = url.split('/')[0];
      }
      hostname = hostname.split(':')[0];
      hostname = hostname.split('?')[0];
      return hostname;
    }

    try {
      const scriptSource = `https://js.ad-score.com/score.min.js?pid=1000804&tid=TAC&l1=${ pub_id }&l2=${ placement_id }&l3=${ extractHostname(page_url) }&l4=${ sizes }&creative_type=banner&tt=if,g`
      const imgSource = `https://data.ad-score.com/img?s=ns&pid=1000804&tid=TAC&l1=${ pub_id }&l2=${ placement_id }&l3=${ extractHostname(page_url) }&l4=${ sizes }&creative_type=banner&tt=if,g`

      return {
        script: scriptSource,
        img: imgSource
      };
    } catch (e) {
      console.log(e);
      return { script: "", img: "" };
    }
  }

  /**
   * @param {boolean} logo
   * @param {string} main_url
   * @param {{script: string | undefined, img: string | undefined}} protectedMediaCode
   * @param {string} divId
   * @returns {Promise<*>}
   */
  const getFinalShortCode = async (logo, main_url, protectedMediaCode, divId) => {
    const filepath = `${ __dirname }/dist/wmg_${ payload.placement_id }.js`;

    const code = `
                (function(){
                const parent = document.getElementById("${ divId }");
                const script_1 = document.createElement("script");
                script_1.src = "https://securepubads.g.doubleclick.net/tag/js/gpt.js";
                script_1.async = true;
                const script_2 = document.createElement("script");
                script_2.src = "${ logo ? "https://d3f4nuq5dskrej.cloudfront.net/js/wmg_logo.js" : "" }";
                script_2.async = true;
                const script_3 = document.createElement("script");
                script_3.src = "${ main_url }";
                script_3.async = true;
                const script_4 = document.createElement("script");
                script_4.src = "${ protectedMediaCode.script ? protectedMediaCode.script : "" }";
                script_4.async = true;
                const img = document.createElement('img');
                img.src = "${ protectedMediaCode.img ? protectedMediaCode.img : "" }";
                img.height = "1"; img.width = "1";
                const noscript = document.createElement('noscript');
                noscript.appendChild(img);
                ${ protectedMediaCode.script ? 'parent.append(script_1, script_2, script_3, script_4, noscript);' : 'parent.append(script_1, script_2, script_3);' }
            })();
    `;

    /**
     * @type {object}
     * @param {boolean} error
     * @param {string} code
     */
    const minifiedCode = UglifyJS.minify(code);
    if (minifiedCode.error) {
      await fse.writeFile(filepath, code);
    } else {
      await fse.writeFile(filepath, minifiedCode.code);
    }
    return await cdn.uploadToCDN(filepath);
  }

  const filepath = `${ __dirname }/dist/${ payload.placement_id }.js`;
  let setAdWidth, bannerPosition, background, closeButton, closeButtonPosition, logoCode;
  if (payload.isFluid) {
    setAdWidth = `let adContainer = document.getElementById("${ payload.slot_element_id }");
            let adWidth = adContainer.offsetWidth;
            let fluid_sizes = [adWidth, ${ parseFloat(payload.fluid_height) }];`;
    switch (payload.fluidSettings.position) {
      case 'top':
        bannerPosition = `style="width: 100%; position: fixed; top: 0; left: 0; z-index: 777777"`;
        closeButtonPosition = `bottom: -30px; right: 0;`
        break;
      case 'bottom':
        bannerPosition = `style="width: 100%; position: fixed; bottom: 0; left: 0; z-index: 777777;"`;
        closeButtonPosition = `top: -30px; right: 0;`
        break;
      default:
        bannerPosition = `style="width: 100%"`;
        closeButtonPosition = `left: calc(100% - 30px); bottom: calc(${ payload.fluid_height }px + 30px);`
    }
    if (payload.fluidSettings.closeButton === true) {
      closeButton = `
            let wmg_div_close = document.createElement("div"), span_1 = document.createElement("div"), span_2 = document.createElement("div");
            wmg_div_close.style = "position: ${ payload.fluidSettings.position === "" ? 'relative' : "absolute" }; width: 30px; height: 30px; z-index: 9999999; cursor: pointer; ${ closeButtonPosition } background: rgba(211,222,211,0.85)";
            span_1.style = "width: 20px; height: 2px; background: rgb(68, 68, 68); left: calc(50% - 10px); top: 50%; position: absolute; transform: rotate(45deg);";
            span_2.style = "width: 20px; height: 2px; background: rgb(68, 68, 68); left: calc(50% - 10px); top: 50%; position: absolute; transform: rotate(-45deg);";
            wmg_div_close.appendChild(span_1);
            wmg_div_close.appendChild(span_2);
            wmg_div_close.id = "closebar-wmg-ad";
            wmg_div_close.addEventListener("click", function () {
                adContainer.remove();
            });
            function appendCloseDiv() {
                adContainer.appendChild(wmg_div_close);
            }
            appendCloseDiv();
            `
    }

    if (payload.fluidSettings.background === true) {
      background = `
            adContainer.style.background = "#f6f6f6";
            `;
    }

  } else {
    setAdWidth = '';
    bannerPosition = '';
    background = '';
    closeButton = '';
  }

  if (payload.logo) {
    logoCode = `setTimeout(() => {
            if(typeof addLogo === "function"){
                addLogo('${ payload.slot_element_id }');
            }
        }, 3000)`;
  } else {
    logoCode = '';
  }

  try {
    let code = `
        (function () {
            function getClearDomain(url) {
                let hostname;

                if (url.indexOf('//') > -1) {
                    hostname = url.split('/')[2];
                } else {
                    hostname = url.split('/')[0];
                }

                hostname = hostname.split(':')[0];
                hostname = hostname.split('?')[0];
                return hostname;
            }
            
            function parseUserAgent(ua) {
                function detectDevice(ua) {
                    if (/ipad|android 3.0|xoom|sch-i800|playbook|tablet|kindle/i.test(ua.toLowerCase())) {
                        return 'tablet';
                    }
                    if (/iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua.toLowerCase())) {
                        return 'mobile';
                    }
                    return 'desktop';
                }
                let device = detectDevice(ua);

                function detectOsAndBrowser(ua) {
                    var module = {
                        options: [],
                        dataos: [{
                                name: 'Windows Phone',
                                value: 'Windows Phone',
                                version: 'OS'
                            },
                            {
                                name: 'Windows',
                                value: 'Win',
                                version: 'NT'
                            },
                            {
                                name: 'iOS',
                                value: 'iPhone',
                                version: 'OS'
                            },
                            {
                                name: 'iOS',
                                value: 'iPad',
                                version: 'OS'
                            },
                            {
                                name: 'Kindle',
                                value: 'Silk',
                                version: 'Silk'
                            },
                            {
                                name: 'Android',
                                value: 'Android',
                                version: 'Android'
                            },
                            {
                                name: 'PlayBook',
                                value: 'PlayBook',
                                version: 'OS'
                            },
                            {
                                name: 'BlackBerry',
                                value: 'BlackBerry',
                                version: '/'
                            },
                            {
                                name: 'Macintosh',
                                value: 'Mac',
                                version: 'OS X'
                            },
                            {
                                name: 'Linux',
                                value: 'Linux',
                                version: 'rv'
                            },
                            {
                                name: 'Palm',
                                value: 'Palm',
                                version: 'PalmOS'
                            }
                        ],
                        databrowser: [{
                                name: 'Yandex Browser',
                                value: 'YaBrowser',
                                version: 'YaBrowser'
                            },
                            {
                                name: 'Opera Mini',
                                value: 'Opera Mini',
                                version: 'Opera Mini'
                            },
                            {
                                name: 'Amigo',
                                value: 'Amigo',
                                version: 'Amigo'
                            },
                            {
                                name: 'Atom',
                                value: 'Atom',
                                version: 'Atom'
                            },
                            {
                                name: 'Opera',
                                value: 'OPR',
                                version: 'OPR'
                            },
                            {
                                name: 'Edge',
                                value: 'Edge',
                                version: 'Edge'
                            },
                            {
                                name: 'Edge',
                                value: 'Edg',
                                version: 'Edg'
                            },
                            {
                                name: 'Internet Explorer',
                                value: 'Trident',
                                version: 'rv'
                            },
                            {
                                name: 'Chrome',
                                value: 'Chrome',
                                version: 'Chrome'
                            },
                            {
                                name: 'Firefox',
                                value: 'Firefox',
                                version: 'Firefox'
                            },
                            {
                                name: 'Safari',
                                value: 'Safari',
                                version: 'Version'
                            },
                            {
                                name: 'Internet Explorer',
                                value: 'MSIE',
                                version: 'MSIE'
                            },
                            {
                                name: 'Opera',
                                value: 'Opera',
                                version: 'Opera'
                            },
                            {
                                name: 'BlackBerry',
                                value: 'CLDC',
                                version: 'CLDC'
                            },
                            {
                                name: 'Mozilla',
                                value: 'Mozilla',
                                version: 'Mozilla'
                            }
                        ],
                        init: function () {
                            var os = this.matchItem(ua, this.dataos);
                            var browser = this.matchItem(ua, this.databrowser);

                            return {
                                os: os,
                                browser: browser
                            };
                        },

                        getVersion: function (name, version) {
                            if (name === 'Windows') {
                                switch (parseFloat(version).toFixed(1)) {
                                    case '5.0':
                                        return '2000';
                                    case '5.1':
                                        return 'XP';
                                    case '5.2':
                                        return 'Server 2003';
                                    case '6.0':
                                        return 'Vista';
                                    case '6.1':
                                        return '7';
                                    case '6.2':
                                        return '8';
                                    case '6.3':
                                        return '8.1';
                                    default:
                                        return parseInt(version) || 'other';
                                }
                            } else return parseInt(version) || 'other';
                        },

                        matchItem: function (string, data) {
                            var i = 0;
                            var j = 0;
                            var regex, regexv, match, matches, version;

                            for (i = 0; i < data.length; i += 1) {
                                regex = new RegExp(data[i].value, 'i');
                                match = regex.test(string);
                                if (match) {
                                    regexv = new RegExp(data[i].version + '[- /:;]([\\\\d._]+)', 'i');
                                    matches = string.match(regexv);
                                    version = '';
                                    if (matches) {
                                        if (matches[1]) {
                                            matches = matches[1];
                                        }
                                    }
                                    if (matches) {
                                        matches = matches.split(/[._]+/);
                                        for (j = 0; j < matches.length; j += 1) {
                                            if (j === 0) {
                                                version += matches[j] + '.';
                                            } else {
                                                version += matches[j];
                                            }
                                        }
                                    } else {
                                        version = 'other';
                                    }
                                    return {
                                        name: data[i].name,
                                        version: this.getVersion(data[i].name, version)
                                    };
                                }
                            }
                            return {
                                name: 'unknown',
                                version: 'other'
                            };
                        }
                    };

                    var e = module.init();

                    var result = {};
                    result.os = e.os.name + ' ' + e.os.version;
                    result.browser = e.browser.name + ' ' + e.browser.version;
                    return result;
                }

                let {
                    os,
                    browser
                } = detectOsAndBrowser(ua);

                return {
                    device: device,
                    os: os,
                    browser: browser
                    }
            }
            
            function getUrl() {
                try {
                    return window.top.location.href;
                } catch (e) {
                    return document.referrer || window.location.ancestorOrigins[0] || "";
                }
            }

            function parseGPTSlot(event, action, pubId, adType = "banner") {
                return {
                    ad_unit_code: event.slot.getAdUnitPath().split('/')[2] || "",
                    slot_element_id: event.slot.getSlotElementId(),
                    event: action,
                    url: getUrl(),
                    domain: getClearDomain(googletag.pubads().get('page_url')),
                    sizes: Object.values(event.slot.getSizes()[0]) || [""],
                    ad_type: adType,
                    pub_id: pubId,
                    no_ad: event.isEmpty !== undefined ? event.isEmpty : false,
                    device: parseUserAgent(window.navigator.userAgent).device,
                    os: parseUserAgent(window.navigator.userAgent).os,
                    browser: parseUserAgent(window.navigator.userAgent).browser,
                    programmatic: "Google Ad Manager"
                }
            }
            
            function sendRequest (object) {
                let url = 'https://tac.wmgroup.us/analytic/collection'
                fetch(url, {
                    method: 'POST',
                    mode: 'no-cors',
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    redirect: 'follow',
                    referrerPolicy: 'no-referrer',
                    body: JSON.stringify(object)
                }).catch(e => console.error(e))
            }

            let GptReady = setInterval(() => {
                if (window.googletag && googletag.pubadsReady) {
                    googletag.pubads().addEventListener('slotRenderEnded', function (event) {
                        ${ closeButton }
                        if ('${ payload.slot_element_id }' === event.slot.getSlotElementId()) {
                            let adObject = parseGPTSlot(event, "impression", "${ payload.pub_id }", "${ payload.ad_type }")
                            sendRequest(adObject);
                        }
                    });

                    googletag.pubads().addEventListener('impressionViewable', function (event) {
                        if ('${ payload.slot_element_id }' === event.slot.getSlotElementId()) {
                            let adObject = parseGPTSlot(event, "display", "${ payload.pub_id }", "${ payload.ad_type }")
                            sendRequest(adObject);
                        }
                    });

                    clearInterval(GptReady);
                }
            }, 100);
            ${ setAdWidth }
            ${ background }
            window.googletag = window.googletag || {
                cmd: []
            };
            googletag.cmd.push(function () {
                googletag.defineSlot('/${ payload.network_id },${ payload.child_network_id }/${ payload.placement_id }', [
                        ${ payload.isFluid ? ("fluid_sizes, 'fluid'") : payload.sizes }
                    ], '${ payload.slot_element_id }')
                    .addService(googletag.pubads());
                googletag.pubads().collapseEmptyDivs(${ payload.collapse_empty_divs });
                googletag.pubads().setForceSafeFrame(false);
                googletag.pubads().setCentering(${ payload.centered });
                googletag.pubads().set('page_url', '${ payload.page_url }');
                googletag.enableServices();
                googletag.pubads().addEventListener('slotRequested', function (event) {
                    if ('${ payload.slot_element_id }' === event.slot.getSlotElementId()) {
                        let adObject = parseGPTSlot(event, "request", "${ payload.pub_id }", "${ payload.ad_type }");
                        sendRequest(adObject);
                        sessionStorage.setItem(event.slot.getSlotElementId(), JSON.stringify(adObject));
                    }
                });
                googletag.display('${ payload.slot_element_id }');
            });

            var monitor = setInterval(() => {
                var elem = document.activeElement;
                if (elem && elem.tagName === 'IFRAME' && elem.id.includes(
                        '${ payload.network_id },${ payload.child_network_id }/${ payload.placement_id }')) {
                    let adObject = JSON.parse(sessionStorage.getItem('${ payload.slot_element_id }'));
                    if (adObject) {
                        adObject.event = "click";
                        sendRequest(adObject);
                        clearInterval(monitor);
                    }
                }
            }, 100);
            ${ logoCode }
            
        }());
    `;
    const minifiedCode = UglifyJS.minify(code);
    if (minifiedCode.error) {
      await fse.writeFile(filepath, code);
    } else {
      await fse.writeFile(filepath, minifiedCode.code);
    }
    const main_code = await cdn.uploadToCDN(filepath);
    const protectedMediaObject = payload.pm ? protectedMediaGenerator(payload.page_url, payload.placement_id, payload.pub_id, payload.sizes.join('x')) : {};
    const result = await getFinalShortCode(payload.logo, main_code, protectedMediaObject, payload.slot_element_id);

    return {
      success: true,
      res: `<div id="${ payload.slot_element_id }" ${ bannerPosition }><script async src="${ result }"></script></div>`
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      error: e.message || e
    }
  }
};
