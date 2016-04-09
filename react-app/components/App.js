var React = require('react');

var App = React.createClass({
  getInitialState: function() {
    return {
      city: ''
    };
  },
  fetchData: function(e) {
    e.preventDefault();
    console.log('fetch weather for', this.state.city);
  },
  changeCity: function(evt) {
    this.setState({
      city: evt.target.value
    });
  },
  render: function() {
    return (
      <div>
        <h1>Weather</h1>
        <form onSubmit={this.fetchData}>
          <label>City: </label>
          <input
            value={this.state.city}
            onChange={this.changeCity}
            type="text"
          />
        </form>
      </div>
    );
  }
});

module.exports = App;
