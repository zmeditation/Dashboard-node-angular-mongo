export function getIndexBy(array: Array<any>, { name, value }): number {
  for (let i = 0; i < array.length; i++) { if (array[i][name] === value) { return i; } }


  return -1;
}

export const _filterStrings = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
};

export const _filterObject = (opt: any[], value: string, field: string): string[] => {
  const filterValue = typeof value === 'string' ? value.toLowerCase() : value;

  return opt.filter(item => item[field].toLowerCase().indexOf(filterValue) === 0);
};
