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

    this.props.dispatch(actions.loadData(url));
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
    var currentTemp = 'not loaded yet';
    if (this.props.data.list) {
      currentTemp = this.props.data.list[0].main.temp;
    }
    return (
      <div>
        <h1>Weather</h1>
        <form onSubmit={this.fetchData}>
          <label>I want to know the weather for
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
          <div className="wrapper">
            {/* Render the current temperature if no specific date is selected */}
            <p className="temp-wrapper">
              <span className="temp">
                { this.props.selected.temp ? this.props.selected.temp : currentTemp }
              </span>
              <span className="temp-symbol">°C</span>
              <span className="temp-date">
                { this.props.selected.temp ? this.props.selected.date : ''}
              </span>
            </p>
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
