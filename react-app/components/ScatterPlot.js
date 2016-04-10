var React = require('react');

var ScatterPlot = React.createClass({
  componentDidMount: function() {
    console.log(this.props.x, this.props.y);
    Plotly.newPlot('plotly', [{
      x: this.props.x,
      y: this.props.y,
      type: 'scatter'
    }]);
  },
  render: function() {
    return (
      <div id="plotly"></div>
    );
  }
});

module.exports = ScatterPlot;
