import { Routes } from '@angular/router';
import { VastGeneratorComponent } from './vast-generator/vast-generator.component';
import { AllPurposeCodeGeneratorComponent } from "./all-purpose-code-generator/all-purpose-code-generator.component";
import { CodesListComponent } from "./codes-list/codes-list.component";

export enum CODE_ROUTES {
  VAST_GENERATOR = 'vast-generator',
  LOGO_INSERTER = 'logo-inserter',
  CODE_GENERATOR = 'codes-generator',
  VIDEO_PLAYER_GENERATOR = 'video-player-generator',
  TAC_REPORTS = 'tac-reports',
  UNIVERSAL_GENERATOR = 'generator',
  CODES_LIST = 'list'
}

export const CodesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: CODE_ROUTES.UNIVERSAL_GENERATOR,
        component: AllPurposeCodeGeneratorComponent,
        data: { title: 'All-Purpose Code Generator', breadcrumb: 'All-Purpose Code Generator' }
      },
      {
        path: CODE_ROUTES.VAST_GENERATOR,
        component: VastGeneratorComponent,
        data: { title: 'VAST Generator', breadcrumb: 'VAST Generator' }
      },
      {
        path: CODE_ROUTES.CODES_LIST,
        component: CodesListComponent,
        data: { title: 'Codes List', breadcrumb: 'Codes List' }
      },
    ]
  }
];
