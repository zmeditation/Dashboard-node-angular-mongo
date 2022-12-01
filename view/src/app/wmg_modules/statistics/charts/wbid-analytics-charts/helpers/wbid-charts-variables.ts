import { ChangeChartData } from './change-chart-data';

export class WbidChartsVariables extends ChangeChartData {
  callbackFunc = function (value, index, values) {
    if (this.queryOption) {
      // console.log(this.queryOption);
    } else {
      if (this.chart.config.type !== 'pie') {
        this.chart.config.options.scales.xAxes[0].display = true;
        this.chart.config.options.scales.yAxes[0].display = true;
      }
      let string = value.toString().replace(',', '.');
      let x = string.length - 1;
      const p = Math.pow,
        d = p(10, 2);
      x -= x % 3;
      string = Math.round((string * d) / p(10, x)) / d + ' kMGTPE'[x / 3];
      if (!string.includes('.')) {
      // const parsedNumArray = string.split('.');


        if (string.search(/[a-zA-Z]/) !== -1 && this.chart.config.type !== 'horizontalBar') {
          const lit = string.split(/[a-zA-Z]/);
          lit[0] = +lit[0];
          string = `${ lit[0].toFixed(1) + ' kMGTPE'[x / 3] }`;
        }
      }


      if (this.chart.config.options.chart_title.search(/fill_rate/gi) !== -1) {
        return this.chart.config.type !== 'horizontalBar' ? '% ' + string + ' ' : string;
      }
      if (
        this.chart.config.options.chart_title.search(/revenue/gi) !== -1 ||
        this.chart.config.options.chart_title.search(/cpm/gi) !== -1
      ) { return this.chart.config.type !== 'horizontalBar' ? '$ ' + string + ' ' : string; }


      return string + ' ';
    }
  };

