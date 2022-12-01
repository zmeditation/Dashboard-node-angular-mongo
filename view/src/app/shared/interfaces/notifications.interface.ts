import { Roles } from '../../views/pages/settings/permissions/interfaces';
import { ErrorMessageFromServer } from './common.interface';
import { ThemePalette } from '@angular/material/core';

export type GetNoticesByUserIdQuery = {
  userId: string;
}

export type UserDataForSocket = {
  id: string;
  name: string;
  role: string;
}

export type Notification = {
  _id: string;
  createdAt: Date;
  isWatched: boolean;
  msg: {
    event?: string;
    text?: string;
    trigger?: string;
    typeMsg?: string;
    success?: boolean;
    file?: string;
    action?: string;
    pub?: string;
    cancelReason?: string;
    publisher?: string;
  };
}

export type NotificationForUI = {
  type: string;
  typeDB: string;
  icon: string;
  color: ThemePalette;
  notifications: Notification[];
}

export type NotificationResByUserId = {
  success: boolean;
  error: null | string;
  userNotifications: {
    billingNf: Notification[];
    systemNf: Notification[];
    userNf: Notification[];
    userId: string;
  };
}

export type DeleteNotificationQuery = {
  msgId: string;
}

export type DeleteNoticesCollectionsQuery = {
  userId: string;
  msgTypes: string[];
}

export type ValidResOfDeleteMsg = {
  error: null|any;
  deletedCount: number;
}

export type ReceiveMsgBySocket = {
  msgType: string;
  message: string;
}

export type UserDataForCreateMessage = {
  _id: string;
  name: string;
  role: Roles;
}

export type GetUsersResponseForNotice = {
  success: boolean;
  publishers: UserDataForCreateMessage[];
}

export type CreateNewMessage = {
  msg: {
    event: string;
    text: string;
  };
  msgType: string;
  usersId: string[] | undefined;
  userRoles: string[];
}

export type CreatedMessageResponse = {
  error: null | ErrorMessageFromServer;
  createdMsgs: number;
}
