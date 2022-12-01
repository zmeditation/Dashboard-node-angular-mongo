import { FormControl, FormGroup, Validators } from '@angular/forms';

export function addForm() {
  return new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(35)]),
    configname: new FormControl('', [Validators.required, Validators.maxLength(35)]),
    domain: new FormControl('', [
      Validators.required,
      Validators.maxLength(50),
      Validators.pattern(/^(https?:\/\/)?([\w.-]+)\.([a-z]{2,7}\.?)(\/[\w.]*)*\/?$/)
    ]),
    width: new FormControl(''),
    height: new FormControl(''),
    sizes: new FormControl('', Validators.required),
    adaptersList: new FormControl('', [Validators.required, Validators.minLength(7)]),
    amazon: new FormControl(false),
    cmp: new FormControl(false),
    cmpTimeout: new FormControl(1500),
    usp: new FormControl(false),
    uspTimeout: new FormControl(1500),
    floorPrice: new FormControl(0.5, Validators.required),
    PREBID_TIMEOUT: new FormControl(1500, [Validators.required, Validators.min(0), Validators.max(20000)]),
    toAll: new FormControl(''),
    networkId: new FormControl(''),
    adUnitCode: new FormControl(''),
    passbacktag: new FormControl('', Validators.required),
    settings: new FormControl(''),
    userId: new FormControl(''),
    siteId: new FormControl(''),
    cmpType: new FormControl('basic'),
    typeOfConfig: new FormControl(''),
    customCode: new FormControl(`consentManagement: {
                     gdpr: {
                        cmpApi: "static",
                        consentData: {
                            getConsentData: cmp
                        }
                     }
                  },`),
    setDomain: new FormControl(''),
    analytics: new FormControl(''),
    analyticsEnable: new FormControl(false),
    analyticsOptions: new FormControl(''),
    currency: new FormControl(''),
    marketplace: new FormControl(false),
    defaultCurrency: new FormControl(''),
    shortTag: new FormControl(false),
    schain: new FormControl(false),
    schainComplete: new FormControl(1),
    schainVer: new FormControl('1.0'),
    schainNodes: new FormControl(JSON.stringify([{ asi: 'bidderA.com', sid: '00001', hp: 1 }])),
    logo: new FormControl(true),
    devForm: new FormControl(''),
    thirdPartyCMP: new FormControl(false)
  });
}
