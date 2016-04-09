var React = require('react');

var App = React.createClass({
  render: function() {
    return (
      <div>
        <h1>Weather</h1>
        <form>
          <label>City: </label>
          <input type="text" />
        </form>
      </div>
    );
  }
});

module.exports = App;
