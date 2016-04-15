var React = require('react');
var xhr = require('xhr');

var Plot = require('./Plot');

var App = React.createClass({
  getInitialState: function() {
    return {
      location: '',
      data: {},
      dates: [],
      temps: []
    };
  },
  fetchData: function(evt) {
    evt.preventDefault();

    var location = encodeURIComponent(this.state.location);

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
        dates.push(new Date(list[i].dt * 1000));
        temps.push(list[i].main.temp);
      }

      self.setState({
        data: data,
        dates: dates,
        temps: temps
      });
    });
  },
  changeLocation: function(evt) {
    this.setState({
      location: evt.target.value
    });
  },
  render: function() {
    var currentTemp = 'not loaded yet';
    if (this.state.data.list) {
      currentTemp = this.state.data.list[0].main.temp;
    }
    return (
      <div>
        <h1>Weather</h1>
        <form onSubmit={this.fetchData}>
          <label>City, Country
            <input
              placeholder={"City, Country"}
              type="text"
              value={this.state.location}
              onChange={this.changeLocation}
            />
          </label>
        </form>
        {/*
          Render the current temperature and the forecast if we have data
          otherwise return null
        */}
        {(this.state.data.list) ? (
          <div>
            <p>The current temperature is { currentTemp }!</p>
            <h2>Forecast</h2>
            <Plot
              xData={this.state.dates}
              yData={this.state.temps}
              type="scatter"
            />
          </div>
        ) : null}

      </div>
    );
  }
});

module.exports = App;
