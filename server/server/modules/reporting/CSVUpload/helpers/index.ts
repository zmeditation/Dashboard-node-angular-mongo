const time = require('date-and-time');

class CSVParserHelper {
  constructor() {
  }

  public static sizes: string[] = ['88x31', '120x20', '120x30', '120x60', '120x90', '120x240', '120x600', '125x125', '160x600', '168x28',
    '168x42', '180x150', '200x200', '200x446', '216x36', '216x54', '220x90', '234x60', '240x133', '240x400', '250x250',
    '250x350', '250x360', '250x400', '292x30', '300x31', '300x50', '300x75', '300x100', '300x250', '300x450', '300x600',
    '300x1050', '320x50', '320x100', '320x480', '336x280', '468x60', '480x320', '580x250', '580x400', '728x90', '750x100',
    '750x200', '750x300', '768x1024', '930x180', '950x90', '960x90', '970x66', '970x90', '970x250', '980x90', '980x120',
    '1024x768', '1060x90', '970x200', '640x480', '640x400', '580x450', '512x288', '430x288', '300x300', '1x1', '1x0',
    '2x0', '3x0', '4x0', 'Video/Overlay', 'custom'];

  static getInventorySize(inventory: string): string {
    if (inventory.indexOf('_') >= 0) {
      const tempInventory = inventory.split('_')[0];
      return this.sizes.includes(tempInventory) ? tempInventory : 'custom';
    } else {
      return this.sizes.includes(inventory) ? inventory : 'custom';
    }
  }

  static getURL(url: string): string {
    const regexp = /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/;

    const checkedUrl =  regexp.test(url) ? url : 'invalid.domain';
    if (checkedUrl === 'invalid.domain') {
      return checkedUrl;
    }
    const wohttp = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/im.exec(checkedUrl);
    return wohttp !== null ? wohttp[1] : checkedUrl;
  }

  static getInventoryType(inventory: string): string {
    if (inventory === 'Unknown') {
      return 'banner';
    }
    const allowed = ['banner', 'video'];
    return allowed.includes(inventory.toLowerCase()) ? 'banner' : 'video';
  }

  static convertToInteger(value: string, radix: number): number {
    return parseInt(value.replace(',', '.'), radix);
  }

  static parseECPM(ecpm: string): number {
    const cpm = ecpm ? parseFloat(ecpm.replace(',', '.')) : 0;
    return !isNaN(cpm) ? parseFloat(cpm.toFixed(2)) : 0;
  }

  static parseDate(date: string): string {
    const DateObject = date.includes('/') ? time.parse(date, 'M/D/YY', true) : time.parse(date, 'YYYY-MM-DD', true);
    return time.format(DateObject, 'YYYY-MM-DD');
  }

  static getGoogleInventoryType(inventory: string): string {
    return inventory.search(/[0-9]/i) ? 'video' : 'banner';
  }

  static getGoogleAdUnit(unit: string): string {
    return unit.substr(unit.lastIndexOf("»") + 2);
  }

  static getGoogleReportName(siteName: string): string {
    let replBegin = siteName.replace(/^(www.|http:\/\/|https:\/\/|)/, '');
    let splitSpace = replBegin.split(/\s/g);
    return splitSpace[0].toLowerCase();
  }

  static getGoogleSize(size: string): string {
    return size.includes(',Fluid') ? 'Native' : size;
  }

  static cutProgrammaticCommission(cpm: number, commission: number): number {
    const cpmByPercent = commission * cpm / 100;
    return parseFloat((cpm - cpmByPercent).toFixed(2));
  }
}

export default CSVParserHelper;
