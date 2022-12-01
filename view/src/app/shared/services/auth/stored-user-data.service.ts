// import { Injectable } from '@angular/core';
// import * as CryptoJS from 'crypto-js';
//
// export interface StoredUserDataInt {
//   name: string;
//   role: string;
//   id: string;
// }
//
// @Injectable({ providedIn: 'root' })
// export class StoredUserData {
//   private _userData;
//
//   set userData(object) {
//     this._userData = CryptoJS.AES.encrypt(JSON.stringify(object), 'key').toString();
//     localStorage.setItem('storedUserData', this._userData);
//   }
//
//   get userData() {
//     const encriptUserData = localStorage.getItem('storedUserData');
//     const userDataString = CryptoJS.AES.decrypt(encriptUserData, 'key').toString(CryptoJS.enc.Utf8);
//     return JSON.parse(userDataString);
//   }
// }
