export class ReportChartVariables {
  public callbackFunc = function (value, index, values) {
    if (this.queryOption) {
      // console.log(this.queryOption);
    } else {
      let string = value.toString().replace(',', '.');
      if (value > 99) {
        let x = string.length - 1;
        const p = Math.pow,
          d = p(10, 2);
        x -= x % 3;
        string = Math.round((string * d) / p(10, x)) / d + ' kMGTPE'[x / 3];
      }
      if (string.includes('.')) {
        const parsedNumArray = string.split('.');
        if (parsedNumArray[1].length === 1) { string = string + '0'; }
      }
      this.chart.options.elements.line.tension = 0.1;
      if (this.id === 'yAxes_revenue') {
        return '$ ' + string + ' ';
      } else if (this.id === 'yAxes_ecpm') {
        return '$ ' + string + ' ';
      } else if (this.id === 'yAxes_fillrate') {
        this.options.ticks.suggestedMax = 100;
        return '% ' + string;
      }
      return string;
    }
  };

  public lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: true,
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
            data.datasets[tooltipItem.datasetIndex].label === 'IMPRESSIONS' ||
            data.datasets[tooltipItem.datasetIndex].label === 'REVENUE'
          ) {
            data.datasets[tooltipItem.datasetIndex].label === 'IMPRESSIONS'
              ? (data.datasets[tooltipItem.datasetIndex].label = 'Impressions')
              : (data.datasets[tooltipItem.datasetIndex].label = 'Revenue'); 
          } else if (
            data.datasets[tooltipItem.datasetIndex].label === 'FILL_RATE' ||
            data.datasets[tooltipItem.datasetIndex].label === 'AVERAGE_CPM'
          ) {
            data.datasets[tooltipItem.datasetIndex].label === 'FILL_RATE'
              ? (data.datasets[tooltipItem.datasetIndex].label = 'Fill Rate')
              : (data.datasets[tooltipItem.datasetIndex].label = 'eCPM'); 
          }


          let formated;
          if (data.datasets[tooltipItem.datasetIndex].label === 'Impressions') {
            formated = new Intl.NumberFormat('en-US', {
              maximumFractionDigits: 0,
              minimumFractionDigits: 0
            }).format(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]); 
          } else if (data.datasets[tooltipItem.datasetIndex].label === 'Revenue') {
            formated = new Intl.NumberFormat('en-US', {
              style: 'currency',
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
              currency: 'USD',
              currencyDisplay: 'code'
            }).format(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]); 
          } else if (data.datasets[tooltipItem.datasetIndex].label === 'Fill rate') {
            formated = ` ${ new Intl.NumberFormat('en-US', {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2
            }).format(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]) } %`; 
          } else if (data.datasets[tooltipItem.datasetIndex].label === 'eCPM') {
            formated = new Intl.NumberFormat('en-US', {
              style: 'currency',
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
              currency: 'USD',
              currencyDisplay: 'code'
            }).format(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]); 
          }


          return `${ data.datasets[tooltipItem.datasetIndex].label }: ${ formated }`;
        }
      }
    },
    scales: {
      xAxes: [
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
          id: 'yAxes_revenue',
          display: true,
          gridLines: {
            display: true,
            tickMarkLength: 0,
            drawOnChartArea: true,
            lineWidth: 0.1,
            color: 'rgba(0, 0, 0, 0.4)',
            zeroLineColor: 'rgba(0,0,0,0.08)'
          },
          ticks: {
            display: false,
            beginAtZero: true,
            suggestedMax: 0.5,
            fontStyle: 'bold',
            fontColor: 'rgba(0, 135, 92, 1)',
            callback: this.callbackFunc
          }
        },
        {
          id: 'yAxes_impressions',
          position: 'right',
          display: false,
          gridLines: {
            display: true,
            drawOnChartArea: false,
            tickMarkLength: 20,
            lineWidth: 2,
            borderDash: [1, 1],
            color: 'rgba(51, 102, 150, 1)',
            zeroLineColor: 'rgba(0,0,0,0.08)'
          },
          ticks: {
            display: false,
            beginAtZero: true,
            fontColor: 'rgba(51, 102, 150, 1)',
            suggestedMax: 0.5,
            fontStyle: 'bold',
            callback: this.callbackFunc
          }
        },
        {
          id: 'yAxes_ecpm',
          display: false,
          gridLines: {
            display: true,
            drawOnChartArea: false,
            tickMarkLength: 20,
            lineWidth: 2,
            borderDash: [1, 1],
            borderDashOffset: 2,
            color: 'rgba(131, 145, 93, 1)',
            zeroLineColor: 'rgba(0,0,0,0.08)'
          },
          ticks: {
            display: false,
            beginAtZero: true,
            fontColor: 'rgba(131, 145, 93, 1)',
            suggestedMax: 0.5,
            fontStyle: 'bold',
            callback: this.callbackFunc
          }
        },
        {
          id: 'yAxes_fillrate',
          position: 'right',
          display: false,
          gridLines: {
            display: true,
            drawOnChartArea: false,
            tickMarkLength: 20,
            lineWidth: 2,
            borderDash: [1, 1],
            color: 'rgba(124, 72, 145, 1)',
            zeroLineColor: 'rgba(0,0,0,0.08)'
          },
          ticks: {
            display: false,
            beginAtZero: true,
            fontColor: 'rgba(124, 72, 145, 1)',
            fontStyle: 'bold',
            suggestedMax: 0.5,
            callback: this.callbackFunc
          }
        }
      ]
    }
  };

  public lineChartSteppedData = [];

  public lineChartColors: Array<any> = [
    {
      backgroundColor: 'rgba(33, 206, 194, 0.16)',
      borderColor: 'rgba(33, 206, 194, 0.8)',
      hoverBackgroundColor: 'rgba(0, 135, 92, 0.86)',
      pointBackgroundColor: 'rgba(33, 206, 194, 1)',
      pointBorderColor: 'rgba(0, 135, 92, 0)',
      pointHoverBackgroundColor: 'rgba(33, 206, 194, 0.5)',
      pointHoverBorderColor: 'rgba(33, 206, 194,0.5)'
    },
    {
      backgroundColor: 'rgba(255, 66, 66, 0.16)',
      borderColor: 'rgba(255, 66, 66, 0.6)',
      hoverBackgroundColor: 'rgba(51, 102, 150, 0.4)',
      pointBackgroundColor: 'rgba(255, 66, 66, 1)',
      pointBorderColor: 'rgba(51, 102, 150, 0)',
      pointHoverBackgroundColor: 'rgba(255, 66, 66, 0.5)',
      pointHoverBorderColor: 'rgba(255, 66, 66,0.5)'
    },
    {
      backgroundColor: 'rgba(226, 219, 13, 0.16)',
      borderColor: 'rgba(226, 219, 13, 0.6)',
      hoverBackgroundColor: 'rgba(131, 145, 93, 0.4)',
      pointBackgroundColor: 'rgba(226, 219, 13, 1)',
      pointBorderColor: 'rgba(131, 145, 93, 0)',
      pointHoverBackgroundColor: 'rgba(226, 219, 13, 0.5)',
      pointHoverBorderColor: 'rgba(226, 219, 13, 0.5)'
    },
    {
      backgroundColor: 'rgba(29, 211, 69, 0.16)',
      borderColor: 'rgba(29, 211, 69, 0.6)',
      hoverBackgroundColor: 'rgba(124, 72, 145, 0.4)',
      pointBackgroundColor: 'rgba(29, 211, 69, 1)',
      pointBorderColor: 'rgba(124, 72, 145, 0)',
      pointHoverBackgroundColor: 'rgba(29, 211, 69, 0.5)',
      pointHoverBorderColor: 'rgba(29, 211, 69, 0.5)'
    }
  ];

  public lineChartLegend = true;

  public lineChartType = 'line';

  public setChartContainerHeight = '350px';

  public chartMethods = {
    updateLineChartData(obj, data1, propName) {
      for (const d of propName) {
        const objData = {
          data: data1[propName.indexOf(d)],
          label: propName[propName.indexOf(d)],
          pointBorderWidth: 3,
          pointRadius: 4,
          fill: false,
          spanGaps: true,
          borderWidth: 3,
          options: this.lineChartOptions
        };
        obj.push(objData);
      }
    }
  };
}
