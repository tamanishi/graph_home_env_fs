async function render() {
  const db = firebase.firestore();
  const measurementsRef = db.collection('measurements');
  let rawData = [];
  const last1DaySnapshot = await measurementsRef.orderBy('datetime', 'desc').limit(24 * 4).get();
  last1DaySnapshot.forEach(doc => {
    let data = doc.data();
    let meas = {
      timestamp: data.datetime,
      temperature: data.temperature,
      pressure: data.pressure,
      humidity: data.humidity,
      co2: data.co2,
      dust: data.dust
    };
    rawData.unshift(meas);
  });

  const temperatureData = rawData.map((e, i, a) => {
    return [Date.parse(e.timestamp), Number(e.temperature)];
  });

  const humidityData = rawData.map((e, i, a) => {
    return [Date.parse(e.timestamp), Number(e.humidity)];
  });

  const pressureData = rawData.map((e, i, a) => {
    return [Date.parse(e.timestamp), Number(e.pressure)];
  });

  const co2Data = rawData.map((e, i, a) => {
    return [Date.parse(e.timestamp), Number(e.co2)];
  });

  const dustData = rawData.map((e, i, a) => {
    return [Date.parse(e.timestamp), Number(e.dust)];
  });

  // console.log(temperatureData);
  // console.log(humidityData);
  // console.log(pressureData);
  // console.log(co2Data);
  // console.log(dustData);

  Highcharts.setOptions({
    global: {
      useUTC: false
    },
    time: {
      timezone: 'Asia/Tokyo'
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
          text: 'temperature (\'C)',
          style: {
            color: "#f18c16"
          }
        },
        labels: {
          style: {
            color: "#f18c16"
          }
        },
        ceiling: 37,
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
        ceiling: 90,
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
      },
      {
        gridLineWidth: 0,
        title: {
          text: 'co2 (ppm)',
          style: {
            color: "#ffee58"
          }
        },
        labels: {
          style: {
            color: "#ffee58"
          }
        },
        ceiling: 3000,
        floor: 400,
        opposite: true
      },
      {
        gridLineWidth: 0,
        title: {
          text: 'dust (ug/m3)',
          style: {
            color: "#ca99ff"
          }
        },
        labels: {
          style: {
            color: "#ca99ff"
          }
        },
        ceiling: 300,
        floor: 0,
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
        name: 'temperature (\'C)',
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
      },
      {
        name: 'co2 (ppm)',
        data: co2Data,
        color: '#ffee58',
        yAxis: 3
      },
      {
        name: 'dust (ug/m3)',
        data: dustData,
        color: '#ca99ff',
        yAxis: 4
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
