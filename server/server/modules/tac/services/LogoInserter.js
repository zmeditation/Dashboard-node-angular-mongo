module.exports.LogoInserter = function(divId) {
    return `
    function addLogo(elementId) {
    let wmgAd;
    // Checks if the unit comes from a short tag
    if (elementId.includes("wmg-script-")) {
        const stringToReplace = /wmg-script-/gi;
        const modifiedId = elementId.replace(stringToReplace, "");
        const wmgFrame = document.querySelectorAll(\`[id*=$\{modifiedId\}]\`)[1];
        const wmgFrameContent =
            wmgFrame.contentDocument || wmgFrame.contentWindow.document;
        const wmgInFrameDiv = wmgFrameContent.querySelector("body");
        wmgAd = wmgInFrameDiv;
        // Checks if the unit is from Ad Manager, if it's filled and centers it according to iframe size values
    } else if (document.getElementById(elementId).children[0].children[0]) {
        wmgAd = document.getElementById(elementId);
        const wmgAdHeight = wmgAd.children[0].children[0].offsetHeight;
        const wmgAdWidth = wmgAd.children[0].children[0].offsetWidth;
        wmgAd.style.height = \`$\{wmgAdHeight\}px\`;
        // if (wmgAd.style.width !== '100%') {
        //     wmgAd.style.width = \`$\{wmgAdWidth\}px\`;
        // }
        if (
            wmgAd.style.position !== "relative" &&
            wmgAd.style.position !== "fixed"
        ) {
            wmgAd.style.position = "relative";
        }
    }
    const rndNum = Math.floor(Math.random() * 1000000);
    const wmgLogoLink = document.createElement("a");
    wmgLogoLink.id = \`wmg-logo-$\{rndNum\}\`;
    wmgLogoLink.style =
        "z-index: 2; position: absolute; bottom: 5px;right: 5px;flex-direction: row-reverse;line-height: 50%;display: flex;align-items: center; height: 14px; font-size: 11px; transition: all 0.7s ease 0s;color: black;text-decoration: none;";
    wmgLogoLink.setAttribute("alt", "wmg-logo");
    wmgLogoLink.setAttribute("title", "Programmatic Agency WMG");
    wmgLogoLink.setAttribute("href", "https://adwmg.com/");
    wmgLogoLink.setAttribute("target", "blank");
    wmgLogoLink.innerHTML = \`
<svg alt="wmg-logo" width="15" height="15" style="margin: 0 5px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 239.2 201.54">
<defs
<style>.cls-1{fill: url(#linear-gradient);}.cls-2{fill: url(#linear-gradient-2);}.cls-3{fill: url(#linear-gradient-3);}</style>
<linearGradient id="linear-gradient" x1="190.89" y1="11.25" x2="223.15" y2="49.38" gradientTransform="translate(238.06 -176.72) rotate(89.69)" gradientUnits="userSpaceOnUse">
<stop offset="0" stop-color="#008da5"/><stop offset="1" stop-color="#02916b"/></linearGradient>
<linearGradient id="linear-gradient-2" x1="30.57" y1="103.15" x2="117.46" y2="100.42" gradientTransform="translate(63.41 -22.63) rotate(31.31)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#18815b"/><stop offset="1" stop-color="#0d325f"/></linearGradient>
<linearGradient id="linear-gradient-3" x1="116.95" y1="103.15" x2="203.85" y2="100.42" gradientTransform="translate(75.99 -67.51) rotate(31.31)" xlink:href="#linear-gradient"/></defs>
<title>WMG International</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1">
<circle class="cls-1" cx="207.87" cy="31.32" r="31.32" transform="translate(175.41 239.02) rotate(-89.69)"/>
<rect class="cls-2" x="42.85" y="-9.86" width="58.47" height="223.4" rx="29.23" ry="29.23" transform="translate(-42.42 52.28) rotate(-31.31)"/>
<rect class="cls-3" x="129.24" y="-9.86" width="58.47" height="223.4" rx="29.23" ry="29.23" transform="translate(-29.85 97.17) rotate(-31.31)"/></g></g></svg>
\`;
    if (!wmgAd) {
        return;
    } else {
        wmgAd.appendChild(wmgLogoLink);
    }
}

setTimeout(() => {
    addLogo("${divId}");
}, 3000); `
}
