import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { CrudService } from 'shared/services/cruds/crud.service';
import { DataTransitionService } from '../../_services-and-helpers/data-transition.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'shared/services/flash-messages.service';
import { ChangesProp } from './helpers/changes-prop';
import { HttpClient } from '@angular/common/http';
import { UsersEndpointsService } from 'shared/services/cruds/users-endpoints.service';
import { AppLoaderService } from 'shared/services/app-loader/app-loader.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent extends ChangesProp implements OnInit, OnDestroy {
  loading = true;

  displayedColumns: string[] = ['placement_name', 'property_id', 'property_origin', 'property_description', 'actions'];

  dataSource = {};

  searchFormControl = new FormControl();

  @ViewChild(MatAutocompleteTrigger)
  autoTrigger: MatAutocompleteTrigger;

  @Input() propertiesAddForm;

  constructor(
    private route: ActivatedRoute,
    public fb: FormBuilder,
    public crudService: CrudService,
    public transitServiceHelp: DataTransitionService,
    public router: Router,
    public flashMessage: FlashMessagesService,
    public http: HttpClient,
    protected usersEndpoints: UsersEndpointsService,
    public loader: AppLoaderService
  ) {
    super(fb, crudService, transitServiceHelp, flashMessage, http, usersEndpoints, loader);
  }

  ngOnInit() {
    this.subscriptions.add(
      this.route.params.pipe(
        switchMap(params => this.usersEndpoints.getUser(params.id))
      ).subscribe(({ user }) => {
        this.user = user;

        // this.getAllPropertiesOfUser();
        this.getData();
        // this.getDataForTable();
        this.buildPropertiesForm();
        this.buildPropertiesAddForm();
        this.getOriginProps();
        this.getVacantProperties();
        this.propertiesAddForm.controls.placement_name.statusChanges.subscribe((data) => {
          this.warnClass = data === 'INVALID' ? { color: 'green' } : { color: 'red' };
        });

        this.loading = false;
      }, error =>
        this.flashMessage.flash('error', error.message ?? error.toString(), 3000, 'bottom')
      )
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  getVacantProperties() {
    this.subscriptions.add(
      this.crudService.getVacantById(this.user?._id).subscribe((data: any) => {
        if (data !== null && data.success) {
          this.vacantProperties = data.result;
        } else {
          this.vacantProperties = [];
        }
      })
    );
  }

  sendKeyOfPlacement(key) {
    key.open = true;
    this.dataSource[key.name] = new MatTableDataSource(this.propByPlacements[key.name]);
    this.displayedExpansionPanel.forEach((panel) => {
      if (panel.name !== key.name) {
        panel.open = false;
      }
    });
  }

  backToUsers() {
    this.router.navigate(['users']).catch(e => console.error(e));
  }
}
