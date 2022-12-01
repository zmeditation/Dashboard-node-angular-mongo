import { Helpers } from '../../../_services-and-helpers/helpers';
import { DataTransitionService } from '../../../_services-and-helpers/data-transition.service';
import { HttpClient } from '@angular/common/http';
import { CrudService } from 'shared/services/cruds/crud.service';
import { User } from 'shared/interfaces/users.interface';
import { Subscription } from 'rxjs';

export class GetDataForPanels extends Helpers {
  protected user?: User;

  public subscriptions: Subscription = new Subscription();

  public propByPlacements = [];

  public displayedExpansionPanel: any[] = [];

  public properties = { include: [], exclude: [], usersProperties: [] };

  public tempProperties = [];

  public isSaved = false;

  public vacantProperties: Array<any> = [];

  constructor(public transitServiceHelp: DataTransitionService, public http: HttpClient, public crud: CrudService) {
    super(transitServiceHelp);
  }

  getData() {
    // this.isSaved = false;
    // this.userData = this.savedObjLocSt;
    // this.getDataForTable();

    this.isSaved = false;
    this.properties.usersProperties = this.user.properties;
    this.tempProperties = this.user.properties;
    this.getDataForTable();
  }

  getAllPropertiesOfUser() {
    this.subscriptions.add(
      this.crud.getUsersUnits(this.user?._id).subscribe((data: Array<any>) => {
        this.properties.usersProperties = data;
        this.tempProperties = data;
        this.getData();
      })
    );
  }

  getDataForTable() {
    this.propByPlacements = [];
    this.displayedExpansionPanel = [];
    this.properties.include = [];
    this.properties.exclude = [];
    this.properties.usersProperties = this.user.properties;
    this.tempProperties = this.user.properties;

    this.properties.usersProperties.forEach((e) => {
      if (!this.propByPlacements[e.placement_name]) {
        this.propByPlacements[e.placement_name] = [e];
        if (this.isSaved === true) {
          this.displayedExpansionPanel.push({
            name: e.placement_name,
            save: false,
            open: false
          });
        } else {
          this.displayedExpansionPanel.push({
            name: e.placement_name,
            save: false,
            open: false
          });
        }


      } else if (this.propByPlacements[e.placement_name]) {
        this.propByPlacements[e.placement_name].push(e);
      }
      this.displayedExpansionPanel.sort(this.sortFunc);
    });
    return this.propByPlacements;
    //
    // // this.getAllPropertiesOfUser();
    // this.propByPlacements = [];
    // this.displayedExpansionPanel = [];
    // // this.savedObjLocSt = JSON.parse(sessionStorage.getItem('user_prop_temp'));
    // this.properties.include = [];
    // this.properties.exclude = [];
    //
    // // this.properties.usersProperties = this.user['properties'];
    // // this.tempProperties = this.user['properties'];
    // this.userData = this.savedObjLocSt;
    // this.properties.usersProperties.forEach( (e) => {
    //   if (!this.propByPlacements[e.placement_name]) {
    //     this.propByPlacements[e.placement_name] = [e];
    //     if (this.isSaved === true) {
    //       this.displayedExpansionPanel.push({name: e.placement_name, save: false, open: false});
    //     } else {
    //       this.displayedExpansionPanel.push({name: e.placement_name, save: false, open: false});
    //     }
    //   } else if (this.propByPlacements[e.placement_name]) {
    //     this.propByPlacements[e.placement_name].push(e);
    //   }
    //   this.displayedExpansionPanel.sort(this.sortFunc);
    // });
    // return this.propByPlacements;
  }

  // getVacantById() {
  //
  //   return this.http.get(`${environment.apiURL}/users/vacant-properties/${this.savedObjLocSt.id}`)
  //     .subscribe(data => {
  //
  //       if (data['success']) {
  //         this.vacantProperties = data['result'];
  //       }
  //
  //   });
  //
  // }

  sortFunc(a, b) {
    if (a.name.toLowerCase() > b.name.toLowerCase()) { return 1; }
    if (a.name.toLowerCase() < b.name.toLowerCase()) { return -1; }
    return 0;
  }
}
