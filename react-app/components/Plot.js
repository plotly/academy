// components/Plot.js
var React = require('react');

var Plot = React.createClass({
  shouldComponentUpdate: function(prevProps) {
    var xChanged = !this.props.xData.equals(prevProps.xData);
    var yChanged = !this.props.yData.equals(prevProps.yData);
    var typeChanged = this.props.type !== prevProps.type;

    var shouldRender = xChanged || yChanged || typeChanged;

    return shouldRender;
  },
  drawPlot: function() {
    Plotly.newPlot('plot', [{
      x: this.props.xData.toJS(),
      y: this.props.yData.toJS(),
      type: this.props.type
    }], {
      margin: {
        t: 0, r: 0, l: 30
      },
      xaxis: {
        gridcolor: 'transparent'
      }
    }, {
      displayModeBar: false
    });
    this.refs.plot.on('plotly_click', this.props.onPlotClick);
  },
  componentDidMount: function() {
    this.drawPlot();
  },
  componentDidUpdate: function() {
    this.drawPlot();
  },
  render: function() {
    return (
      <div id="plot" ref="plot"></div>
    );
  }
});

module.exports = Plot;
