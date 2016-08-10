/* global Plotly */
// Plot.js
import React, { Component } from 'react';

class Plot extends Component {
  drawPlot = () => {
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
    document.getElementById('plot').on('plotly_click', this.props.onPlotClick);
  }

  shouldComponentUpdate(nextProps) {
    const xDataChanged = !this.props.xData.equals(nextProps.xData);
		const yDataChanged = !this.props.yData.equals(nextProps.yData);

		return xDataChanged || yDataChanged;
  }

  componentDidUpdate() {
    this.drawPlot();
  }

  componentDidMount() {
    this.drawPlot();
  }

  render() {
    return (
      <div id="plot"></div>
    );
  }
}

export default Plot;
