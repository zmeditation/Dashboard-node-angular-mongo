import { IAdUnit } from '../interfaces/ad-unit';
import { IVastUrlParams } from '../interfaces/vast-url-params';
import { AdsDisplaySizesEnum } from '../enums/ads-display-sizes.enum';
import config from '../vast-generator.config.json';

export const defaultAdUnit: IAdUnit = {
  networkId: config.networkId,
  adUnitCode: 'VAST_banner_for_all',
  adSlotSize: AdsDisplaySizesEnum.RELATIVE
};

export const defaultVastUrlParams: IVastUrlParams = {
  showSkipButton: true,
  newAdUnit: false,
  pageUrl: 'https://',
  skipOffset: 7,
  duration: 11
};
