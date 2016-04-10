var React = require('react');
var xhr = require('xhr');

var App = React.createClass({
  getInitialState: function() {
    return {
      city: '',
      data: {}
    };
  },
  fetchData: function(e) {
    e.preventDefault();
    var self = this;

    var location = encodeURIComponent(this.state.city);

    xhr({
      uri: 'http://api.openweathermap.org/data/2.5/forecast?q=' + location + '&APPID=APPID&units=metric'
    }, function (err, resp) {
      self.setState({
        data: JSON.parse(resp.body)
      });
    });
  },
  changeCity: function(evt) {
    this.setState({
      city: evt.target.value
    });
  },
  render: function() {
    var currentTemp;
    if (this.state.data.list && this.state.data.list.length > 0) {
      currentTemp = this.state.data.list[0].main.temp;
    }
    return (
      <div>
        <h1>Weather</h1>
        <form onSubmit={this.fetchData}>
          <label>City and Country: </label>
          <input
            value={this.state.city}
            onChange={this.changeCity}
            placeholder="City, Country"
            type="text"
          />
        </form>
        <div>
          { JSON.stringify(currentTemp, null, 2) }
        </div>
      </div>
    );
  }
});

module.exports = App;
