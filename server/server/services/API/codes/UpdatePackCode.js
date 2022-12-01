const Base = require('../../Base');
const util = require('util');
const fs = require("fs");
const { CDN } = require("../../../modules/wbid/services/CDN/controller");
const { codeModel } = require('../../../modules/codes/database/models');
const cdn = new CDN();

class UpdatePackCode extends Base {
  constructor(args) {
    super(args);
  }

  async execute(data) {

    function cut(string) {
      return string.substring(string.lastIndexOf("/") + 1)
    }

    const { code } = data.body;
    const codes = code.settings;
    const { id, link } = code;
    const fileName = cut(link);
    const template = `(function () {
      // if you wanna test codes write 'test' inside init. Example: init('test'); Then copy all this code and paste it into console of the target site.
    
      init();
    
      function getCodes() {
        return ${ util.inspect(codes, false, 2, false) };
      }
    
      function init(mode) {
        if (mode && mode.toLowerCase() === 'test') {
          testCodes();
        } else {
          addAdsToSite();
        }
      }
    
      function addAdsToSite() {
        const codes = getCodes();
    
        codes.forEach((code) => {
          if (isScriptForBody(code.script)) {
            let container = document.createElement('div');
    
            setInnerHTML(container, code.script);
            document.body.insertBefore(container, document.body.firstChild);
            return;
          }
    
          if (typeof code.inArticle === 'object') {
            insertAdInArticle(
              code.inArticle.articleClass,
              code.inArticle.paragraphNumber,
              code.script
            );
    
            return;
          }
    
          if (typeof code.afterElement === 'object') {
            insertAdAfterElement(code.afterElement.selector, code.script);
            return;
          }
    
          if (typeof code.placementId === 'string') {
            insertUsingId(code.placementId, code.script);
          }
        });
        return;
      }
    
      function isScriptForBody(script) {
        let isBodyScript = false;
        const attrForBody = ['fixed', 'fullscreen', 'sticky'];
    
        attrForBody.forEach((attr) => {
          if (script.includes(' ' + attr)) {
            isBodyScript = true;
          }
        });
    
        return isBodyScript;
      }
    
      function insertAdInArticle(
        contentClass = 'post-content',
        paragraphNumber = 2,
        script
      ) {
        let singlePage = document.querySelector('.' + contentClass);
        if (!singlePage) {
          return;
        }
    
        let paragraphs = singlePage.querySelectorAll('p');
        let normParagraph = paragraphs[paragraphNumber - 1];
    
        if (!normParagraph) {
          return;
        }
    
        let adContainer = document.createElement('p');
    
        insertAfter(normParagraph, adContainer);
        setInnerHTML(adContainer, script);
      }
    
      function insertAdAfterElement(selector, script) {
        let element = document.querySelector(selector);
        if (!element) {
          return;
        }
    
        let adContainer = document.createElement('div');
    
        insertAfter(element, adContainer);
        setInnerHTML(adContainer, script);
      }
    
      function insertUsingId(placementId, script) {
        let placement = document.getElementById(placementId);
        let adContainer = document.createElement('div');
    
        insertAfter(placement, adContainer);
        setInnerHTML(adContainer, script);
      }
    
      function insertAfter(referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
      }
    
      function setInnerHTML(elm, html) {
        elm.innerHTML = html;
        Array.from(elm.querySelectorAll('script')).forEach((oldScript) => {
          const newScript = document.createElement('script');
          Array.from(oldScript.attributes).forEach((attr) =>
            newScript.setAttribute(attr.name, attr.value)
          );
          newScript.appendChild(document.createTextNode(oldScript.innerHTML));
          oldScript.parentNode.replaceChild(newScript, oldScript);
        });
      }
    
      function testCodes() {
        const codes = getCodes();
    
        codes.forEach((code) => {
          if (isScriptForBody(code.script)) {
            let container = document.createElement('div');
    
            if (code.script.includes(' fullscreen')) {
              container.style.cssText = \`
                  background: #000000ba;
                  cursor: pointer;
                  position: fixed;
                  top: 0;
                  bottom: 0;
                  left: 0;
                  right: 0;
                  z-index:9999999;
                  \`;
            }
            if (code.script.includes(' sticky')) {
              container.style.cssText = \`
                  background: #000000ba;
                  cursor: pointer;
                  position: fixed;
                  height: 120px;
                  bottom: 0;
                  left: 0;
                  right: 0;
                  z-index:999999;
                  \`;
            }
            if (code.script.includes(' fixed')) {
              container.style.cssText = \`
                  background: #000000ba;
                  cursor: pointer;
                  position: fixed;
                  height: 280px;
                  width: 336px;
                  bottom: 0;
                  right: 0;
                  z-index:999999;
                  \`;
            }
    
            container.addEventListener('click', () => {
              container.remove();
            });
    
            document.body.insertBefore(container, document.body.firstChild);
            return;
          }
    
          let adHolder = document.createElement('div');
          adHolder.style.cssText = \`
            background: #000000ba;
            cursor: pointer;
            position: relative;
            min-height: 100px;
            min-width: 100px;
            height: 100%;
            width: 100%;
            z-index:999999;
            \`;
          adHolder.addEventListener('click', () => {
            adHolder.remove();
          });
    
          if (typeof code.inArticle === 'object') {
            insertAdInArticle(
              code.inArticle.articleClass,
              code.inArticle.paragraphNumber,
              nodeToString(adHolder)
            );
    
            return;
          }
    
          if (typeof code.afterElement === 'object') {
            insertAdAfterElement(
              code.afterElement.selector,
              nodeToString(adHolder)
            );
            return;
          }
        });
        return;
      }
    
      function nodeToString(node) {
        var tmpNode = document.createElement('div');
        tmpNode.appendChild(node.cloneNode(true));
        var str = tmpNode.innerHTML;
        tmpNode = node = null; // prevent memory leaks in IE
        return str;
      }
    })();`;
    const filepath = `${ __dirname }/src/${ fileName }`;

    await fs.promises.writeFile(filepath, template, 'utf-8');
    await cdn.deleteFromCDN(link);
    await cdn.uploadToCDN(filepath);
    await codeModel.update({ settings: codes }, { where: { id } })

    return {
      success: true,
      code: `<script src="${ link }" async></script>`
    }
  }

}

module.exports = UpdatePackCode;
