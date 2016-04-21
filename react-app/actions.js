var xhr = require('xhr');
var constants = require('./constants');
var actions = require('./actions');

exports.setLocation = function (location) {
  return {
    type: constants.SET_LOCATION,
    location: location
  };
};

exports.setData = function (data) {
  return {
    type: constants.SET_DATA,
    data: data
  };
};

exports.setDates = function (dates) {
  return {
    type: constants.SET_DATES,
    dates: dates
  };
};

exports.setTemps = function (temps) {
  return {
    type: constants.SET_TEMPS,
    temps: temps
  };
};

exports.setSelectedDate = function (date) {
  return {
    type: constants.SET_SELECTED_DATE,
    date: date
  };
};

exports.setSelectedTemp = function (temp) {
  return {
    type: constants.SET_SELECTED_TEMP,
    temp: temp
  };
};

exports.loadData = function (url) {
  return function (dispatch) {
    xhr({
      url: url
    }, function (err, data) {
      var data = JSON.parse(data.body);
      var list = data.list;
      var dates = [];
      var temps = [];
      for (var i = 0; i < list.length; i++) {
        dates.push(list[i].dt_txt);
        temps.push(list[i].main.temp);
      }

      dispatch(actions.setData(data));
      dispatch(actions.setDates(dates));
      dispatch(actions.setTemps(temps));
      dispatch(actions.setSelectedDate(''));
      dispatch(actions.setSelectedTemp(null));
    });
  }
};
