import { UserPermissions } from 'shared/services/user-permissions';

export class ChangeChartData extends UserPermissions {
  formattingChartData(data, type) {
    data.pie.chartOptions.chartType = type;
    data.line.chartOptions.chartType = type;

    if (type === 'line') {
      data.line.datasets.forEach((el) => {
        el.fill = false;
        delete el.dates;
      }); 
    } 
  }
}
