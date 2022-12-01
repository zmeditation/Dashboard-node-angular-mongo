import { ReportManualUploaderService } from '../../report-services/report-manual-uploader.service';
import { FormValidators } from "shared/services/form-validators/form-validators";
import { Subscription } from 'rxjs/Subscription';

export class ManualUploadData extends FormValidators {
  public publishers = [];

  public properties: string[] = [];

  public domains: string[] = [];

  public types = ['video', 'banner'];

  public loading = true;

  public allPropertiesServerObject;

  public originsOfPublisher = [];

  public bundleObjectProgDomPlace = {
    programmatics: [],
    domains: [],
    properties: [],
    _id: '',
    am: ''
  };

  mySubscriptionOnProperties: Subscription;

  mySubscriptionOnOrigins: Subscription;

  constructor(public reportManualUploaderService: ReportManualUploaderService) {
    super();
  }

  getDataServer() {
    this.mySubscriptionOnProperties = this.reportManualUploaderService.getPlacements().subscribe(
      (data: any) => {
        if (data.success) {
          this.allPropertiesServerObject = data.results;
          this.getAllPubs();
          return this.allPropertiesServerObject;
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getAllPubs() {
    for (const opt of this.allPropertiesServerObject) { this.publishers.push({ name: opt.name, _id: opt._id }); } 

    this.loading = false;
  }
}
