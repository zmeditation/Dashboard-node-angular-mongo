import { AfterViewChecked, Component, Input, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { formatDate } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DateAdapter } from '@angular/material/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { Subscription } from 'rxjs';
import { egretAnimations } from 'shared/animations/egret-animations';
import { AppTranslationService } from 'shared/services/translation/translation.service';
import { ReportsService } from '../../services/reports.service';
import { ReportViewerQueryBuilderService } from '../../../helpers/report-viewer-query-builder.service';
import { FormIntervalsType } from 'shared/types/reports';
import { EventCollectorService } from 'shared/services/event-collector/event-collector.service';

@Component({
  selector: 'app-report-viewer-query-builder-basic',
  templateUrl: './report-viewer-query-builder-basic.component.html',
  styleUrls: ['./report-viewer-query-builder-basic.component.scss'],
  animations: egretAnimations
})
export class ReportViewerQueryBuilderBasicComponent implements OnInit, AfterViewChecked, OnDestroy {
  @Input() basicForm;

  @Input() intervalObjectArray;

  @Input() rangeObjectArray: Array<FormIntervalsType>;

  customRange = false;

  unavailabilityRange = {
    max: new Date(),
    min: new Date('2018-12-01'),
    minPermanent: new Date('2018-12-01'),
    maxPermanent: new Date()
  };

  public possibleTypes: Array<string> = [];

  public canSeeReportTypeSelector = true;

  protected previousDateTo;

  protected previousDateFrom;

  protected subscriptions: Subscription = new Subscription();

  protected isAdWMGAdapterUser = false;

  public constructor(
    protected queryBuilderService: ReportViewerQueryBuilderService,
    protected breakpointObserver: BreakpointObserver,
    protected cdRef: ChangeDetectorRef,
    protected reportsService: ReportsService,
    protected permissionsService: NgxPermissionsService,
    protected dateAdapter: DateAdapter<any>,
    protected appTranslation: AppTranslationService,
    protected event: EventCollectorService
  ) {
    this.possibleTypes = this.reportsService.types;

    this.handleDatepickerLang();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnInit() {
    this.setAccessToReports();
    this.buildBasicForm();
    this.checkAdWMGAdapterStatus();

    this.subscriptions.add(
      this.basicForm.get('dateTo').valueChanges.subscribe((change) => {
        if (this.previousDateTo !== change) {
          this.previousDateTo = change;
          this.setLimitForCustomDate();
        }
      })
    );
    this.subscriptions.add(
      this.basicForm.get('dateFrom').valueChanges.subscribe((change) => {
        if (this.previousDateFrom !== change) {
          this.previousDateFrom = change;
          this.setLimitForCustomDate();
        }
      })
    );

    this.subscriptions.add(
      this.basicForm.get('range').valueChanges.subscribe((value) => {
        this.toggleDailyInterval(value);
      })
    );
  }

  protected handleDatepickerLang() {
    this.dateAdapter.setLocale(this.appTranslation.lang);

    this.subscriptions.add(
      this.appTranslation.langSubject.subscribe((lang: string) => {
        this.dateAdapter.setLocale(lang);
      })
    );
  }

  buildBasicForm(): void {
    this.subscriptions.add(
      this.queryBuilderService.isCommissionOptionOn$.subscribe((value) => {
        if (value) {
          this.basicForm.get('range').setValue('lastSevenDays');
          this.basicForm.get('interval').setValue('total');
          const basicObject = this.basicForm.getRawValue();
          basicObject.dateFrom = ReportViewerQueryBuilderBasicComponent.formatDate(basicObject.dateFrom);
          basicObject.dateTo = ReportViewerQueryBuilderBasicComponent.formatDate(basicObject.dateTo);
        }
      })
    );

    this.subscriptions.add(
      this.basicForm.valueChanges.subscribe(() => {
        const basicObject = this.basicForm.getRawValue();
        basicObject.dateFrom = ReportViewerQueryBuilderBasicComponent.formatDate(basicObject.dateFrom);
        basicObject.dateTo = ReportViewerQueryBuilderBasicComponent.formatDate(basicObject.dateTo);
        basicObject.range === 'custom' ? (this.customRange = true) : (this.customRange = false);
        this.queryBuilderService.sendBasicForm(basicObject);
      })
    );
  }

  setAccessToReports() {
    const userPerms = Object.keys(this.permissionsService.getPermissions());
    const allAcceptedPerms = userPerms.filter((el) => {
      return el === 'canReadAllReports' || el === 'canReadAllPubsReports' || el === 'canReadOwnPubsReports';
    });
    if (!allAcceptedPerms.length) {
      this.basicForm.get('type').disable();
    }
    if (!allAcceptedPerms.length && ((userPerms.includes('canSeeDSPoRTBReports')) || userPerms.includes('canSeeSSPoRTBReports'))) {
      this.canSeeReportTypeSelector = false;
    }
  }

  checkAdWMGAdapterStatus() {
    this.event.managedUserInfo$.subscribe(user => {
      this.isAdWMGAdapterUser = !!user.adWMGAdapter;
      if (this.isAdWMGAdapterUser) {
        this.basicForm.get('type').enable();
        this.possibleTypes = ['main', 'oRTB'];
      }
    })
  }

  get isMobile() {
    return this.breakpointObserver.isMatched('(max-width: 767px)');
  }

  static formatDate(date): string {
    if (!date) {
      return '';
    }

    return formatDate(date, 'yyyy-MM-dd', 'en-US');
  }

  setLimitForCustomDate() {
    if (this.basicForm.get('dateFrom').value !== '') {
      const dateFromForm = new Date(this.basicForm.get('dateFrom').value);
      const newMaxDate = new Date(new Date(dateFromForm).setFullYear(dateFromForm.getFullYear() + 1));
      this.unavailabilityRange.max =
        this.unavailabilityRange.maxPermanent.getTime() > newMaxDate.getTime() ? newMaxDate : this.unavailabilityRange.maxPermanent;
      this.unavailabilityRange.min = dateFromForm;
      if (new Date(this.basicForm.get('dateTo').value).getTime() < dateFromForm.getTime()) {
        this.basicForm.get('dateTo').setValue('');
      }
    }
  }

  changeType(type) {
    this.reportsService.changeTypeOfReport(type);
  }

  private toggleDailyInterval(range) {
    const isRangeSixtyDays = range === 'lastSixtyDays';
    const isDailyInterval = this.basicForm.get('interval').value === 'daily';
    if (isDailyInterval) {
      this.basicForm.get('interval').setValue('total');
    }
    this.intervalObjectArray.forEach(el => {
      if (el.name === 'DAILY') {
        el.enabled = !isRangeSixtyDays;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
