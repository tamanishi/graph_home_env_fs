async function render() {
  var db = firebase.firestore();
  var measurementsRef = db.collection('measurements');
  var rawData = [];
  let last1DaySnapshot = await measurementsRef.orderBy('datetime', 'desc').limit(24 * 4).get();
  last1DaySnapshot.forEach(doc => {
    let data = doc.data();
    let meas = {
      timestamp: data.datetime,
      temperature: data.temperature,
      pressure: data.pressure,
      humidity: data.humidity
    };
    rawData.unshift(meas);
  });

  var temperatureData = rawData.map((e, i, a) => {
    return [Date.parse(e.timestamp), Number(e.temperature)];
  });

  var humidityData = rawData.map((e, i, a) => {
    return [Date.parse(e.timestamp), Number(e.humidity)];
  });

  var pressureData = rawData.map((e, i, a) => {
    return [Date.parse(e.timestamp), Number(e.pressure)];
  });

  // console.log(temperatureData);
  // console.log(humidityData);
  // console.log(pressureData);

  Highcharts.setOptions({
    global: {
      useUTC: false
    }
  });

  Highcharts.chart('container', {
    chart: {
      type: 'spline',
      backgroundColor: '#222222'
    },

    title: {
      text: 'home environment (last 24 hours)',
      style: {
        color: '#eeeeee'
      }
    },

    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        minute: '%H:%M',
        // hour: '%m/%d %H:%M',
        hour: '%H:%M',
        day: '%Y/%m/%d',
        week: '%Y/%m/%d',
        month: '%Y/%m',
        year: '(%Y)'
      },
      labels: {
        style: {
          color: '#eeeeee'
        }
      }
    },

    yAxis: [
      {
        title: {
          text: "temperature (℃)",
          style: {
            color: "#f18c16"
          }
        },
        labels: {
          style: {
            color: "#f18c16"
          }
        },
        ceiling: 35,
        floor: 0,
      },
      {
        gridLineWidth: 0,
        title: {
          text: 'humidity (%)',
          style: {
            color: "#7cb5ec"
          }
        },
        labels: {
          style: {
            color: "#7cb5ec"
          }
        },
        ceiling: 80,
        floor: 20,
        opposite: true
      },
      {
        gridLineWidth: 0,
        title: {
          text: 'pressure (hPa)',
          style: {
            color: "#90ed7d"
          }
        },
        labels: {
          style: {
            color: "#90ed7d"
          }
        },
        ceiling: 1300,
        floor: 800,
        opposite: true
      }
    ],

    legend: {
      layout: 'vertical',
      align: 'left',
      verticalAlign: 'top',
      floating: true,
      x: 80,
      y: 40,
      itemStyle: {
        color: '#eeeeee'
      }
    },

    plotOptions: {
      series: {
        marker: {
          enabled: false
        }
      }
    },

    series: [
      {
        name: 'temperature (℃)',
        data: temperatureData,
        color: '#f18c16',
        yAxis: 0
      },
      {
        name: 'humidity (%)',
        data: humidityData,
        color: '#7cb5ec',
        yAxis: 1
      },
      {
        name: 'pressure (hPa)',
        data: pressureData,
        color: '#90ed7d',
        yAxis: 2
      }
    ],

    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          yAxis: [
            {
              title: ''
            },
            {
              title: ''
            },
            {
              title: ''
            }
          ]
        }
      }]
    }
  });
}

render();

setInterval(function () {
  render();
}, 15 * 60 * 1000);
