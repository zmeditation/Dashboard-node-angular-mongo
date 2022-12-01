import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { CrudService } from '../../services/crud.service';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { FlashMessagesService } from 'shared/services/flash-messages.service';
import { RXBox } from 'rxbox';
import { WbidService } from '../../services/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from "rxjs/Rx";
import { EditQuery } from "../../services/models";

export type WbidTag = {
  tags: {
    fulltag: string,
    passbacktag?: string
  },
  name?: string
}

@Component({
  selector: 'app-show-tags',
  templateUrl: './show-tags.component.html',
  styleUrls: ['./show-tags.component.scss']
})

export class ShowTagsComponent implements OnInit, OnDestroy {
  route: string;

  href = '';

  tags: { fulltag: string; passbackTag?: string };

  fulltag: string;

  passbacktag: string;

  ready = false;

  success = '';

  error = '';

  id = '';

  reqParams: any;

  isPrebidUser: boolean;

  clipBoardData = 'copy_tag';

  socketId: string;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private location: Location,
    private router: Router,
    private crudService: CrudService,
    private flashMessage: FlashMessagesService,
    private store: RXBox,
    private shared: WbidService,
    private translate: TranslateService
  ) {
  }

  async ngOnInit() {
    if (!this.store.getState().query) {
      this.flashMessage.flash('error', this.translate.instant('WBID.PROPERTIES.SHOW_TAG.INCORRECT_QUERY'), 3000, 'center');
      this.router.navigate(['wbid']).catch((e) => console.error(e.message || e));
    }

    if (!Object.keys(this.store.getState()).length) {
      const {id, isPrebidUser, userType, name, role, dashboardId} = await this.shared.getAndSaveUserData();
      this.store.assignState({
        id,
        isPrebidUser,
        userType,
        name,
        role,
        dashboardId
      });
    }

    this.route = this.store.getState().route;
    if (this.store.getState().placementType) {
      this.isPrebidUser = this.store.getState().placementType === 'prebid';
    } else {
      this.isPrebidUser = this.store.getState().userType ? this.store.getState().userType.includes('prebid') : undefined;
    }
    const query = this.store.getState().query;

    if (query) {
      if (query.siteId) {
        this.href = 'configs';
        this.reqParams = {
          siteId: query.siteId,
          userId: query.userId,
          name: query.name
        };
      } else if (query.userId) {
        this.href = 'sites';
        this.reqParams = {
          userId: query.userId,
          name: query.name
        };
      }
      this.sendRequest(this.route);
    }
  }

  copyToClipBoard(button): void {
    let copyText: HTMLTextAreaElement = document.querySelector('#fulltag');
    if (copyText === null) {
      copyText = document.querySelector('#full-tag');
    }
    copyText.select();
    document.execCommand('copy');
    button.disabled = true;
    this.clipBoardData = 'Copied';
  }

  sendRequest(route: string): void {
    const req = this.store.getState().query;
    if (sessionStorage.getItem('socketId') !== null) {
      this.socketId = JSON.parse(sessionStorage.getItem('socketId')).socket;
    }
    if (req.typeOfConfig && req.typeOfConfig === 'prebid' && route === 'addConfigToUser') {
      this.addPrebidConfig(req);
    } else if (route === 'getShortTag') {
      this.addShortPrebidConfig(req);
    } else if (route === 'addConfigToUser' && req.typeOfConfig && req.typeOfConfig === 'postbid') {
      this.addConfigToUser(req);
    } else if (this.isPrebidUser && route === 'editPostbidConfig') {
      this.editPrebidConfig(req);
    } else {
      this.editPostBidConfig(req);
    }
  }

  addPrebidConfig(req) {
    this.subscriptions.add(
      this.crudService
        .addPrebidConfig(req, this.socketId)
        .pipe(catchError((err: HttpErrorResponse) => {
          return throwError(err);
        }))
        .subscribe((data: WbidTag) => {
          if (data.name === 'Error') {
            this.flashMessage.flash('error', this.translate.instant('WBID.PROPERTIES.SHOW_TAG.CONFIG_ERROR'), 3000, 'center');
            this.router.navigate(['wbid']).catch((e) => console.error(e));
            return;
          }
          this.ready = true;
          this.tags = data.tags;
          this.fulltag = this.tags.fulltag;
          this.success = this.translate.instant('WBID.PROPERTIES.SHOW_TAG.CONFIG_SAVED');
          this.store.assignState({ query: {} });
        },
        (err) => {
          this.ready = true;
          this.error = err.error;
        }));
  }

  addShortPrebidConfig(req: EditQuery) {
    this.crudService
      .getShortTag(req, this.socketId)
      .pipe(catchError((err: HttpErrorResponse) => {
        return throwError(err);
      }))
      .subscribe(
        (data: WbidTag) => {
          this.handleResponse(data);
        },
        (err) => {
          this.ready = true;
          this.error = err.error;
        });
  }

  addConfigToUser(req: EditQuery) {
    this.subscriptions.add(this.crudService
      .addConfigToUser(req, this.socketId)
      .pipe(catchError((err: HttpErrorResponse) => {
        return throwError(err);
      }))
      .subscribe((data: WbidTag) => {
        this.handleResponse(data);
      },
      (err) => {
        this.ready = true;
        this.error = err.error;
      }));
  }

  editPrebidConfig(req: EditQuery) {
    this.subscriptions.add(this.crudService
      .editPrebidConfig(req, this.socketId)
      .pipe(catchError((err: HttpErrorResponse) => {
        return throwError(err);
      }))
      .subscribe((data: any) => {
        this.updateConfigHandler(data);
      },
      (err) => {
        this.ready = true;
        this.error = err.error;
      }));
  }

  editPostBidConfig(req: EditQuery) {
    this.subscriptions.add(this.crudService
      .editPostbidConfig(req, this.socketId)
      .pipe(catchError((err: HttpErrorResponse) => {
        return throwError(err);
      }))
      .subscribe((data: any) => {
        this.updateConfigHandler(data);
      },
      (err) => {
        this.ready = true;
        this.error = err.error;
      }))
  }

  updateConfigHandler(data) {
    this.ready = true;
    this.success = this.translate.instant('WBID.PROPERTIES.SHOW_TAG.CONFIG_UPDATED');
    this.router.navigate(['wbid', 'configs'], {
      queryParams: {
        siteId: data.siteId,
        userId: data.userId,
        name: data.name
      }
    }).catch((e) => console.error(e));
  }

  handleResponse(data: WbidTag): void {
    if (data.name === 'Error') {
      this.flashMessage.flash('error', this.translate.instant('WBID.PROPERTIES.SHOW_TAG.CONFIG_ERROR'), 3000, 'center');
      this.router.navigate(['wbid']).catch((e) => console.error(e));
      return;
    }
    this.ready = true;
    this.tags = data.tags;
    this.fulltag = this.tags.fulltag;
    this.passbacktag = this.tags.passbackTag;
    this.success = this.translate.instant('WBID.PROPERTIES.SHOW_TAG.CONFIG_SAVED');
    this.store.assignState({ query: {} });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe()
  }
}
