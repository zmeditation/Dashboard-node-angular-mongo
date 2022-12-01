export class Snippets {
  [x: string]: any;
  // openSnackBar(arg0: any, arg1: any): any {
  //   throw new Error("Method not implemented.");
  // }

  spotxChannelId = '142087';

  // GOOGLE PASSBACK
  googlePassbackObject = {
    width: '',
    height: '',
    dataAdUnitPath: '',
    dataClickUrl: '',
    dataPageUrl: ''
  };

  googlePassbackObjectKeys = Object.keys(this.googlePassbackObject);

  googlePassBackValues = ['width', 'height', 'data-ad-unit-path', 'data-click-url', 'data-page-url'];

  // GOOGLE ADEXCHANGE

  googleAddExchangeObject = {
    googleAdClient: 'google_ad_client',
    googleAdSlot: 'google_ad_slot',
    googleAdWidth: 'google_ad_width',
    googleAdHeight: 'google_ad_height'
  };

  googleAddExchangeObjectKeys = Object.keys(this.googleAddExchangeObject);

  googleAddExchangeValues = ['google_ad_client', 'google_ad_slot', 'google_ad_width', 'google_ad_height'];

  // CRITEO
  criteoObject = {
    zoneid: ''
  };

  criteObjectKeys = Object.keys(this.criteoObject);

  criteoValues = ['zoneid'];

  // GPT Short

  googleGPTShortObject = {
    height: '',
    width: '',
    slotId: ''
  };

  googleGPTShortObjectKeys = Object.keys(this.googleGPTShortObject);

  // Yandex

  yandexObject = {
    renderTo: '',
    blockId: ''
  };

  yandexObjectKeys = Object.keys(this.yandexObject);

  yandexObjectValues = ['renderTo', 'blockId'];

  // REGEX GEN
  regexGen(query) {
    return new RegExp(query + `=['"]([^'|"]*)['"]`);
  }

  regexObjectGen(query) {
    return new RegExp('"' + query + '":' + `[\\s]([^'|"]*)[,}]`);
  }

  regexYandexObjectGen(query) {
    return new RegExp(query + ': ' + `['"]([^"']*)['"]`);
  }

  regexFunctionVariablesGen(query) {
    return new RegExp(query + ' = ' + `[\s"]*([^("|;)]*)`);
  }

  randomId() {
    return Math.floor(Math.random() * 189489443);
  }

  regexPassbackShortRegGen(key) {
    if (key === 'height') { return new RegExp(`\\,([^']*)\\]`); } else if (key === 'width') { return new RegExp(`\\[([^']*)\\,`); } else if (key === 'slotId') { return new RegExp(`definePassback\\([']([^'|"]*)[']`); }

  }

  // TRANSFORM CODES
  transformGooglePassback(string, objectKeys, objectValues, object, channelId) {
    let success = false;
    let enableClickURL = true;
    let enablePageURL = true;

    objectKeys.forEach((key, index) => {
      if (objectValues[index] === 'data-click-url' && !string.match(this.regexGen(objectValues[index]))) {
        enableClickURL = false;
      } else if (objectValues[index] === 'data-page-url' && !string.match(this.regexGen(objectValues[index]))) {
        enablePageURL = false;
      } else if (string.match(this.regexGen(objectValues[index]))) {
        object[key] = string.match(this.regexGen(objectValues[index])).pop();
        success = true;
      } else {
        this.openSnackBar(`Couldn't find the ${ objectValues[index] } parameter, Please, enter a code with one.`, '');
        success = false;
      }
    });

    const id = this.randomId();

    return success
      ? this.returnGooglePassbackSpotxCode(this.googlePassbackObject, id, channelId, enableClickURL, enablePageURL)
      : 'Error. Something went wrong...';
  }

  transformCriteo(string, objectKeys, objectValues, object, channelId, width, height) {
    let success = false;

    objectKeys.forEach((key, index) => {
      if (string.match(this.regexObjectGen(objectValues[index]))) {
        object[key] = string.match(this.regexObjectGen(objectValues[index])).pop();
        success = true;
      } else {
        this.openSnackBar(`Couldn't find a Zone ID, Please, enter a code with one.`, '');
        success = false;
      }
    });

    const id = this.randomId();

    return success ? this.returnCriteoSpotxCode(id, channelId, object, width, height) : 'Error. Something went wrong...';
  }

  transformAdExchange(string, objectKeys, objectValues, object, channelId) {
    let success = false;

    objectKeys.forEach((key, index) => {
      if (string.match(this.regexFunctionVariablesGen(objectValues[index]))) {
        object[key] = string.match(this.regexFunctionVariablesGen(objectValues[index])).pop();
        success = true;
      } else {
        this.openSnackBar(`Couldn't find the ${ objectValues[index] } parameter, Please, enter a code with one.`, '');
        success = false;
      }
    });

    const id = this.randomId();

    return success ? this.returnGoogleAdExchangeCode(this.googleAddExchangeObject, id, channelId) : 'Error. Something went wrong...';
  }

  transformGPTShort(string, objectKeys, object, channelId) {
    let success = false;
    let c = 0;

    objectKeys.forEach((key) => {
      if (string.match(this.regexPassbackShortRegGen(key))) {
        object[key] = string.match(this.regexPassbackShortRegGen(key)).pop();
        success = true;
        c++;
      } else {
        this.openSnackBar(`Couldn't find the ${ key } parameter, Please, enter a code with one.`, '');
        success = false;
      }
    });

    c === objectKeys.length ? (success = true) : (success = false);

    const id = this.randomId();

    return success ? this.returnGoogleDFPShortSpotx(id, channelId, object) : 'Error. Something went wrong...';
  }

  transformYandex(string, objectKeys, objectValues, object, channelId, width, height) {
    let success = false;

    objectKeys.forEach((key, index) => {
      if (string.match(this.regexYandexObjectGen(objectValues[index]))) {
        object[key] = string.match(this.regexYandexObjectGen(objectValues[index])).pop();
        success = true;
      } else {
        this.openSnackBar(`Couldn't find the ${ objectValues[index] } parameter, Operation aborted.`, '');
        success = false;
      }
    });

    const id = this.randomId();

    return success ? this.returnYandexSpotxCode(id, channelId, object, width, height) : 'Error. Something went wrong...';
  }

  returnGooglePassbackSpotxCode(object, id, channelId, clickURL, pageURL) {
    return `<div id="WMG-${ this.randomId() }" style="width: ${ object.width }px; height: ${ object.height }px; overflow: hidden;">

    <script type="text/javascript" src="//js.spotx.tv/easi/v1/85394.js" data-spotx_channel_id="${ channelId }" data-spotx_ad_unit="incontent"
        data-spotx_ad_done_function="myAdDoneFunction" data-spotx_content_width="${ object.width }" data-spotx_content_height="${
      object.height
    }" data-spotx_autoplay="1"
        data-spotx_https="1" data-spotx_unmute_on_mouse="1" data-spotx_ad_volume="0" data-spotx_ad_skippable="1" data-spotx_ad_skip_delay="15">
        </script>
  
    <div id="WMG-banner-${ id }" style="visibility: hidden;"></div>
  
    <script type="text/javascript">
        var s = false;
  
        var o = document.querySelector('#WMG-banner-${ id }');
  
        var f = document.createElement('div');
        f.setAttribute('id', 'glade-aslot-1');
        f.style.width = "${ object.width }px";
        f.style.height = "${ object.height }px";
        f.setAttribute('data-glade', '');
        f.setAttribute('data-ad-unit-path', '${ object.dataAdUnitPath }');
        ${ clickURL ? `f.setAttribute('data-click-url', '${ object.dataClickUrl }')` : '' }
        ${ pageURL ? `f.setAttribute('data-page-url', '${ object.dataPageUrl }');` : '' }
        
        o.appendChild(f);
  
        var u = document.createElement('script');
        u.async = true;
        u.src = "https://securepubads.g.doubleclick.net/static/glade.js";
        o.appendChild(u);

        function i() {
            if (s === true) {
                return;
            }
            document.querySelector('#WMG-banner-${ id }').style.visibility = 'visible';
            s = true;
        }

        function myAdDoneFunction(spotx_ad_found) {
            if (spotx_ad_found) {
                i();
            }
            else {
                i();
            }
        }
    </script>

  </div>`;
  }

  returnGoogleAdExchangeCode(object, id, channelId) {
    return `<div id="WMG-${ this.randomId() }" style="width: ${ object.googleAdWidth }px; height: ${ object.googleAdHeight }px; overflow: hidden;">

    <script type="text/javascript" src="//js.spotx.tv/easi/v1/85394.js" data-spotx_channel_id="${ channelId }" data-spotx_ad_unit="incontent"
        data-spotx_ad_done_function="myAdDoneFunction" data-spotx_content_width="${ object.googleAdWidth }" data-spotx_content_height="${
      object.googleAdHeight
    }" data-spotx_autoplay="1"
        data-spotx_https="1" data-spotx_unmute_on_mouse="1" data-spotx_ad_volume="0" data-spotx_ad_skippable="1" data-spotx_ad_skip_delay="15">
        </script>

    <div id="WMG-banner-${ id }" style="visibility: hidden;"></div>

    <script type="text/javascript">
        var s = false;

        var o = document.querySelector('#WMG-banner-${ id }');

        var u = document.createElement('script');
        u.src = "//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
        o.appendChild(u);

        var f = document.createElement('ins');
        f.setAttribute('class', 'adsbygoogle');
        f.style.width = "${ object.googleAdWidth }px";
        f.style.height = "${ object.googleAdHeight }px";
        f.setAttribute('data-ad-client', '${ object.googleAdClient }');
        f.setAttribute('data-ad-slot', '${ object.googleAdSlot }');
        o.appendChild(f);

        var t = document.createElement('script');
        t.innerHTML = '(adsbygoogle = window.adsbygoogle || []).push({});';
        o.appendChild(t);

        function i() {
            if (s === true) {
                return;
            }
            document.querySelector('#WMG-banner-${ id }').style.visibility = 'visible';
            s = true;
        }

        function myAdDoneFunction(spotx_ad_found) {
            if (spotx_ad_found) {
                i();
            }
            else {
                i();
            }
        }
    </script>

  </div>`;
  }

  returnCriteoSpotxCode(id, channelId, object, width, height) {
    const criteoJS = `\`Criteo.DisplayAd({
                        "zoneid": ${ object.zoneid },
                        "containerid": "WMG-banner-${ id }",
                        "width": ${ width },
                        "height": ${ height },
                        "async": true});\``;

    return `<div id="WMG-${ this.randomId() }" style="width: ${ width }px; height: ${ height }px; overflow: hidden;">

    <script type="text/javascript" src="//js.spotx.tv/easi/v1/85394.js" data-spotx_channel_id="${ channelId }" data-spotx_ad_unit="incontent"
        data-spotx_ad_done_function="myAdDoneFunction" data-spotx_content_width="${ width }" data-spotx_content_height="${ height }" data-spotx_autoplay="1"
        data-spotx_https="1" data-spotx_unmute_on_mouse="1" data-spotx_ad_volume="0" data-spotx_ad_skippable="1" data-spotx_ad_skip_delay="15">  
    </script>
    
    <script type="text/javascript" src="//static.criteo.net/js/ld/publishertag.js"></script>

    <div id="WMG-banner-${ id }" style="visibility: hidden;"></div>

    <script type="text/javascript">
        var s = false;

        var o = document.querySelector('#WMG-banner-${ id }');

        var f = document.createElement('script');
            f.async = true;
            f.innerHTML = ${ criteoJS }
            o.appendChild(f);


        function i() {
            if (s === true) {
                return;
            }
            document.querySelector('#WMG-banner-${ id }').style.visibility = 'visible';
            s = true;
        }

        function myAdDoneFunction(spotx_ad_found) {
            if (spotx_ad_found) {
                i();
            }
            else {
                i();
            }
        }
    </script>

  </div>`;
  }

  returnGoogleDFPShortSpotx(id, channelId, object) {
    return `<div id="WMG-${ this.randomId() }" style="width: ${ object.width }px; height: ${ object.height }px; overflow: hidden;">

    <script type="text/javascript" src="//js.spotx.tv/easi/v1/85394.js" data-spotx_channel_id="${ channelId }" data-spotx_ad_unit="incontent"
        data-spotx_ad_done_function="myAdDoneFunction" data-spotx_content_width="${ object.width }" data-spotx_content_height="${
      object.height
    }" data-spotx_autoplay="1"
        data-spotx_https="1" data-spotx_unmute_on_mouse="1" data-spotx_ad_volume="0" data-spotx_ad_skippable="1" data-spotx_ad_skip_delay="15">  
    </script>
    

    <div id="WMG-banner-${ id }" style="visibility: hidden;"></div>

    <script type="text/javascript">
        var s = false;

        function generateWMGCode() {
            var o = document.querySelector('#WMG-banner-${ id }');

            var f = document.createElement('script');
            f.async = true;
            f.src = 'https://www.googletagservices.com/tag/js/gpt.js';
            o.appendChild(f);
            
            setTimeout(function () {
                var t = document.createElement('script');
                t.innerHTML = \`googletag.pubads().definePassback('${ object.slotId }', 
                [[${ object.width },${ object.height }]]).display();\`
                o.appendChild(t);
            }, 500)
        }

        function i() {
            if (s === true) {
                return;
            }
            document.querySelector('#WMG-banner-${ id }').style.visibility = 'visible';
            s = true;
            generateWMGCode()
        }

        function myAdDoneFunction(spotx_ad_found) {
            if (spotx_ad_found) {
                i();
            }
            else {
                i();
            }
        }
    </script>

  </div>`;
  }

  returnYandexSpotxCode(id, channelId, object, width, height) {
    return `<div id="WMG-${ this.randomId() }" style="width: ${ width }px; height: ${ height }px; overflow: hidden;">

    <script type="text/javascript" src="//js.spotx.tv/easi/v1/85394.js" data-spotx_channel_id="${ channelId }" data-spotx_ad_unit="incontent"
        data-spotx_ad_done_function="myAdDoneFunction" data-spotx_content_width="${ width }" data-spotx_content_height="${ height }" data-spotx_autoplay="1"
        data-spotx_https="1" data-spotx_unmute_on_mouse="1" data-spotx_ad_volume="0" data-spotx_ad_skippable="1" data-spotx_ad_skip_delay="15">  
    </script>

    <div id="WMG-banner-${ id }" style="visibility: hidden;">
        <div id="${ object.renderTo }"></div>
    </div>

    <script type="text/javascript">
        var s = false;

        var o = document.querySelector('#WMG-banner-${ id }');

        var f = document.createElement('script');
            f.async = true;
            f.innerHTML = \`(function(w, d, n, s, t) {
            w[n] = w[n] || [];
            w[n].push(function() {
                Ya.Context.AdvManager.render({
                    blockId: "${ object.blockId }",
                    renderTo: "${ object.renderTo }",
                    horizontalAlign: false,
                    async: true
                });
            });
            t = d.getElementsByTagName("script")[0];
            s = d.createElement("script");
            s.type = "text/javascript";
            s.src = "//an.yandex.ru/system/context.js";
            s.async = true;
            t.parentNode.insertBefore(s, t);
            console.log('hi');
        })(this, this.document, "yandexContextAsyncCallbacks");\`;
            
        o.appendChild(f);


        function i() {
            if (s === true) {
                return;
            }
            document.querySelector('#WMG-banner-${ id }').style.visibility = 'visible';
            s = true;
        }

        function myAdDoneFunction(spotx_ad_found) {
            if (spotx_ad_found) {
                i();
            }
            else {
                i();
            }
        }
    </script>

  </div>`;
  }
}
