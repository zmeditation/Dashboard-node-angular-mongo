import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VersionEndpointsService } from 'shared/services/cruds/version-endpoints.service';
import { VersionType, UpdateVersionType } from 'shared/types/version';
import { ValueObject } from 'shared/types/object';
import { EventCollectorService } from 'shared/services/event-collector/event-collector.service';
import { User } from 'shared/types/users';
import { VersionsPopupComponent } from '../popup/versions-popup/versions-popup.component';

@Component({
  selector: 'app-versions',
  templateUrl: './versions.component.html',
  styleUrls: ['./versions.component.scss']
})
export class VersionsComponent implements OnInit, OnDestroy {
  @ViewChild(VersionsPopupComponent)
  protected versionsPopup: VersionsPopupComponent;

  private subscriptions: Subscription = new Subscription();

  public isShowPopup = false;

  public isLoadingVersionList = false;

  public isLoading = false;

  public isClearCreateForm = false;

  public versions: ValueObject[] = [];

  public currentVersion = 'v0.0.0.0';

  public currentVersionReleaseDate = new Date();

  public currentVersionDescription = '';

  public userRole = '';

  public constructor(
    protected versionEndpoints: VersionEndpointsService,
    protected snack: MatSnackBar,
    protected eventCollectorService: EventCollectorService
  ) {}

  ngOnInit() {
    this.subscriptions.add(
      this.eventCollectorService.managedUserInfo$.subscribe((user: User) => {
        this.userRole = user.role;

        this.subscriptions.add(
          this.versionEndpoints.getLastVersion().subscribe(
            (response) => {
              const data = response.data;

              if (data.value) {
                this.currentVersion = data.value;
              }
            },
            (errorResponse) => {
              errorResponse = errorResponse.error;

              if (errorResponse.status !== 404) {
                this.snack.open(errorResponse.error.message, 'OK', { duration: 4000 });
              }
            }
          )
        );
      })
    );
  }

  public showPopup(): void {
    this.isLoadingVersionList = true;

    if (this.currentVersion === 'v0.0.0.0') {
      this.isLoadingVersionList = false;
      this.isShowPopup = true;
    } else {
      this.subscriptions.add(
        this.versionEndpoints.getVersionList(this.userRole).subscribe(
          (response) => {
            this.versions = response.data;

            this.isShowPopup = true;

            this.isLoadingVersionList = false;
          },
          (errorResponse) => {
            errorResponse = errorResponse.error;
            this.isLoadingVersionList = false;

            this.snack.open(errorResponse.error.message, 'OK', { duration: 4000 });
          }
        )
      );
    }
  }

  public changeVersion(event: ValueObject): void {
    this.toggleLoading();

    this.subscriptions.add(
      this.versionEndpoints.getVersionInformation({
        version: event.value,
        userRole: this.userRole
      }).subscribe(
        (response) => {
          this.currentVersionReleaseDate = new Date(response.data.releaseDate);
          this.currentVersionDescription = response.data.description;

          this.toggleLoading();
        },
        (errorResponse) => {
          errorResponse = errorResponse.error;

          this.snack.open(errorResponse.error.message, 'OK', { duration: 6000 });

          this.toggleLoading();
        }
      )
    );
  }

  public createVersion(data: VersionType): void {
    this.toggleLoading();

    this.subscriptions.add(
      this.versionEndpoints.createVersion(data).subscribe(
        (response) => {
          const newVersion: ValueObject = {
            value: response.data.version
          };

          if (this.versions.length) {
            this.versions = [newVersion, ...this.versions];
          } else {
            this.versions.push(newVersion);
            this.versionsPopup.setSelectedVersion(newVersion.value);
            this.currentVersion = newVersion.value;
            this.changeVersion(newVersion);
          }

          this.isClearCreateForm = true;
          // event loop next tick
          setTimeout(() => (this.isClearCreateForm = false), 0);

          this.snack.open('New version created!', 'OK', { duration: 4000 });

          this.toggleLoading();
        },
        (errorResponse) => {
          errorResponse = errorResponse.error;

          if (errorResponse.status === 422) {
            this.snack.open(`${ errorResponse.error.message }: ${ errorResponse.error.fields.join(', ') }`, 'OK', { duration: 6000 });
          } else {
            this.snack.open(errorResponse.error.message, 'OK', { duration: 6000 });
          }

          this.toggleLoading();
        }
      )
    );
  }

  public updateVersion(data: UpdateVersionType): void {
    this.toggleLoading();

    this.subscriptions.add(
      this.versionEndpoints.updateVersion(data).subscribe(
        (response) => {
          if (data.lastVersion !== response.data.version) {
            this.versions = this.versions.map((element) => {
              if (data.lastVersion === element.value) {
                return {
                  value: response.data.version
                };
              }
              return element;
            });
            this.versionsPopup.setSelectedVersion(response.data.version);
          }

          this.currentVersionReleaseDate = new Date(response.data.releaseDate);
          this.currentVersionDescription = response.data.description;

          this.toggleLoading();
        },
        (errorResponse) => {
          errorResponse = errorResponse.error;

          if (errorResponse.status === 422) {
            this.snack.open(`${ errorResponse.error.message }: ${ errorResponse.error.fields.join(', ') }`, 'OK', { duration: 6000 });
          } else {
            this.snack.open(errorResponse.error.message, 'OK', { duration: 6000 });
          }

          this.toggleLoading();
        }
      )
    );
  }

  public deleteVersion(data: ValueObject): void {
    this.toggleLoading();

    this.subscriptions.add(
      this.versionEndpoints.deleteVersion(data.value).subscribe(
        (_response) => {
          this.versions = this.versions.filter((element) => element.value !== data.value);

          if (this.versions.length) {
            const currentVersion = this.versions[0];

            this.versionsPopup.setSelectedVersion(currentVersion.value);

            this.changeVersion(currentVersion);
          } else {
            this.currentVersion = 'v0.0.0.0';
            this.currentVersionReleaseDate = new Date();
            this.currentVersionDescription = '';
            this.versionsPopup.setSelectedVersion('');
          }

          this.toggleLoading();
        },
        (errorResponse) => {
          errorResponse = errorResponse.error;

          this.snack.open(errorResponse.error.message, 'OK', { duration: 6000 });

          this.toggleLoading();
        }
      )
    );
  }

  protected toggleLoading(): void {
    this.isLoading = !this.isLoading;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
