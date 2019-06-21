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
  // console.log(rawData[0].timestamp);
  let startDateTime = Date.parse(rawData[0].timestamp);
  var temperatureData = rawData.map((e, i, a) => {
    return Number(e.temperature);
  });

  var humidityData = rawData.map((e, i, a) => {
    return Number(e.humidity);
  });

  var pressureData = rawData.map((e, i, a) => {
    return Number(e.pressure);
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
      backgroundColor: '#222222'
    },

    title: {
      text: 'home environment (last 24 hours)',
      style: {
        color: '#eeeeee'
      }
    },

    // subtitle: {
    //   text: 'Source: thesolarfoundation.com'
    // },

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
        // className: "highcharts-color-0",
        title: {
          text: "temperature",
          style: {
            color: "#f18c16"
          }
        },
        labels: {
          format: "{value}℃",
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
          text: 'humidity',
          style: {
            color: "#7cb5ec"
          }
        },
        labels: {
          format: "{value} %",
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
          text: 'pressure',
          style: {
            color: "#90ed7d"
          }
        },
        labels: {
          format: "{value} hPa",
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
        //   label: {
        //     connectorAllowed: false
        //   }
      }
    },

    series: [
      {
        name: 'temperature',
        data: temperatureData,
        type: 'spline',
        color: '#f18c16',
        pointStart: startDateTime,
        pointInterval: 60 * 15 * 1000,
        yAxis: 0
      },
      {
        name: 'humidity',
        data: humidityData,
        type: 'spline',
        color: '#7cb5ec',
        pointStart: startDateTime,
        pointInterval: 60 * 15 * 1000,
        yAxis: 1
      },
      {
        name: 'pressure',
        data: pressureData,
        type: 'spline',
        color: '#90ed7d',
        pointStart: startDateTime,
        pointInterval: 60 * 15 * 1000,
        yAxis: 2
      }
    ],

    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom'
          }
        }
      }]
    }
  });
}

firebase.auth().signInAnonymously().catch(function(error) {
  console.log("signIn failed");
});

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log("isAnonymous : " + user.isAnonymous);
    console.log("user.uid : " + user.uid);
  } else {
    console.log("signOut");
  }
});

render();

setInterval(function () {
  render();
}, 15 * 60 * 1000);
