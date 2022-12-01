import { AdsDisplaySizesEnum } from '../enums/ads-display-sizes.enum';

export interface IAdUnit {
  networkId: string;
  adUnitCode: string;
  adSlotSize: AdsDisplaySizesEnum;
}
