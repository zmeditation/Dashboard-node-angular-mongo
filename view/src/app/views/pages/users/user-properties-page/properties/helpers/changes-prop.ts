import { FormBuilder } from '@angular/forms';
import { DataTransitionService } from '../../../_services-and-helpers/data-transition.service';
import { SendToServer } from './send-to-server';
import { FlashMessagesService } from 'shared/services/flash-messages.service';
import { CrudService } from 'shared/services/cruds/crud.service';
import { HttpClient } from '@angular/common/http';
import { UsersEndpointsService } from 'shared/services/cruds/users-endpoints.service';
import { AppLoaderService } from 'shared/services/app-loader/app-loader.service';

export class ChangesProp extends SendToServer {
  public showEdit = [];

  public disableButtonToSendToServer = false;

  public willDelete = [];

  constructor(
    public fb: FormBuilder,
    public crudService: CrudService,
    public transitServiceHelp: DataTransitionService,
    public flashMessage: FlashMessagesService,
    public http: HttpClient,
    protected usersEndpoints: UsersEndpointsService,
    public loader: AppLoaderService
  ) {
    super(fb, crudService, transitServiceHelp, flashMessage, http, usersEndpoints, loader);
  }

  editProperties(property, index) {
    if (this.showEdit[index] === true) {
      this.showEdit[index] = false;
      return;
    } else {
      for (let i = 0; i < this.properties.usersProperties.length; i++) { this.showEdit[this.properties.usersProperties[i]._id] = false; }

      this.showEdit[index] = true;
    }
    this.sendEditable(true);
    this.disableButtonToSendToServer = true;
    this.buildPropertiesForm(property);
  }

  checkOnUID(obj) {
    const checkingForRepeats = this.properties.usersProperties.some((i) => {
      if (i.placement_name === obj.value.placement_name) {
        const checkName = i.property_id + i.property_origin,
          placementNamePlusOrigin = obj.value.property_id + obj.value.property_origin;
        return checkName === placementNamePlusOrigin;
      }
      return false;
    });
    if (checkingForRepeats) {
      obj.get('property_id').setErrors({ incorrect: true });
      this.flashMessage.flash('error', `Unit with this property id and origin (programmatic) already exist.`, 5000, 'top');
      return false;
    }
    return true;
  }

  addProperties(placement) {
    placement.value.property_id = placement.value.property_id.trim();
    if (this.checkOnUID(placement)) {
      this.properties.usersProperties.unshift(placement.value);
      this.properties.include.push(placement.value);
      this.properties.usersProperties.forEach((e) => {
        this.showEdit[e._id] = false;
        if (!this.propByPlacements[e.placement_name]) {
          this.propByPlacements[e.placement_name] = [e];
          e._id = placement.value.property_id + placement.value.property_origin;
          if (e._id === placement.value.property_id + placement.value.property_origin) {
            this.displayedExpansionPanel.push({
              name: e.placement_name,
              save: true,
              open: false
            });
          } else {
            this.displayedExpansionPanel.push({
              name: e.placement_name,
              save: false,
              open: false
            });
          }


        } else if (this.propByPlacements[e.placement_name] && !e._id) {
          e._id = placement.value.property_id + placement.value.property_origin;
          this.propByPlacements[e.placement_name].push(e);
          this.displayedExpansionPanel.forEach((i) => {
            if (i.name === e.placement_name) { i.save = true; }

          });
        }
        this.displayedExpansionPanel.sort(this.sortFunc);

        this.propertiesAddForm.reset();
      });
      return this.propByPlacements;
    }
  }

  saveProperties(property, index) {
    this.properties.usersProperties.forEach((i) => {
      this.showEdit[i._id] = false;
      if (i._id === index) {
        i = Object.assign(i, property.value);
        this.displayedExpansionPanel.forEach((e) => {
          if (e.name === i.placement_name) { e.save = true; }

        });
      }
    });
    this.disableButtonToSendToServer = false;
  }

  resetProperties() {
    for (let i = 0; i < this.properties.usersProperties.length; i++) { this.showEdit[this.properties.usersProperties[i]._id] = false; }

    this.disableButtonToSendToServer = false;
  }

  deleteProperties(property) {
    for (let i = 0; i < this.properties.usersProperties.length; i++) {
      this.showEdit[this.properties.usersProperties[i]._id] = false;
      this.willDelete[this.properties.usersProperties[i]._id] = false;

      if (property._id === this.properties.usersProperties[i]._id) {
        this.willDelete[this.properties.usersProperties[i]._id] = true;
        this.properties.exclude.push(this.properties.usersProperties[i]);
      }
    }
    this.sendFunc('properties', this.properties.usersProperties);
    this.properties.usersProperties = this.properties.usersProperties.filter((prop) => prop._id !== property._id);
    this.displayedExpansionPanel.forEach((e) => {
      if (e.name === property.placement_name) { e.save = true; }

    });
  }
}
