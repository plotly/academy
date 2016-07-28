// actions.js
import xhr from 'xhr';

export function changeLocation(location) {
	return {
		type: 'CHANGE_LOCATION',
		location: location
	};
}

export function setSelectedDate(date) {
  return {
    type: 'SET_SELECTED_DATE',
    date: date
  };
}

export function setSelectedTemp(temp) {
  return {
    type: 'SET_SELECTED_TEMP',
    temp: temp
  };
}

export function setData(data) {
  return {
    type: 'SET_DATA',
    data: data
  };
};

export function setDates(dates) {
  return {
    type: 'SET_DATES',
    dates: dates
  };
};

export function setTemps(temps) {
  return {
    type: 'SET_TEMPS',
    temps: temps
  };
};

export function fetchData(url) {
  return function thunk(dispatch) {
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
      // RENAME self.props.dispatch TO dispatch
      dispatch(setData(data));
      dispatch(setDates(dates));
      dispatch(setTemps(temps));
      dispatch(setSelectedDate(''));
      dispatch(setSelectedTemp(null));
    });
  }
}
