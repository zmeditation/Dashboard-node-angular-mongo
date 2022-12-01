import { FormControl, FormGroup, Validators } from '@angular/forms';

export function editForm() {
  return new FormGroup({
    name: new FormControl({ value: '', disabled: true }),
    configname: new FormControl({ value: '', disabled: true }),
    domain: new FormControl({ value: '', disabled: true }, [
      Validators.required,
      Validators.maxLength(50),
      Validators.pattern(/^(https?:\/\/)?([\w.-]+)\.([a-z]{2,6}\.?)(\/[\w.]*)*\/?$/)
    ]),
    sizes: new FormControl(''),
    amazon: new FormControl(''),
    cmp: new FormControl(''),
    cmpType: new FormControl(''),
    usp: new FormControl(''),
    uspTimeout: new FormControl(''),
    adUnitCode: new FormControl(''),
    networkId: new FormControl(''),
    PREBID_TIMEOUT: new FormControl('', [Validators.required, Validators.min(0), Validators.max(20000)]),
    floorPrice: new FormControl('', Validators.required),
    passbacktag: new FormControl('', Validators.required),
    toAll: new FormControl(''),
    cmpTimeout: new FormControl(''),
    userId: new FormControl(''),
    siteId: new FormControl(''),
    adaptersList: new FormControl(''),
    analytics: new FormControl(''),
    customCode: new FormControl(''),
    setDomain: new FormControl(''),
    currency: new FormControl(''),
    defaultCurrency: new FormControl(''),
    marketplace: new FormControl(),
    shortTag: new FormControl(),
    schain: new FormControl(),
    schainComplete: new FormControl(),
    schainVer: new FormControl(),
    schainNodes: new FormControl(),
    adExId: new FormControl(),
    logo: new FormControl(),
    thirdPartyCMP: new FormControl()
  });
}
