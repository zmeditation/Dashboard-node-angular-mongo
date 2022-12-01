import { Component, EventEmitter, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiHttpService } from '../../../reports/api-management/api-services/api-http.service';
import { Subscription } from 'rxjs';
import { ROLES } from 'shared/interfaces/roles.interface';
import { CrudService } from 'shared/services/cruds/crud.service';
import { defaultVastUrlParams } from '../../vast-generator/data/vast-generator-default-data';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IVideoPlayerParamsInterface } from './interfaces/video-player-params.interface';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Publisher } from "shared/interfaces/common.interface";
import { FILTER_IDS } from "../../../../../wmg_modules/statistics/main-filter/filter-request-services/filter-request-ids";
import { FilterRequestService } from "../../../../../wmg_modules/statistics/main-filter/filter-request-services/filter-request.service";
import { ReplaySubject } from "rxjs/ReplaySubject";

const MAX_STRING_LENGTH = 140;
const SIZE = 300;
const SNACKBAR_LIFETIME = 3000;

@Component({
  selector: 'app-video-player-generator-controls',
  templateUrl: './video-player-generator-controls.component.html',
  styleUrls: ['./video-player-generator-controls.component.scss']
})
export class VideoPlayerGeneratorControlsComponent implements OnInit, OnDestroy {
  public form: FormGroup;

  public pubsFilter: FormControl = new FormControl();

  public filteredPubs: ReplaySubject<Publisher[]> = new ReplaySubject<Publisher[]>(1);

  public publishersList: Publisher[] = [];

  public readonly controls = {
    publisher: new FormControl('', [Validators.required, Validators.maxLength(MAX_STRING_LENGTH)]),
    vastUrl: new FormControl(defaultVastUrlParams.pageUrl, [Validators.required, Validators.maxLength(2083)]),
    width: new FormControl(SIZE, [Validators.min(1), Validators.max(2000)]),
    height: new FormControl(SIZE, [Validators.min(1), Validators.max(2000)])
  };

  public readonly ROLES = ROLES;

  private subscription = new Subscription();

  @Output()
  public onChange = new EventEmitter<IVideoPlayerParamsInterface>();

  constructor(
    public apiHttpService: ApiHttpService,
    public crudService: CrudService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private crud: CrudService,
    private filterRequestService: FilterRequestService
  ) {
    this.form = new FormGroup({
      publisherControl: this.controls.publisher,
      vastUrlControl: this.controls.vastUrl,
      widthControl: this.controls.width,
      heightControl: this.controls.height
    });
  }

  public ngOnInit(): void {

    const getAllPubsSub = this.filterRequestService
      .getFilterResultsById(FILTER_IDS.ALL_PUBS)
      .subscribe((data) => {
        this.publishersList = data.results.filter((publisher) => publisher.enabled);
        this.filterPubs();
      });

    this.subscription.add(getAllPubsSub);

    const pubsFiltersSub = this.pubsFilter.valueChanges
      .subscribe(() => {
        this.filterPubs();
      });

    this.subscription.add(pubsFiltersSub);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.publishersList && changes.publishersList.currentValue?.length) {
      this.filteredPubs.next(this.publishersList.slice());
    }
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public onError(error: Error): void {
    this.snackBar.open(error.message || error.toString(), undefined, {
      panelClass: 'warn',
      duration: SNACKBAR_LIFETIME
    });
  }

  _reset(e: Event): void {
    this.form.controls.publisherControl.patchValue('');
    e.stopPropagation();
  }

  private filterPubs(): void {
    if (!this.publishersList) {
      return;
    }

    let search = this.pubsFilter.value;
    if (!search) {
      this.filteredPubs.next(this.publishersList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredPubs.next(
      this.publishersList.filter((pub: Publisher) => pub.name.toLowerCase().indexOf(search) > -1)
    );
  }

  public onSubmit(): void {
    const result: IVideoPlayerParamsInterface = {
      width: this.controls.width.value,
      height: this.controls.height.value,
      vastUrl: this.controls.vastUrl.value,
      publisher: this.controls.publisher.value.id
    };
    if (this.form.valid) {
      this.onChange.emit(result);
    } else {
      const text = this.translate.instant('VALIDATION_ERRORS.FAILED');
      this.snackBar.open(text, undefined, {
        panelClass: 'warn',
        duration: SNACKBAR_LIFETIME
      });
    }
  }
}
