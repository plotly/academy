// Plot.js
import React, { Component } from 'react';

class Plot extends Component {
  drawPlot = () => {
    Plotly.newPlot('plot', [{
      x: this.props.xData,
      y: this.props.yData,
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
  }
  componentDidUpdate() {
    this.drawPlot();
  }

  componentDidMount() {
    this.drawPlot();
  }

  render() {
    return (
      <div id="plot" ref="plot"></div>
    );
  }
}

export default Plot;
