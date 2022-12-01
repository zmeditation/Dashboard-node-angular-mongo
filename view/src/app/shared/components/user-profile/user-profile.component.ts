import { User } from '../../types/users';
import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CrudService } from '../../services/cruds/crud.service';
import { EventCollectorService } from '../../services/event-collector/event-collector.service';
import { Subscription, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  user: User;

  userImgFolder = environment.publicFolder + '/images/pp/';

  userDataLoaded = false;

  constructor(
    public event: EventCollectorService, 
    private crud: CrudService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.subscriptions.add(
      combineLatest([
        this.route.params,
        this.event.managedUserInfo$
      ]).pipe(
        map(([params, user]) => params.id ?? user._id),
        switchMap(userId => this.crud.getUser(userId))
      ).subscribe(({ user }: { user: User }) => {
        this.userDataLoaded = true;
        this.user = user;
      }, () => {
        this.userDataLoaded = true;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
