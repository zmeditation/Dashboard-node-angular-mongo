const ROLES = {
  PUBLISHER: 'PUBLISHER',
  ACCOUNT_MANAGER: 'ACCOUNT MANAGER',
  SENIOR_ACCOUNT_MANAGER: 'SENIOR ACCOUNT MANAGER',
  ADMIN: 'ADMIN',
  AD_OPS: 'AD OPS',
  CEO_MANAGER: 'CEO MANAGER',
  WBID_ANALYTICS_USER: 'WBID ANALYTICS USER',
  FINANCE_MANAGER: 'FINANCE MANAGER',
  PARTNER: 'oRTB Partner',
  ANALYTICS: 'ANALYTICS',
  CEO: 'CEO',
  MEDIA_BUYER: 'MEDIA BUYER',
  ANALYTICS_BOT: 'ANALYTICS BOT',
};

const ROLES_ARR: readonly string[] = [
  ROLES.PUBLISHER,
  ROLES.ACCOUNT_MANAGER,
  ROLES.SENIOR_ACCOUNT_MANAGER,
  ROLES.ADMIN,
  ROLES.AD_OPS,
  ROLES.CEO_MANAGER,
  ROLES.WBID_ANALYTICS_USER,
  ROLES.FINANCE_MANAGER,
  ROLES.PARTNER,
  ROLES.ANALYTICS,
  ROLES.CEO,
  ROLES.MEDIA_BUYER,
  ROLES.ANALYTICS_BOT
];

const ACCOUNT_MANAGER_ROLES: readonly string[] = [
  ROLES.ACCOUNT_MANAGER,
  ROLES.SENIOR_ACCOUNT_MANAGER
];

Object.freeze(ROLES);

export { ROLES, ROLES_ARR, ACCOUNT_MANAGER_ROLES };
