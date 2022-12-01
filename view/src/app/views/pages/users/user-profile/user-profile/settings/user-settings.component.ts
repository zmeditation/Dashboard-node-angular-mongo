import { Component, OnInit, OnDestroy } from '@angular/core';
import { FileItem, FileUploader } from 'ng2-file-upload';
import { Subscription } from 'rxjs';
import { EventCollectorService } from 'shared/services/event-collector/event-collector.service';
import { FlashMessagesService } from 'shared/services/flash-messages.service';
import { egretAnimations } from 'shared/animations/egret-animations';
import { environment } from '../../../../../../../environments/environment';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
  animations: egretAnimations
})
export class UserSettingsComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();

  public hasAvatar = false;

  private userid: string;

  public userAvatar: string;

  public userImgFolder = environment.publicFolder + '/images/pp/';


  public uploader: FileUploader = new FileUploader({
    url: environment.apiURL + '/users/photo/' + this.userid
  });

  public hasBaseDropZoneOver = false;

  constructor(private event: EventCollectorService, private flashMessage: FlashMessagesService) {}

  ngOnInit() {
    this.subscriptions.add(
      this.event.managedUserInfo$.subscribe((data) => {
        this.userid = data._id;
      })
    );

    this.subscriptions.add(
      this.event.manageUserAvatar$.subscribe((avatar) => {
        this.userAvatar = avatar;

        if (this.userAvatar) { this.hasAvatar = true; }


        this.uploader = new FileUploader({
          url: environment.apiURL + '/users/photo/' + this.userid,
          authTokenHeader: 'Authorization',
          authToken: localStorage.getItem('currentUser')
        });

        this.uploader.onAfterAddingFile = (fileItem: FileItem) => this.onAfterAddingFile(fileItem);

        this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
          const responseObject = JSON.parse(response);

          this.event.pushUserAvatar(responseObject.photo);

          localStorage.setItem('ua', responseObject.photo);

          this.userAvatar = responseObject.photo;

          if (responseObject.photo) {
            this.flashMessage.flash('success', 'Avatar Updated', 3500, 'top');

            this.hasAvatar = true;
          } else {
            this.flashMessage.flash('error', 'Something went wrong', 3500, 'top');

            this.hasAvatar = false;
          }
        };
      })
    );
  }

  public showPictureUploader(): void {
    this.hasAvatar = false;
  }

  onAfterAddingFile(fileItem: FileItem) {
    const latestFile = this.uploader.queue[this.uploader.queue.length - 1];
    this.uploader.queue = [];
    this.uploader.queue.push(latestFile);
    if (this.uploader.queue[0].file.size > 1000000) {
      this.uploader.queue = [];
      this.flashMessage.flash('error', 'File size more than 1 MB. Please, select another', 4000, 'top');
    }
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
