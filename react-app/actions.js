var constants = require('./constants');

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
