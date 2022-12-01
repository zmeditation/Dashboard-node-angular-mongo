import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CODE_ROUTES } from '../../views/pages/codes/codes.routing';

interface IChildItem {
  type?: string;
  name: string; // Display text
  state?: string; // Router state
  icon?: string;
  permission?: Array<string>;
  sub?: IChildItem[];
}

interface IBadge {
  color: string; // primary/accent/warn/hex color codes(#fff000)
  value: string; // Display text
}

interface IMenuItem {
  type: string; // Possible values: link/dropDown/icon/separator/extLink
  name?: string; // Used as display text for item and title for separator type
  state?: string; // Router state
  icon?: string; // Material icon name
  tooltip?: string; // Tooltip text
  disabled?: boolean; // If true, item will not be appeared in sidenav.
  sub?: IChildItem[]; // Dropdown users
  badges?: IBadge[];
  permission?: any;
}

@Injectable()
export class NavigationService {
  iconMenu: IMenuItem[] = [
    {
      name: 'DASHBOARD',
      type: 'dropDown',
      tooltip: 'Dashboard',
      icon: 'dashboard',
      state: 'dashboard',
      sub: [
        { name: 'MAIN', state: '', permission: ['canSeeDashboardPage'] },
        {
          name: 'STATISTICS_TITLE',
          state: 'statistics',
          permission: ['canSeeAnalyticsPage']
        },
        {
          name: 'ADS_TXT_MONITOR',
          state: 'ads_txt_info',
          permission: ['canSeeAdsTxtPage']
        }
      ],
      permission: ['canSeeDashboardPage']
    },
    {
      name: 'REPORTS',
      type: 'dropDown',
      tooltip: 'Report management',
      icon: 'insert_chart',
      state: 'reports',
      sub: [
        {
          name: 'REPORT_MANAGEMENT',
          state: 'report-management',
          permission: ['canSeeReportManagementPage']
        },
        {
          name: 'REPORT_VIEWER',
          state: 'report',
          permission: ['canSeeReportsPage']
        },
        {
          name: 'API_MANAGEMENT',
          state: 'api-management',
          permission: ['canSeeAPIManagementPage']
        }
      ],
      permission: ['canSeeReportsPage', 'canSeeAPIManagementPage']
    },
    {
      name: 'USERS',
      type: 'dropDown',
      tooltip: 'User management',
      icon: 'people',
      state: 'users',
      permission: ['canSeeUsersPage'],
      sub: [
        { name: 'USERS', state: 'users', permission: ['canSeeUsersPage'] },
        {
          name: 'TOOLS_TITLE',
          state: 'tools',
          permission: ['canSeeUsersToolsPage']
        }
      ]
    },
    {
      name: 'CODES',
      type: 'dropDown',
      tooltip: 'Code management',
      icon: 'code',
      state: 'codes',
      permission: ['canSeeCodesPage'],
      sub: [
/*        {
          name: 'CODE_GENERATOR',
          state: CODE_ROUTES.CODE_GENERATOR,
          permission: ['canCreateTacCodes']
        },*/
        {
          name: 'UNIVERSAL_GENERATOR',
          state: CODE_ROUTES.UNIVERSAL_GENERATOR
        },
        {
          name: 'CODES_DB',
          state: CODE_ROUTES.CODES_LIST
        },
        // { name: 'LOGO_INSERTER', state: CODE_ROUTES.LOGO_INSERTER },
        // {
        //   name: 'VIDEO_PLAYER.PAGE_TITLE',
        //   state: CODE_ROUTES.VIDEO_PLAYER_GENERATOR
        // },
        {
          name: 'VAST_GENERATOR_PAGE.PAGE_TITLE',
          state: CODE_ROUTES.VAST_GENERATOR
        }
      ]
    },
    {
      name: 'INVOICES.TITLE',
      type: 'dropDown',
      tooltip: 'Invoice list.',
      icon: 'attach_money',
      state: 'invoices',
      permission: ['canSeeInvoicesPage'],
      sub: [
        {
          name: 'INVOICES.INVOICES_LIST',
          state: 'list',
          permission: ['canSeeInvoicesPage']
        },
        {
          name: 'REVENUE.TITLE',
          state: 'revenue',
          permission: ['canSeeRevenuePage']
        }
      ]
    },
    {
      name: 'SETTINGS',
      type: 'dropDown',
      tooltip: 'Settings',
      icon: 'settings',
      state: 'settings',
      sub: [
        {
          name: 'PERMISSIONS',
          state: 'permissions',
          permission: ['canSeePermissionManager']
        },
        {
          name: 'PROFILE',
          state: 'profile/overview',
          permission: ['canSeeOwnProfilePage']
        },
        {
          name: 'ATTACHMENTS',
          state: 'profile/attachments',
          permission: ['canReadAllReports', 'canReadOwnPubsReports', 'canReadAllPubsReports']
        },
        {
          name: 'API-TOKEN-GENERATOR',
          state: 'profile/api-token-generator',
          permission: ['canUseAPIAccessForReports']
        }
        // { name: 'Invoices', state: 'invoices', permission: 'canSeeOwnProfilePage'}
      ],
      permission: ['canSeeSettingsPage']
    },
    {
      name: 'BIDDER',
      type: 'dropDown',
      tooltip: 'WBID',
      icon: 'zoom_out_map',
      state: 'wbid',
      permission: ['canSeeWBidPage', 'canSeeWBidChartsPage', 'canSeeWBidTablesPage'],
      sub: [
        { name: 'WBID_MAIN', state: '', permission: ['canSeeWBidPage'] },
        {
          name: 'WBID_ANALYTICS_CHARTS',
          state: 'analytics-charts',
          permission: ['canSeeWBidChartsPage']
        }
      ]
    }
  ];

  // iconMenu: IMenuItem[] = [
  //   {
  //     name: 'DASHBOARD',
  //     type: 'link',
  //     tooltip: 'Dashboard',
  //     icon: 'dashboard',
  //     state: 'dashboard',
  //     badges: [{ color: 'accent', value: '100+' }],
  //   },
  //   {
  //     name: 'DOC',
  //     type: 'extLink',
  //     tooltip: 'Documentation',
  //     icon: 'library_books',
  //     state: 'http://egret-doc.mhrafi.com/'
  //   }
  // ]

  // Icon menu TITLE at the very top of navigation.
  // This title will appear if any icon type item is present in menu.
  iconTypeMenuTitle = 'Frequently Accessed';

  // sets iconMenu as default;
  menuItems = new BehaviorSubject<IMenuItem[]>(this.iconMenu);

  // navigation component has subscribed to this Observable
  menuItems$ = this.menuItems.asObservable();

  constructor() {}

  // Customizer component uses this method to change menu.
  // You can remove this method and customizer component.
  // Or you can customize this method to supply different menu for
  // different user type.
  publishNavigationChange(menuType: string) {
    this.menuItems.next(this.iconMenu);
  }
}
