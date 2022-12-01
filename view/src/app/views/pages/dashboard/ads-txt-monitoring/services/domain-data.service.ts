import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AdsTxtEndpointsService } from '../../../../../shared/services/cruds/ads-txt.endpoints.service';


type CheckedDomains = { 
  _id: string;
  am: string;
  domains: Domain[];
  enabled: { 
    changed: boolean, 
    status: boolean 
  };
  validDomainObject: boolean;
  expandPanel?: boolean;
  name: string;
}

type Domain = {
  adsTxt: string; // "true", "false" 
  checked: string; // "true", "false" 
  domain: string;
  origin_domain: string;
  origin_checked: string; // "true", "false" 
  origin_adstxt: string; // "true", "false"  
  origins: Origins[] // | string[]
}

type Origins = {
  [key: string]: string | boolean | number[]; // "undefined" | boolean | (absent: [number]);
}

type DomainsByPubName = {
  [key: string]: Domain[]
}

export class DomainData implements OnDestroy {

  public dataSource = {};

  public checkedDomains: CheckedDomains[] = [];

  public statusObj = [];

  public domainsByPubName: DomainsByPubName = {};

  public noPublishers = false;

  public noData = false;

  public isUploading = false;

  public lastUpdate: number;

  public subscription = new Subscription();

  constructor(
    protected adsTxtEndService: AdsTxtEndpointsService
  ) {} 

  public getData(): void {
    this.isUploading = true;

    const getDataSub = this.adsTxtEndService.getCheckedDomains()
      .subscribe(async (domainData: any) => {
        await this.handleDomainsData(domainData);
        this.isUploading = false;
      });

    this.subscription.add(getDataSub);
  }

  protected async handleDomainsData(domainData: any): Promise<void> {
    const attributes = domainData?.data?.attributes;
    this.noData = false;
    this.noPublishers = false;
    this.lastUpdate = attributes?.lastUpdate || 0;

    if (attributes?.filteredResult?.length) {
      this.checkedDomains = attributes.filteredResult
        .filter((el) => el?.enabled);

      if (!this.checkedDomains.length) {
        this.noPublishers = true;
        return;
      }

      this.noData = false;
      this.noPublishers = false;
 
      this.addFieldsToCheckedDomains();
      this.setDomainsByPubName();
      this.checkDomainsValidation();
    } else {
      this.noData = true;
    }
  }

  protected addFieldsToCheckedDomains(): void {
    this.checkedDomains.forEach((obj) => {
      obj.expandPanel = false;
      obj.validDomainObject = true;
    });
  }

  protected setDomainsByPubName(): void {
    this.checkedDomains.forEach(domain => {
      this.domainsByPubName[domain.name] = this.changeDomainsOfDomainsByPubName(domain.domains);
    });

    this.prepareDataSource();
  }

  protected changeDomainsOfDomainsByPubName(domains: Domain[]): any {
    return domains.map((domain) => {
      return {
        ...domain,
        origins: this.changeOriginsDomainsByPubName(domain.origins)
      }
    })
  }

  protected changeOriginsDomainsByPubName(origins: Origins[] | string[]): Origins[] { 
    return (origins as Array<Origins | string>).map((origin: Origins | string) => {
      
      if (typeof origin !== 'string') {
        return {
          name: Object.keys(origin)[0],
          status: Object.values(origin)[0],
          absent: origin.absent
        };
      } else {
        return {
          name: 'DOMAIN_NOT_CHECKED',
          status: null
        };
      }
    })
  }

  protected prepareDataSource(): void {    
    for (const [name, domainsArr] of Object.entries(this.domainsByPubName)) {
      this.dataSource[name] = new MatTableDataSource(domainsArr);
    }
  }

  protected checkDomainsValidation(): void {
    for (const [name, domainsArr] of Object.entries(this.domainsByPubName)) {

      domain: for (const domain of domainsArr) {
        if (domain?.adsTxt !== 'true' && domain?.origin_adstxt !== 'true') {
          this.setValidationStatusByName(name, false);
          break;
        }

        if (domain?.checked !== 'true' && domain?.origin_checked !== 'true') {
          this.setValidationStatusByName(name, false);
          break;
        }

        for (const origin of domain.origins) {
          if (!origin?.status || (origin?.status !== 'undefined' && origin?.status !== "true".toString())) {            
            this.setValidationStatusByName(name, false);
            break domain;
          }
        }
      }
    }
  }

  protected setValidationStatusByName(name: string, status): void {
    for (const domainObj of Object.values(this.checkedDomains)) {
      if (domainObj?.name === name) {
        domainObj.validDomainObject = status;
        break;
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
