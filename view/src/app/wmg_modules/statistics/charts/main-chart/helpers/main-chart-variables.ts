import { ChartDataObject } from "shared/interfaces/reporting.interface";

export class MainChartVariables {
  constructor() {}

  public callbackFunc = function (value, index, values) {
    if (this.queryOption) {
      // console.log(this.queryOption);
    } else {
      let string = value.toString().replace(',', '.');
      let x = string.length - 1;
      const p = Math.pow;
      const d = p(10, 2);
      x -= x % 3;
      if (this.chart.config.data.datasets[0].label === 'AVERAGE_CPM') {
        string = Math.round(string * d) / d;
      } else {
        string = (Math.round((string * d) / p(10, x)) / d + ' kMGTPE'[x / 3]).replace(' ', '');
      }

      // console.log(string);
      if (this.chart.config.data.datasets[0].label === 'REVENUE') {
        if (string.toString().search(/\./) === -1 && string.toString().search(/[kMGTPE]/) !== -1) {
          const letter = string.match(/[kMGTPE]/)[0];
          const number = parseFloat(string) + '.0';
          return `$ ${ number }${ letter }`;
        }

        return `$ ${ string }`;
      } else if (this.chart.config.data.datasets[0].label === 'FILL_RATE') {
        if (string.toString().search(/\./) === -1 && parseFloat(string) < 10) {
          const number = parseFloat(string) + '.0';
          return `% ${ number }`;
        }
        string = string.replace(/[a-z]/, '');
        this.options.ticks.suggestedMax = 100;

        return `% ${ string }`;
      } else if (this.chart.config.data.datasets[0].label === 'AVERAGE_CPM') {
        if (string.toString().length <= 3 && string % 2 > 0 && string % 2 !== 1) { return `$ ${ string }`; }

        return string === 0 ? `$ ${ string }` : `$ ${ string }.0`;
      }
      if (parseFloat(string) < 10 && string.search(/[kMGTPE]/) === -1) { return parseFloat(string); }

      return string;
    }
  };

  public lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    showLines: true,
    legend: {
      display: false,
      position: 'bottom',
      labels: {
        fontSize: 14
      }
    },
    layout: {
      padding: {
        left: 20,
        right: 10,
        top: 10,
        bottom: 20
      }
    },
    tooltips: {
      mode: 'x',
      intersect: false,
      callbacks: {
        title: function (tooltipItems, data) {
          // console.log(tooltipItems, 'tooltomItems', data, 'title')
          return data.datasets[tooltipItems[0].datasetIndex].data[tooltipItems.index];
        },
        label: function (tooltipItem, data) {
          // console.log(data);
          // console.log(tooltipItem.datasetIndex);
          if (
            data.datasets[tooltipItem.datasetIndex].value_label === 'IMPRESSIONS' ||
            data.datasets[tooltipItem.datasetIndex].value_label === 'REVENUE'
          ) {
            data.datasets[tooltipItem.datasetIndex].value_label === 'IMPRESSIONS'
              ? (data.datasets[tooltipItem.datasetIndex].label = 'Impressions')
              : (data.datasets[tooltipItem.datasetIndex].label = 'Revenue');
          } else if (
            data.datasets[tooltipItem.datasetIndex].value_label === 'FILL_RATE' ||
            data.datasets[tooltipItem.datasetIndex].value_label === 'AVERAGE_CPM'
          ) {
            data.datasets[tooltipItem.datasetIndex].value_label === 'FILL_RATE'
              ? (data.datasets[tooltipItem.datasetIndex].label = 'Fill Rate')
              : (data.datasets[tooltipItem.datasetIndex].label = 'eCPM');
          }


          let formatted;
          if (data.datasets[tooltipItem.datasetIndex].value_label === 'IMPRESSIONS') {
            formatted = new Intl.NumberFormat('en-US', {
              maximumFractionDigits: 0,
              minimumFractionDigits: 0
            }).format(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]);
          } else if (data.datasets[tooltipItem.datasetIndex].value_label === 'REVENUE') {
            formatted = new Intl.NumberFormat('en-US', {
              style: 'currency',
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
              currency: 'USD',
              currencyDisplay: 'code'
            }).format(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]);
          } else if (data.datasets[tooltipItem.datasetIndex].value_label === 'FILL_RATE') {
            formatted = `${ new Intl.NumberFormat('en-US', {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2
            }).format(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]) } %`;
          } else if (data.datasets[tooltipItem.datasetIndex].value_label === 'AVERAGE_CPM') {
            formatted = new Intl.NumberFormat('en-US', {
              style: 'currency',
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
              currency: 'USD',
              currencyDisplay: 'code'
            }).format(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]);
          }


          return `${ data.datasets[tooltipItem.datasetIndex].label }: ${ formatted }`;
        }
      }
    },
    scales: {
      dataset: [
        {
          display: true,
          dataset: {
            barPercentage: 0.4
          },
          gridLines: {
            display: false,
            color: 'rgba(0,0,0,0.08)',
            zeroLineColor: 'rgba(0,0,0,0.08)'
          },
          ticks: {
            stepSize: 5,
            maxTicksLimit: 7,
            suggestedMax: 5
          }
        }
      ],
      yAxes: [
        {
          display: true,
          gridLines: {
            display: true,
            color: 'rgba(0,0,0,0.04)',
            zeroLineColor: 'rgba(0,0,0,0.08)'
          },

          ticks: {
            beginAtZero: true,
            suggestedMax: 1,
            callback: this.callbackFunc
          }
        }
      ]
    }
  };

  public lineChartSteppedData: Array<any> = [];

  public lineChartColors: Array<any> = [
    {
      backgroundColor: 'rgba(63, 81, 181, 0.16)',
      borderColor: 'rgba(12, 90, 98, 0.55)',
      hoverBackgroundColor: 'rgba(12, 90, 98, 0.56)',
      hoverBorderColor: 'rgba(63, 81, 200, 0.1)',
      pointBackgroundColor: 'rgba(12, 90, 98, 0.55)',
      pointBorderColor: 'rgba(12, 90, 98, 0.35)',
      pointHoverBackgroundColor: 'rgba(12, 90, 98, 0.8)',
      pointHoverBorderColor: 'rgba(12, 90, 98,0.5)'
    }
  ];

  public lineChartLegend = true;

  public lineChartType = 'line';

  public consolidatedSum = [];

  public chartMethods = {
    updateLineChartData(obj: ChartDataObject[][], data1: number[][][], propName: string[], consolidatedSum: string[]) {
      for (const d of propName) {
        const objData: ChartDataObject[] = [
          {
            data: data1[0][propName.indexOf(d)],
            label: propName[propName.indexOf(d)],
            pointBorderWidth: 3,
            pointRadius: 4,
            fill: false,
            spanGaps: true,
            borderWidth: 3,
            options: this.lineChartOptions,
            consolidated: consolidatedSum[propName.indexOf(d)],
            value_label: propName[propName.indexOf(d)]
          }
        ];
        obj.push(objData);
      }
    }
  };
}