  tooltipSettings() {
    return {
      mode: 'index',
      intersect: true,
      callbacks: {
        title: function (tooltipItems, data) {
          return data.datasets[tooltipItems[0].datasetIndex].data['tooltipItems.index'];
        },
        label: function (tooltipItem, data) {
          const formated = new Intl.NumberFormat('en-US', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 1
          }).format(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]);
          //
          return `${ data.datasets.length > 1
            ? data.datasets[tooltipItem.datasetIndex].label : 
            data.labels[tooltipItem.index] }: ${ formated }`;
        }
      }
    };
  }

  public defaultChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        fontSize: 12,
        usePointStyle: true
      }
    },
    layout: {
      padding: {
        left: 20,
        right: 10,
        top: 20,
        bottom: 20
      }
    },
    rotation: -0.5 * Math.PI,
    animation: {
      animateScale: true
    },
    tooltips: this.tooltipSettings(),
    scales: {
      xAxes: [
        {
          display: false,
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
          display: false,
          stacked: false,
          gridLines: {
            display: true,
            color: 'rgba(0,0,0,0.04)',
            zeroLineColor: 'rgba(0,0,0,0.08)'
          },
          ticks: {
            display: true,
            beginAtZero: true,
            suggestedMax: 1.0,
            callback: this.callbackFunc
          }
        }
      ]
    }
  };

  public pieChartColors = [
    {
      backgroundColor: [
        'rgba(33, 206, 194, 0.8)',
        'rgba(255, 102, 102, 0.8)',
        'rgba(26, 102, 255, 0.8)',
        'rgba(255, 153, 0, 0.8)',
        'rgba(0, 191, 255, 0.8)',
        'rgba(204, 0, 102, 0.8)',
        'rgba(29, 211, 69, 0.8)',
        'rgba(230, 189, 89, 0.8)',
        'rgba(118, 255, 0, 0.8)',
        'rgba(255, 77, 255, 0.8)',
        'rgba(0, 210, 10, 0.8)'
      ],
      borderColor: [
        'rgba(33, 206, 194, 0.8)',
        'rgba(255, 102, 102, 0.8)',
        'rgba(26, 102, 255, 0.8)',
        'rgba(255, 153, 0, 0.8)',
        'rgba(0, 191, 255, 0.8)',
        'rgba(204, 0, 102, 0.8)',
        'rgba(29, 211, 69, 0.8)',
        'rgba(230, 189, 89, 0.8)',
        'rgba(118, 255, 0, 0.8)',
        'rgba(255, 77, 255, 0.8)',
        'rgba(0, 210, 10, 0.8)'
      ],
      hoverBackgroundColor: [
        'rgba(33, 206, 194, 1)',
        'rgba(255, 102, 102, 1)',
        'rgba(26, 102, 255, 1)',
        'rgba(255, 153, 0, 1)',
        'rgba(0, 191, 255, 1)',
        'rgba(204, 0, 102, 1)',
        'rgba(29, 211, 69, 1)',
        'rgba(230, 189, 89, 1)',
        'rgba(118, 255, 0, 1)',
        'rgba(255, 77, 255, 1)',
        'rgba(0, 210, 10, 1)'
      ],
      hoverBorderColor: [
        'rgba(33, 206, 194, 1)',
        'rgba(255, 102, 102, 1)',
        'rgba(26, 102, 255, 1)',
        'rgba(255, 153, 0, 1)',
        'rgba(0, 191, 255, 1)',
        'rgba(204, 0, 102, 1)',
        'rgba(29, 211, 69, 1)',
        'rgba(230, 189, 89, 1)',
        'rgba(118, 255, 0, 1)',
        'rgba(255, 77, 255, 1)',
        'rgba(0, 210, 10, 1)'
      ]
    }
  ];

  public lineChartColors = [
    {
      backgroundColor: 'rgba(33, 206, 194, 0.8)',
      borderColor: 'rgba(33, 206, 194, 0.8)',
      hoverBackgroundColor: 'rgba(33, 206, 194, 1)',
      hoverBorderColor: 'rgba(33, 206, 194, 1)'
    },
    {
      backgroundColor: 'rgba(255, 102, 102, 0.8)',
      borderColor: 'rgba(255, 102, 102, 0.8)',
      hoverBackgroundColor: 'rgba(255, 102, 102, 1)',
      hoverBorderColor: 'rgba(255, 102, 102, 1)'
    },
    {
      backgroundColor: 'rgba(26, 102, 255, 0.8)',
      borderColor: 'rgba(26, 102, 255, 0.8)',
      hoverBackgroundColor: 'rgba(26, 102, 255, 1)',
      hoverBorderColor: 'rgba(26, 102, 255, 1)'
    },
    {
      backgroundColor: 'rgba(255, 153, 0, 0.8)',
      borderColor: 'rgba(255, 153, 0, 0.8)',
      hoverBackgroundColor: 'rgba(255, 153, 0, 1)',
      hoverBorderColor: 'rgba(255, 153, 0, 1)'
    },
    {
      backgroundColor: 'rgba(0, 191, 255, 0.8)',
      borderColor: 'rgba(0, 191, 255, 0.8)',
      hoverBackgroundColor: 'rgba(0, 191, 255, 1)',
      hoverBorderColor: 'rgba(0, 191, 255, 1)'
    },
    {
      backgroundColor: 'rgba(204, 0, 102, 0.8)',
      borderColor: 'rgba(204, 0, 102, 0.8)',
      hoverBackgroundColor: 'rgba(204, 0, 102, 1)',
      hoverBorderColor: 'rgba(204, 0, 102, 1)'
    },
    {
      backgroundColor: 'rgba(29, 211, 69, 0.8)',
      borderColor: 'rgba(29, 211, 69, 0.8)',
      hoverBackgroundColor: 'rgba(29, 211, 69, 1)',
      hoverBorderColor: 'rgba(29, 211, 69, 1)'
    },
    {
      backgroundColor: 'rgba(230, 189, 89, 0.8)',
      borderColor: 'rgba(230, 189, 89, 0.8)',
      hoverBackgroundColor: 'rgba(230, 189, 89, 1)',
      hoverBorderColor: 'rgba(230, 189, 89, 1)'
    },
    {
      backgroundColor: 'rgba(118, 255, 0, 0.8)',
      borderColor: 'rgba(118, 255, 0, 0.8)',
      hoverBackgroundColor: 'rgba(118, 255, 0, 1)',
      hoverBorderColor: 'rgba(118, 255, 0, 1)'
    },
    {
      backgroundColor: 'rgba(255, 77, 255, 0.8)',
      borderColor: 'rgba(255, 77, 255, 0.8)',
      hoverBackgroundColor: 'rgba(255, 77, 255, 1)',
      hoverBorderColor: 'rgba(255, 77, 255, 1)'
    },
    {
      backgroundColor: 'rgba(0, 210, 10, 0.8)',
      borderColor: 'rgba(0, 210, 10, 0.8)',
      hoverBackgroundColor: 'rgba(0, 210, 10, 1)',
      hoverBorderColor: 'rgba(0, 210, 10, 1)'
    }
  ];

  public setChartContainerHeight = window.innerWidth <= 1024 && window.innerWidth > 411 ? '85vh' : 'auto';
}
