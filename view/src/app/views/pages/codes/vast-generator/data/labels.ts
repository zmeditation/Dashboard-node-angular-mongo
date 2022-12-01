const LABELS = {
  adUnitCode: 'VAST_GENERATOR_PAGE.AD_UNIT_CODE',
  adSlotSize: 'VAST_GENERATOR_PAGE.AD_SLOT_SIZE',
  skipOffset: 'VAST_GENERATOR_PAGE.SKIP_OFFSET',
  duration: 'VAST_GENERATOR_PAGE.ADVERTISE_DURATION',
  showSkipButton: 'VAST_GENERATOR_PAGE.SKIP_BUTTON_TITLE',
  pageUrl: 'VAST_GENERATOR_PAGE.DOMAIN_URL',
  newAdUnit: 'VAST_GENERATOR_PAGE.CREATE_AD_UNIT'
};

export function getLabel(key: string): string {
  if (!LABELS[key]) { console.error(`Key with value ${ key } does not exist in labels list.`); }

  return LABELS[key] || '';
}
