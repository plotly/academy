// components/Plot.js
var React = require('react');

var Plot = React.createClass({
  componentDidMount: function() {
    console.log(this.props);
    Plotly.newPlot('plot', [{
      x: this.props.xData,
      y: this.props.yData,
      type: this.props.type
    }]);
  },
  render: function() {
    return (
      <div id="plot"></div>
    );
  }
});

module.exports = Plot;
