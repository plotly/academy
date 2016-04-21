var assign = require('object-assign');
var constants = require('./constants');

var initialState = {
  location: '',
  data: {},
  dates: [],
  temps: [],
  selected: {
    date: '',
    temp: null
  }
};

module.exports = function mainReducer(state, action) {
  state = state || initialState;
  switch (action.type) {
    case constants.SET_LOCATION:
      return assign({}, state, {
        location: action.location
      });
    case constants.SET_DATA:
      return assign({}, state, {
        data: action.data
      });
    case constants.SET_DATES:
      return assign({}, state, {
        dates: action.dates
      });
    case constants.SET_TEMPS:
      return assign({}, state, {
        temps: action.temps
      });
    case constants.SET_SELECTED_DATE:
      return assign({}, state, {
        selected: {
          date: action.date,
          temp: state.selected.temp
        }
      });
    case constants.SET_SELECTED_TEMP:
      return assign({}, state, {
        selected: {
          date: state.selected.date,
          temp: action.temp
        }
      });
    default:
      return state;
  }
}
