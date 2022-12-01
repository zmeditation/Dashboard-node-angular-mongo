import { Component, OnInit, OnDestroy } from '@angular/core';
import { CrudService } from '../services/crud.service';
import { FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { RXBox } from 'rxbox';
import { WbidService } from '../services/shared.service';
import { FlashMessagesService } from 'shared/services/flash-messages.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dfpstart-screen',
  templateUrl: './dfpstart-screen.component.html',
  styleUrls: ['./dfpstart-screen.component.scss']
})
export class DFPStartScreenComponent implements OnInit, OnDestroy {
  networkForm = new FormControl('', [Validators.required, Validators.pattern('\\d{6,15}')]);

  private unsubscribe$ = new Subject();

  constructor(
    private crudService: CrudService,
    private router: Router,
    private store: RXBox,
    private shared: WbidService,
    private flashMessage: FlashMessagesService,
    public translate: TranslateService
  ) {}

  async ngOnInit() {
    this.translate.get('WBID.PROPERTIES.INTEGRATION.WELCOME').subscribe((welcomeMessage) => {
      this.flashMessage.flash('success', welcomeMessage, 3000, 'center');
    });

    if (!Object.keys(this.store.getState()).length) {
      const { id, isPrebidUser, userType, name, role, dashboardId } = await this.shared.getAndSaveUserData();
      this.store.assignState({
        id,
        isPrebidUser,
        userType,
        name,
        role,
        dashboardId
      });
    }
  }

  integrate(): void {
    this.crudService
      .checkAuth(this.networkForm.value, JSON.parse(sessionStorage.getItem('socketId')).socket)
      .takeUntil(this.unsubscribe$)
      .subscribe(
        (data) => {
          if (data.url) { this.router.navigate(data.url).catch((e) => console.error(e)); } 
          
        },
        (err) => console.error(err.error || err)
      );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
