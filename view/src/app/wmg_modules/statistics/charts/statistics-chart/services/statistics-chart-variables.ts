import { UserPermissions } from "shared/services/user-permissions";

export class StatisticsChartVariables extends UserPermissions {
  public callbackFunc = function (value) {
    if (this.queryOption) {
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
        if (parsedNumArray[1].length === 1) {
          string = string + '0';
        }
      }
      return '$ ' + string + ' ';
    }
  };

  public lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        fontSize: 12
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
    tooltips: {
      mode: 'x',
      intersect: false,
      callbacks: {
        title: function (tooltipItems, data) {
          return data.datasets[tooltipItems[0].datasetIndex].data[tooltipItems.index];
        },
        label: function (tooltipItem, data) {
          const formatted = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
          if (tooltipItem.index === 29) {
            return `(Not full data)\n${ data.labels[tooltipItem.index] }, ${ data.datasets[tooltipItem.datasetIndex].label }: ${ formatted }`;
          }
          return `${ data.labels[tooltipItem.index] }, ${ data.datasets[tooltipItem.datasetIndex].label }: ${ formatted }`;
        }
      }
    },
    scales: {
      xAxes: [
        {
          id: 'xAxes_days',
          display: true,
          dataset: {
            barPercentage: 1.1
          },
          stacked: true,
          gridLines: {
            display: true,
            color: 'rgba(0,0,0,0)',
            zeroLineColor: 'rgba(0,0,0,0.12)'
          },
          ticks: {
            stepSize: 2,
            maxTicksLimit: 15,
            suggestedMax: 31,
            fontColor: 'rgba(25, 25, 77, 1)'
          }
        }
      ],
      yAxes: []
    }
  };

  setColors() {
    const defaultColors = this.lineChartColors;
    const lastDayColors = [
      {
        backgroundColor: 'rgba(33, 206, 194, 0.2)',
        borderColor: 'rgba(33, 206, 194, 0.2)',
        hoverBackgroundColor: 'rgba(33, 206, 194, 0.6)',
        hoverBorderColor: 'rgba(33, 206, 194, 0.2'
      },
      {
        backgroundColor: 'rgba(255, 102, 102, 0.2)',
        borderColor: 'rgba(255, 66, 66, 0.2)',
        hoverBackgroundColor: 'rgba(255, 102, 102, 0.6)',
        hoverBorderColor: 'rgba(255, 66, 66, 0.2)'
      },
      {
        backgroundColor: 'rgba(26, 102, 255, 0.2)',
        borderColor: 'rgba(226, 219, 13, 0.2)',
        hoverBackgroundColor: 'rgba(26, 102, 255, 0.6)',
        hoverBorderColor: 'rgba(226, 219, 13, 0.2)'
      },
      {
        backgroundColor: 'rgba(255, 153, 0, 0.2)',
        borderColor: 'rgba(255, 153, 0, 0.2)',
        hoverBackgroundColor: 'rgba(255, 153, 0, 0.6)',
        hoverBorderColor: 'rgba(255, 153, 0, 0.2)'
      },
      {
        backgroundColor: 'rgba(0, 191, 255, 0.2)',
        borderColor: 'rgba(0, 191, 255, 0.2)',
        hoverBackgroundColor: 'rgba(0, 191, 255, 0.6)',
        hoverBorderColor: 'rgba(0, 191, 255, 0.2)'
      },
      {
        backgroundColor: 'rgba(204, 0, 102, 0.2)',
        borderColor: 'rgba(204, 0, 102, 0.2)',
        hoverBackgroundColor: 'rgba(204, 0, 102, 0.6)',
        hoverBorderColor: 'rgba(204, 0, 102, 0.2)'
      },
      {
        backgroundColor: 'rgba(29, 211, 69, 0.2)',
        borderColor: 'rgba(29, 211, 69, 0.2)',
        hoverBackgroundColor: 'rgba(29, 211, 69, 0.6)',
        hoverBorderColor: 'rgba(29, 211, 69, 0.2)'
      },
      {
        backgroundColor: 'rgba(230, 189, 89, 0.2)',
        borderColor: 'rgba(230, 189, 89, 0.2)',
        hoverBackgroundColor: 'rgba(230, 189, 89, 0.6)',
        hoverBorderColor: 'rgba(230, 189, 89, 0.2)'
      },
      {
        backgroundColor: 'rgba(255, 77, 255, 0.2)',
        borderColor: 'rgba(255, 77, 255, 0.2)',
        hoverBackgroundColor: 'rgba(255, 77, 255, 0.6)',
        hoverBorderColor: 'rgba(255, 77, 255, 0.2)'
      },
      {
        backgroundColor: 'rgba(255, 204, 0, 0.2)',
        borderColor: 'rgba(255, 204, 0, 0.2)',
        hoverBackgroundColor: 'rgba(255, 204, 0, 0.6)',
        hoverBorderColor: 'rgba(255, 204, 0, 0.2)'
      }
    ];
    const newArrayColors = [];
    for (const color of defaultColors) {
      const index = defaultColors.indexOf(color);
      const newObjColors = {
        backgroundColor: [color.backgroundColor],
        borderColor: [color.borderColor],
        hoverBackgroundColor: [color.hoverBackgroundColor],
        hoverBorderColor: [color.hoverBorderColor]
      };
      newArrayColors.push(newObjColors);
      for (let i = 0; i < 29; i++) {
        newObjColors.backgroundColor.push(color.backgroundColor);
        newObjColors.borderColor.push(color.borderColor);
        newObjColors.hoverBackgroundColor.push(color.hoverBackgroundColor);
        newObjColors.hoverBorderColor.push(color.hoverBorderColor);
        if (i === 28) {
          newObjColors.backgroundColor[29] = lastDayColors[index].backgroundColor;
          newObjColors.borderColor[29] = lastDayColors[index].borderColor;
          newObjColors.hoverBackgroundColor[29] = lastDayColors[index].hoverBackgroundColor;
          newObjColors.hoverBorderColor[29] = lastDayColors[index].hoverBorderColor;
        }
      }
    }
    return newArrayColors;
  }

  lineChartSteppedData = [];

  lineChartColors = [
    {
      backgroundColor: 'rgba(33, 206, 194, 0.8)',
      borderColor: 'rgba(33, 206, 194, 0.6)',
      hoverBackgroundColor: 'rgba(33, 206, 194, 1)',
      hoverBorderColor: 'rgba(33, 206, 194, 0.4'
    },
    {
      backgroundColor: 'rgba(255, 102, 102, 0.8)',
      borderColor: 'rgba(255, 66, 66, 0.6)',
      hoverBackgroundColor: 'rgba(255, 102, 102, 1)',
      hoverBorderColor: 'rgba(255, 66, 66, 0.4)'
    },
    {
      backgroundColor: 'rgba(26, 102, 255, 0.8)',
      borderColor: 'rgba(226, 219, 13, 0.6)',
      hoverBackgroundColor: 'rgba(26, 102, 255, 1)',
      hoverBorderColor: 'rgba(226, 219, 13, 0.4)'
    },
    {
      backgroundColor: 'rgba(255, 153, 0, 0.8)',
      borderColor: 'rgba(255, 153, 0, 0.6)',
      hoverBackgroundColor: 'rgba(255, 153, 0, 1)',
      hoverBorderColor: 'rgba(255, 153, 0, 0.4)'
    },
    {
      backgroundColor: 'rgba(0, 191, 255, 0.8)',
      borderColor: 'rgba(0, 191, 255, 1)',
      hoverBackgroundColor: 'rgba(0, 191, 255, 1)',
      hoverBorderColor: 'rgba(0, 191, 255, 0.4)'
    },
    {
      backgroundColor: 'rgba(204, 0, 102, 0.8)',
      borderColor: 'rgba(204, 0, 102, 0.6)',
      hoverBackgroundColor: 'rgba(204, 0, 102, 1)',
      hoverBorderColor: 'rgba(204, 0, 102, 0.4)'
    },
    {
      backgroundColor: 'rgba(29, 211, 69, 0.8)',
      borderColor: 'rgba(29, 211, 69, 0.6)',
      hoverBackgroundColor: 'rgba(29, 211, 69, 1)',
      hoverBorderColor: 'rgba(29, 211, 69, 0.4)'
    },
    {
      backgroundColor: 'rgba(230, 189, 89, 0.8)',
      borderColor: 'rgba(230, 189, 89, 0.6)',
      hoverBackgroundColor: 'rgba(230, 189, 89, 1)',
      hoverBorderColor: 'rgba(230, 189, 89, 0.4)'
    },
    {
      backgroundColor: 'rgba(255, 77, 255, 0.8)',
      borderColor: 'rgba(255, 77, 255, 0.6)',
      hoverBackgroundColor: 'rgba(255, 77, 255, 1)',
      hoverBorderColor: 'rgba(255, 77, 255, 0.4)'
    },
    {
      backgroundColor: 'rgba(0, 210, 10, 0.8)',
      borderColor: 'rgba(0, 230, 0, 1)',
      hoverBackgroundColor: 'rgba(0, 230, 0, 1)',
      hoverBorderColor: 'rgba(0, 230, 0, 0.4)'
    }
  ];

  public lineChartLegend = true;

  public lineChartType = 'bar';

  public setChartContainerHeight = window.innerWidth <= 970 && window.innerWidth >= 960 ? '50vh' : '55vh';

  public chartMethods = {
    updateLineChartData(obj, sumOfEveryDay, data, propName, buyers) {
      const tempArr = [];
      for (const e of data) {
        const optObj = {
          data: e,
          label: propName[data.indexOf(e)].name,
          yAxesID: 'yAxes_managers',
          fill: false,
          type: 'bar',
          borderWidth: 1,
          hoverBorderWidth: 2
        };
        // действия для группирования медиа баеров
        if (!buyers.includes(propName[data.indexOf(e)].name)) {
          obj.push(optObj);
        } else {
          tempArr.push(optObj.data);
        }

      }
      const optObjForRevDay = {
        data: sumOfEveryDay,
        label: 'Total',
        yAxesID: 'yAxes_revenue',
        fill: false,
        pointBorderWidth: 2,
        pointRadius: 4,
        type: 'line',
        borderWidth: 3,
        hoverBorderWidth: 4,
        steppedLine: false,
        showLine: true,
        tension: 0.1,
        hidden: true
      };
      // действия для группирования медиа баеров
/*      const MediaBuyersArray = this.setGroupMediaBuyers(tempArr);
      obj.push(MediaBuyersArray);*/

      obj.push(optObjForRevDay);
    },
    // действия для группирования медиа баеров
    setGroupMediaBuyers(dataset) {
      const groupData = dataset.length
        ? dataset[0].map((el, i) => {
          el = 0;
          for (let data of dataset) {
            data = data.map((int) => {
              return parseFloat(int);
            });
            el += data[i];
          }
          return Math.round(el * 100) / 100;
        })
        : [0];
      return {
        data: groupData,
        label: 'Media Buyers',
        yAxesID: 'yAxes_managers',
        fill: false,
        type: 'bar',
        borderWidth: 1,
        hoverBorderWidth: 2
      };
    }
  };
}
