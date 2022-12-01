type SortSettingsType = {
  value: string;
  by: string;
  items?: any[];
};

type ItemsByPageResponse = {
  items: any[];
  countPages: number;
  totalItemsLength: number;
};

export class PageCacheService {
  protected idProperty: string | number;

  protected limit: number;

  protected sortType = '';

  protected sortBy = '';

  protected searchValue = '';

  protected searchBy = '';

  protected items: any[] = [];

  protected ids: (string | number)[] = [];

  protected enabledPages: any = {};

  public setIdItemProperty(value: string | number): PageCacheService {
    this.idProperty = value;
    return this;
  }

  public setPageLimit(value: number): PageCacheService {
    this.limit = value;
    return this;
  }

  public setSortType(value: string): PageCacheService {
    this.sortType = value;
    return this;
  }

  public setSortBy(value: string): PageCacheService {
    this.sortBy = value;
    return this;
  }

  public setSearchValue(value: string): PageCacheService {
    this.searchValue = value;
    return this;
  }

  public setSearchBy(value: string): PageCacheService {
    this.searchBy = value;
    return this;
  }

  public getAllItems(): any[] {
    return this.items;
  }

  public count(): number {
    return this.items.length;
  }

  public getPagesCount(sortBy?: string): number {
    const enablesPages: any = this.enabledPages[this.sortType];

    if (this.sortType === '') {
      return enablesPages;
    }

    return enablesPages ? enablesPages[sortBy] : 0;
  }

  public addItem(item: any): PageCacheService {
    const id: string | number = item[this.idProperty];

    if (this.missId(id)) {
      this.ids.push(id);
      this.items.push(item);
    } else if (item.search) {
      this.updateItemWithSearch(id, item);
    }

    return this;
  }

  protected updateItemWithSearch(id: string | number, item: any): void {
    for (const existItem of this.items) {
      if (existItem[this.idProperty] === id) {
        if (!existItem.search) {
          existItem.search = item.search;
        } else if (existItem.search.keys) {
          existItem.search.keys = existItem.search.keys.concat(item.search.keys);
        }
      }
    }
  }

  public addItems(data: any[], searchKeys?: string[]): PageCacheService {
    for (const item of data) {
      if (searchKeys && searchKeys.length) {
        item.search = {
          keys: searchKeys
        };
      }
      this.addItem(item);
    }

    const countPages: number = data.length / this.limit;

    if (this.sortType) {
      if (!this.enabledPages[this.sortType]) {
        this.enabledPages[this.sortType] = {};
        this.enabledPages[this.sortType][this.sortBy] = 0;
      }

      this.enabledPages[this.sortType][this.sortBy] += countPages;
    } else {
      if (this.enabledPages[this.sortType]) {
        this.enabledPages[this.sortType] = 0;
      }

      this.enabledPages[this.sortType] += countPages;
    }

    return this;
  }

  protected missId(id: string | number): boolean {
    return !this.ids.includes(id);
  }

  public getItemsByPage(page: number): ItemsByPageResponse {
    const result: any[] = [];
    const items: any[] = this.getItemsByState();
    const startIndex: number = page * this.limit;
    const endIndex: number = startIndex + this.limit;

    for (let i = startIndex; i < endIndex; i++) {
      const item: any = items[i];

      if (!item) {
        break;
      }

      result.push(item);
    }

    return {
      items: result,
      totalItemsLength: items.length,
      countPages: Math.floor(items.length / this.limit)
    };
  }

  protected getItemsByState(): Array<any> {
    const notEmptySortType: boolean = this.sortType !== '';
    const notEmptySearchValue: boolean = this.searchValue !== '';

    if (notEmptySortType && notEmptySearchValue) {
      const items: any[] = this.sort(this.sortBy, this.sortType);

      return this.search({
        value: this.searchValue,
        by: this.searchBy,
        items
      });
    }

    if (notEmptySortType) {
      return this.sort(this.sortBy, this.sortType);
    }

    if (notEmptySearchValue) {
      return this.search({
        value: this.searchValue,
        by: this.searchBy
      });
    }

    return this.items;
  }

  public getItemsFromFirstPage(page: number): ItemsByPageResponse {
    const result = [];
    const items = this.getItemsByState();
    const endIndex = this.limit * page;

    for (let i = 0; i < endIndex; i++) {
      const item: any = items[i];

      if (!item) {
        break;
      }

      result.push(item);
    }

    return {
      items: result,
      totalItemsLength: items.length,
      countPages: Math.floor(items.length / this.limit)
    };
  }

  /**
   * By parameter can be key of item or can be way string like 'enabled.status'
   *
   * @param {string|number} by
   * @param {string} type
   * @returns any[]
   */
  public sort(by: string | number, type: string): any[] {
    by = by.toString();
    const result: any[] = this.items.slice();
    const isAsc: boolean = type === 'asc';
    const isWayBy: boolean = by.split('.').length !== 1;

    result.sort((a, b) => {
      // @ts-ignore - bug:by cannot be number
      a = isWayBy ? this.getObjectValueByWay(a, by) : a[by];
      // @ts-ignore
      b = isWayBy ? this.getObjectValueByWay(b, by) : b[by];

      return this.compare(a, b, isAsc);
    });

    return result;
  }

  protected getObjectValueByWay(obj: any, way: string): any {
    const splitedWay: string[] = way.split('.');

    if (splitedWay.length === 1) {
      return splitedWay[0];
    }

    let result: string;

    for (let i = 0; i < splitedWay.length; i++) {
      const key = splitedWay[i];

      if (i === 0) {
        result = obj[key];
      } else {
        result = result[key];
      }
    }

    return result;
  }

  protected compare(a: string | number | boolean, b: string | number | boolean, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  public search(data: SortSettingsType): any[] {
    const items: any[] = data.items ? data.items : this.items;

    if (!items[0].hasOwnProperty(data.by)) {
      return [];
    }

    return items.filter((item) => {
      const value = data.value.toLocaleLowerCase();

      if (item.search && item.search.keys && item.search.keys.includes(value)) {
        return true;
      }

      if (item[data.by].toLowerCase().includes(value)) {
        return true;
      }

      return false;
    });
  }

  public update(data: any): PageCacheService {
    this.items = this.items.map((item) => {
      if (item[this.idProperty] === data[this.idProperty]) {
        return data;
      }

      return item;
    });

    return this;
  }

  public delete(id: number | string): PageCacheService {
    this.items = this.items.filter((item) => item[this.idProperty] !== id);
    return this;
  }

  public clearItemData(): PageCacheService {
    this.items = [];
    this.enabledPages = {};
    this.sortType = '';
    this.sortBy = '';
    this.searchValue = '';
    this.ids = [];

    return this;
  }
}
