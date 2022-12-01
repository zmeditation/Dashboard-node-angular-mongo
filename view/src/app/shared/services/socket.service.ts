import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Socket } from 'ngx-socket-io';

const options: any = { secure: true, rejectUnauthorized: false };

// This is service of sockets rooms by roles

@Injectable()
export class SocketDefault extends Socket {
  constructor() {
    super({ url: environment.socketURL, options });
  }
}

@Injectable()
export class SocketAdmin extends Socket {
  constructor() {
    super({ url: `${ environment.socketURL }/admin`, options });
  }
}

@Injectable()
export class SocketCeo extends Socket {
  constructor() {
    super({ url: `${ environment.socketURL }/ceo`, options });
  }
}

@Injectable()
export class SocketAdOps extends Socket {
  constructor() {
    super({ url: `${ environment.socketURL }/adops`, options });
  }
}

@Injectable()
export class SocketSeniorAc extends Socket {
  constructor() {
    super({ url: `${ environment.socketURL }/senior-account`, options });
  }
}

@Injectable()
export class SocketAc extends Socket {
  constructor() {
    super({ url: `${ environment.socketURL }/account`, options });
  }
}

@Injectable()
export class SocketPub extends Socket {
  constructor() {
    super({ url: `${ environment.socketURL }/publisher`, options });
  }
}

@Injectable()
export class SocketMedia extends Socket {
  constructor() {
    super({ url: `${ environment.socketURL }/media`, options });
  }
}

@Injectable()
export class SocketFinance extends Socket {
  constructor() {
    super({ url: `${ environment.socketURL }/finance`, options });
  }
}
