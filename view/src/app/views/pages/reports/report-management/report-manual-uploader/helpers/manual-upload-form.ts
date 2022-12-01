import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportManualUploaderService } from '../../report-services/report-manual-uploader.service';
import { ManualUploadData } from './manual-upload-data';

export class ManualUploadForm extends ManualUploadData {
  public uploadFormManual: FormGroup;

  constructor(
    public _formBuilder: FormBuilder,
    public reportManualUploaderService: ReportManualUploaderService,
    public unavailabilityRange = {
      max: new Date(),
      min: new Date('2018-12-01')
    }
  ) {
    super(reportManualUploaderService);
  }

  creatForm() {
    this.getDataServer();
    this.uploadFormManual = this._formBuilder.group({
      publisher: [
        "",
        [
          Validators.required,
          Validators.maxLength(50),
          this.validatorForPublishers(this.publishers)
        ]
      ],
      domain: [
        '',
        [
          Validators.required,
          Validators.maxLength(50)
          // this.validatorForDomains(this.domains)
        ]
      ],
      tags: [
        '',
        [
          Validators.required,
          Validators.maxLength(50)
          // this.validatorForPlacements(this.properties)
        ]
      ],
      inventory_type: [
        "",
        [
          Validators.required,
          this.validatorForTypes(this.types),
          Validators.maxLength(50)
        ]
      ],
      report_origin: [
        '',
        [
          Validators.required,
          Validators.maxLength(50)
          // this.validatorForProgrammatics(this.originsOfPublisher)
        ]
      ],
      day: ['', [Validators.required, this.validatorForDate()]],
      inventory_sizes: this._formBuilder.group({
        width: [
          { value: '', disabled: false },
          [Validators.required, Validators.pattern(/^[0-9]{0,4}$/), Validators.min(0), Validators.max(4096)]
        ],
        height: [
          { value: '', disabled: false },
          [Validators.required, Validators.pattern(/^[0-9]{0,4}$/), Validators.min(0), Validators.max(3072)]
        ]
      }),
      ad_request: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{0,10}$/),
          this.validatorForRequests(this.uploadFormManual)
        ]
      ],
      matched_request: ['', [Validators.required, Validators.pattern(/^[0-9]{0,10}$/)]],
      clicks: ['', [Validators.required, Validators.pattern(/^[0-9]{0,10}$/)]],
      ecpm: ['', [Validators.required, Validators.pattern(/^(([0-9]{0,10})|([0-9]{0,10}[.]{1,1}[0-9]{1,5}))$/)]]
    });
  }
}
