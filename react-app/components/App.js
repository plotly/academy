var React = require('react');
var xhr = require('xhr');
var connect = require('react-redux').connect;

var Plot = require('./Plot');
var actions = require('../actions');

var App = React.createClass({
  fetchData: function(evt) {
    evt.preventDefault();

    var location = encodeURIComponent(this.props.location);

    var urlPrefix = 'http://api.openweathermap.org/data/2.5/forecast?q=';
    var urlSuffix = '&APPID=dbe69e56e7ee5f981d76c3e77bbb45c0&units=metric';
    var url = urlPrefix + location + urlSuffix;

    var self = this;

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

      self.props.dispatch(actions.setData(data));
      self.props.dispatch(actions.setDates(dates));
      self.props.dispatch(actions.setTemps(temps));
      self.props.dispatch(actions.setSelectedDate(''));
      self.props.dispatch(actions.setSelectedTemp(null));
    });
  },
  onPlotClick: function(data) {
    if (data.points) {
      var number = data.points[0].pointNumber;
      this.props.dispatch(actions.setSelectedDate(this.props.dates[number]));
      this.props.dispatch(actions.setSelectedTemp(this.props.temps[number]))
    }
  },
  changeLocation: function(evt) {
    this.props.dispatch(actions.setLocation(evt.target.value));
  },
  render: function() {
    console.log(this.props);
    var currentTemp = 'not loaded yet';
    if (this.props.data.list) {
      currentTemp = this.props.data.list[0].main.temp;
    }
    return (
      <div>
        <h1>Weather</h1>
        <form onSubmit={this.fetchData}>
          <label>City, Country
            <input
              placeholder={"City, Country"}
              type="text"
              value={this.props.location}
              onChange={this.changeLocation}
            />
          </label>
        </form>
        {/*
          Render the current temperature and the forecast if we have data
          otherwise return null
        */}
        {(this.props.data.list) ? (
          <div>
            {/* Render the current temperature if no specific date is selected */}
            {(this.props.selected.temp) ? (
              <p>The temperature on { this.props.selected.date } will be { this.props.selected.temp }°C</p>
            ) : (
              <p>The current temperature is { currentTemp }°C!</p>
            )}
            <h2>Forecast</h2>
            <Plot
              xData={this.props.dates}
              yData={this.props.temps}
              onPlotClick={this.onPlotClick}
              type="scatter"
            />
          </div>
        ) : null}

      </div>
    );
  }
});

module.exports = connect(function (state) {
  return state;
})(App);
