var constants = require('./constants');
var immutable = require('immutable');

var initialState = immutable.fromJS({
  location: '',
  data: {},
  dates: [],
  temps: [],
  selected: {
    date: '',
    temp: null
  }
});

module.exports = function mainReducer(state, action) {
  state = state || initialState;
  switch (action.type) {
    case constants.SET_LOCATION:
      return state.set('location', action.location);
    case constants.SET_DATA:
      return state.set('data', immutable.fromJS(action.data));
    case constants.SET_DATES:
      return state.set('dates', immutable.fromJS(action.dates));
    case constants.SET_TEMPS:
      return state.set('temps', immutable.fromJS(action.temps));
    case constants.SET_SELECTED_DATE:
      return state.setIn(['selected', 'date'], action.date);
    case constants.SET_SELECTED_TEMP:
      return state.setIn(['selected', 'temp'], action.temp);
    default:
      return state;
  }
}
