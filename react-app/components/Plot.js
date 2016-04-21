// components/Plot.js
var React = require('react');

var Plot = React.createClass({
  drawPlot: function() {
    Plotly.newPlot('plot', [{
      x: this.props.xData,
      y: this.props.yData,
      type: this.props.type
    }]);
  },
  componentDidMount: function() {
    this.drawPlot();
  },
  componentDidUpdate: function() {
    this.drawPlot();
  },
  render: function() {
    return (
      <div id="plot"></div>
    );
  }
});

module.exports = Plot;
