---
title: React with Plotly.js
description: How to use Plotly.js with React
layout: post
---

To use `plotly.js`, we need to add it to our application first. Copy and paste this snippet into our `index.html`:

```HTML
<script src="https://cdn.plot.ly/plotly-1.8.0.min.js"></script>
```

> Be aware that positioning matters here – you need to put this `script` tag above our `bundle.js` `script` tag, otherwise it won't work!

# Plotly

Including this script gives us access to the `Ploty` variable in our code. Using `Plotly.newPlot`, we can easily create graphs to showcase the weather data:

```JS
Plotly.newPlot();
```

A plot without data doesn't showcase much though, we need to parse the data we get from the OpenWeatherMap API and pass it to our `newPlot` call! The first argument is the id of the DOM element we want to render our plot into. The second argument is an array of objects with a few properties for our plot, with `x`, `y` and `type` being the most relevant for us. Plotly.js makes it easy to create a wide variety of plots, the one we care about the most at the moment is a `scatter` plot, which looks like this:

TK screenshot of plotly.js scatter plot

As you can see, it's perfect for a weather forecast! This is structurally what our `Plotly.newPlot` call will look like:

```JS
Plotly.newPlot('someDOMElementId', {
  x: ourXAxisData,
  y: ourYAxisData,
  type: 'scatter'
});
```

To actually get this done though, we need to create a new component first. We'll call it `Plot` (what a surprise!), so add a new file in your `components/` folder called `Plot.js`, and render just a div:

```JS
// components/Plot.js
var React = require('react');

var Plot = React.createClass({
  render: function() {
    return (
      <div id="plot"></div>
    );
  }
});

module.exports = Plot;
```

> As you can see, I've added a `div` with an ID of `plot` above. This is the DOM element we'll reference in our `Plotly.newPlot` call!

Now, the problem we have here is that if we called `Plotly.newPlot` in our `render` method, it would be called over and over again, possibly multiple times per second! That's not optimal, we really want to call it once when we get the data and leave it be afterwards – how can we do that?

Thankfully, React gives us a lifecycle method called `componentDidMount`. It is called once when the component was first rendered, and never afterwards; perfect for our needs! Lets create a `componentDidMount` method and call `Plotly.newPlot` in there and pass it the ID of our `div`, `plot`, as the first argument:

```JS
// components/Plot.js
var React = require('react');

var Plot = React.createClass({
  componentDidMount: function() {
    Plotly.newPlot('plot');
  },
  render: function() {
    return (
      <div id="plot"></div>
    );
  }
});

module.exports = Plot;
```

That alone won't do much though, we need to give it data too! The problem is that we need the data for the x-axis and the y-axis to be separate, but the data we get from the OpenWeatherMap API doesn't make that distinction. This means we need to shape our data a little bit to suit our needs. What we want is human readable dates on the x-axis, and the degrees at that time on the y-axis!

Lets jump back to our `App` component, and start changing the data a little bit. We'll do that in the `fetchData` method, so we only recalculate the data when new one comes in and not on every render. (which would possibly mean shaping the data every second or more!) This is what happens when the data comes back in at the moment:

```JS
// components/App.js
var React = require('react');
var xhr = require('xhr');

var App = React.createClass({
  getInitialState: function() { /* … */ },
  fetchData: function(evt) {

    /* … */

    xhr({
      url: url
    }, function (err, data) {
      self.setState({
        data: data
      });
    });
  },
  changeLocation: function(evt) { /* … */ },
  render: function() { /* … */ }
});
```

Instead of just saving the raw data in our `xhr` callback, lets shape the data into a form we can use it in and save both the raw and the formed data in our component state. Remember, this is what the raw data looks like:

```JS
"city": {
  "id": 2761369,
  "name": "Vienna",
  "coord": {
    "lon": 16.37208,
    "lat": 48.208488
  },
  "country": "AT",
  "population": 0,
  "sys": {
    "population": 0
  }
},
"cod": "200",
"message": 0.0046,
"cnt": 40,
"list": [ /* Hundreds of objects here */ ]
```

With the `list` array containing objects of this form:

```JS
{
  "dt_txt": "2016-04-09 18:00:00",
  "main": {
    "temp": 6.94,
    "temp_min": 6.4,
    "temp_max": 6.94
  },
  "weather": [
    {
      "main": "Rain",
      /* …more data here */
    }
  ],
  /* …more data here */
}
```

What we really care about is `data.list[element].dt_txt`, a human-readable timestamp, and `data.list[element].main.temp`, the temperature at that time.

Lets loop through all the weather information we have, making two arrays of different data. We'll use the `push` method of arrays, which adds an element to the end of an arary. Lets fill one with the timestamps, and another array with the temperatures:

```JS
// components/App.js
var React = require('react');
var xhr = require('xhr');

var App = React.createClass({
  getInitialState: function() { /* … */ },
  fetchData: function(evt) {

    /* … */

    xhr({
      url: url
    }, function (err, data) {

      var data = JSON.parse(data.body);
      var list = data.list;
      var dates = [];
      var temps = [];
      for (var i = 0; i < list.length; i++) {
        dates.push(list[i].dt_txt);
        temps.push(list[i].main.temp);
      }

      self.setState({
        data: data
      });
    });
  },
  changeLocation: function(evt) { /* … */ },
  render: function() { /* … */ }
});
```

Now we have exactly what we want, we just need to save it to our component state! Lets call the two properties of our state `dates` and `temperatures`:

```JS
// components/App.js
var React = require('react');
var xhr = require('xhr');

var App = React.createClass({
  getInitialState: function() { /* … */ },
  fetchData: function(evt) {

    /* … */

    xhr({
      url: url
    }, function (err, data) {

      var data = JSON.parse(data.body);
      var list = data.list;
      var dates = [];
      var temps = [];
      for (var i = 0; i < list.length; i++) {
        dates.push(list[i].dt_txt);
        temps.push(list[i].main.temp);
      }

      self.setState({
        data: data,
        dates: dates,
        temps: temps
      });
    });
  },
  changeLocation: function(evt) { /* … */ },
  render: function() { /* … */ }
});
```

We also need to add those new properties of our state to the `getInitialState` method:

```JS
// components/App.js
var React = require('react');
var xhr = require('xhr');

var App = React.createClass({
  getInitialState: function() {
    return {
      location: '',
      data: {},
      dates: [],
      temps: []
    }
  },
  fetchData: function(evt) { /* … */ },
  changeLocation: function(evt) { /* … */ },
  render: function() { /* … */ }
});
```

Now that we have that data saved in our component state, we can render our plot! `require` our `Plot` component, and pass it `this.state.dates` as the x-axis data, `this.state.temps` as the y-axis data and we'll also pass it a `type` prop of `"scatter"`!

```JS
// components/App.js
var React = require('react');
var xhr = require('xhr');

var Plot = require('./Plot.js');

var App = React.createClass({
  getInitialState: function() { /* … */ },
  fetchData: function(evt) { /* … */ },
  changeLocation: function(evt) { /* … */ },
  render: function() {
    var currentTemp = 'not loaded yet';
    if (this.state.data.list) {
      currentTemp = this.state.data.list[0].main.temp;
    }
    return (
      <div>
        <h1>Weather</h1>
        <form onSubmit={this.fetchData}>
          <label>I want to know the weather for
            <input
              placeholder={"City, Country"}
              type="text"
              value={this.state.location}
              onChange={this.changeLocation}
            />
          </label>
        </form>
        <div className="wrapper">
          <p className="temp-wrapper">
            <span className="temp">{ currentTemp }</span>
            <span className="temp-symbol">°C</span>
          </p>
          <h2>Forecast</h2>
          <Plot
            xData={this.state.dates}
            yData={this.state.temps}
            type="scatter"
          />
        </div>
      </div>
    );
  }
});
```

We only want to render the current temperature and the forecast when we have data though, so lets add a ternary operator to check that `this.state.data.list` exists:

```JS
// components/App.js
var React = require('react');
var xhr = require('xhr');

var Plot = require('./Plot.js');

var App = React.createClass({
  getInitialState: function() { /* … */ },
  fetchData: function(evt) { /* … */ },
  changeLocation: function(evt) { /* … */ },
  render: function() {
    var currentTemp = 'not loaded yet';
    if (this.state.data.list) {
      currentTemp = this.state.data.list[0].main.temp;
    }
    return (
      <div>
        <h1>Weather</h1>
        <form onSubmit={this.fetchData}>
          <label>I want to know the weather for
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
          <div className="wrapper">
            <p className="temp-wrapper">
              <span className="temp">{ currentTemp }</span>
              <span className="temp-symbol">°C</span>
            </p>
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
```

If you try doing this now, you still won't see a plot, do you know why? Because we aren't using the data we passed to our `Plot` component! This is what it looks like at the moment:

```JS
// components/Plot.js
var React = require('react');

var Plot = React.createClass({
  componentDidMount: function() {
    Plotly.newPlot('plot');
  },
  render: function() {
    return (
      <div id="plot"></div>
    );
  }
});

module.exports = Plot;
```

Let's make this work by adapting the `Plotly.newPlot` call. We need to pass `this.props.xData`, `this.props.yData` and `this.props.type` to it:

```JS
// components/Plot.js
var React = require('react');

var Plot = React.createClass({
  componentDidMount: function() {
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
```

Now try it! You'll see a beautiful 5 day weather forecast rendered like this:

TK screenshot of working app

Awesome! Normally, creating a graph like this would take ages, but Plotly.js makes it incredibly easy!

There is one problem though: When we change the city and refetch data, the graph doesn't update. This is the case because we're solely using the `componentDidMount` lifecycle method, which is only ever called once when the component mounts. We also need to draw the plot again when new data comes in, i.e. when the component did update! (*hinthint*)

As you might have guessed, we can use the `componentDidUpdate` lifecycle method of our `Plot` component to fix this:

```JS
// components/Plot.js
var React = require('react');

var Plot = React.createClass({
  componentDidMount: function() {
    Plotly.newPlot('plot', [{
      x: this.props.xData,
      y: this.props.yData,
      type: this.props.type
    }]);
  },
  componentDidUpdate: function() {
    Plotly.newPlot('plot', [{
      x: this.props.xData,
      y: this.props.yData,
      type: this.props.type
    }]);
  },
  render: function() { /* … */ }
});

module.exports = Plot;
```

Trying this out, it works perfectly! There is one tiny improvement, code wise, that could be done. Instead of copy and pasting the `Plotly.newPlot` call (which is identical), we should factor that out into a `drawPlot` method and call `this.drawPlot` from `componentDidMount/Update`:

```JS
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
  render: function() { /* … */ }
});

module.exports = Plot;
```

Beautiful, and works perfectly too!

Lets add one more feature to our weather application. When clicking on a specific point of our graph, we want to show the user in text the temperature at that date!

The first thing we need to do is add an event listener to our graph. Thankfully, Plotly gives us a handy `plotly_click` event to listen to, like so:

```JS
someDOMElement.on('plotly_click', function(data) {
  /* …do something here with the data… */
});
```

The nice thing about `plotly_click` is that it doesn't pass you the event, it passes you a very useful `data` object. We care about one particular property of that `data` object:

```JS
{
  "points": [{
    "pointNumber": 7,
    /* …more data here… */
  }]
}
```

This `pointNumber` property of a point in the `points` array specifies the how manieth point the user clicked on. This allows us to get all the relevant data for the point that was clicked on from our downloaded data! `this.state.dates[pointNumber]` and `this.state.temps[pointNumber]` in the `App` component will give us the date and temperature (respectively) of the point that was clicked on. We'll pass a function down to the `Plot` component called `onPlotClick` that will get called when the `plotly_click` event is fired, i.e. when a point on our forecast is clicked on.

Lets start off by binding that event listener in our `Plot` component. We need to somehow get the DOM node of our plot, and React makes that very easy. We add a `ref` property of `"plot"` to our `div`, which'll allow us to access the DOM node of said plot with `this.refs.plot`:

```JS
// components/Plot.js
var React = require('react');

var Plot = React.createClass({
  drawPlot: function() { /* … */ },
  componentDidMount: function() { /* … */ },
  componentDidUpdate: function() { /* … */ },
  render: function() {
    return (
      <div id="plot" ref="plot"></div>
    );
  }
});

module.exports = Plot;
```

Now we can use `this.refs.plot` anywhere in our `Plot` component to get access to the DOM node of our rendered plot! Lets use that in our `drawPlot` method to bind the `plotly_click` event to `this.props.onPlotClick`!

```JS
// components/Plot.js
var React = require('react');

var Plot = React.createClass({
  drawPlot: function() {
    Plotly.newPlot( /* … */ );
    this.refs.plot.on('plotly_click', this.props.onPlotClick);
  },
  componentDidMount: function() { /* … */ },
  componentDidUpdate: function() { /* … */ },
  render: function() {
    return (
      <div id="plot" ref="plot"></div>
    );
  }
});

module.exports = Plot;
```

Perfect, but running this will not work since we don't pass a `onPropClick` prop to `Plot`. Lets jump to our `App` component and change that. First, we pass an `onPlotClick` prop to our `Plot` component calling our `App` components (current missing) `this.onPropClick` method:

```JS
var React = require('react');
var xhr = require('xhr');

var Plot = require('./Plot');

var App = React.createClass({
  getInitialState: function() { /* … */ },
  fetchData: function(evt) { /* … */ },
  changeLocation: function(evt) { /* … */ },
  render: function() {
    /* … */
    return (
      { /* … */ }
      <Plot
        xData={this.state.dates}
        yData={this.state.temps}
        onPlotClick={this.onPlotClick}
        type="scatter"
      />
      { /* … */ }
    );
  }
});

module.exports = App;
```

The we add a first version of the `onPlotClick` method to our `App` component where we only log out the passed `data`:

```JS
var React = require('react');
var xhr = require('xhr');

var Plot = require('./Plot');

var App = React.createClass({
  getInitialState: function() { /* … */ },
  fetchData: function(evt) { /* … */ },
  onPlotClick: function(data) {
    console.log(data);
  },
  changeLocation: function(evt) { /* … */ },
  render: function() {
    /* … */
    return (
      { /* … */ }
      <Plot
        xData={this.state.dates}
        yData={this.state.temps}
        onPlotClick={this.onPlotClick}
        type="scatter"
      />
      { /* … */ }
    );
  }
});

module.exports = App;
```

Now try opening your application, select a city and, when the forecast has rendered, click on a specific data point in the plot. If you see an object logged in your console containing an array called `points`, you're golden!

Instead of logging the data, we now want to save that data in our state. Lets add a new object to our initial state called `selected`, which contains a `date` and a `temp` field. The date field will be an empty string by default, and the temp `null`:

```JS
var React = require('react');
var xhr = require('xhr');

var Plot = require('./Plot');

var App = React.createClass({
  getInitialState: function() {
    return {
      location: '',
      data: {},
      dates: [],
      temps: [],
      selected: {
        date: '',
        temp: null
      }
    };
  },
  fetchData: function(evt) { /* … */ },
  onPlotClick: function(data) {
    console.log(data);
  },
  changeLocation: function(evt) { /* … */ },
  render: function() { /* … */ }
});

module.exports = App;
```

Now, when our `onPlotClick` method is called we'll set the `selected.date` to `this.state.dates[data.points[0].pointNumber]`, and the the `selected.temp` to `this.state.temps[data.points[0].pointNumber]`:

```JS
var React = require('react');
var xhr = require('xhr');

var Plot = require('./Plot');

var App = React.createClass({
  getInitialState: function() {
    return {
      location: '',
      data: {},
      dates: [],
      temps: [],
      selected: {
        date: '',
        temp: null
      }
    };
  },
  fetchData: function(evt) { /* … */ },
  onPlotClick: function(data) {
    if (data.points) {
      var number = data.points[0].pointNumber;
      this.setState({
        selected: {
          date: this.state.dates[number],
          temp: this.state.temps[number]
        }
      });
    }
  },
  changeLocation: function(evt) { /* … */ },
  render: function() {
    /* … */
    return (
      { /* … */ }
      <Plot
        xData={this.state.dates}
        yData={this.state.temps}
        onPlotClick={this.onPlotClick}
        type="scatter"
      />
      { /* … */ }
    );
  }
});

module.exports = App;
```

Now that we have the necessary data in our state, we need to do something with it! Lets render some text saying "The current temperature on some-date is some-temperature°C!" if we have a date selected, and otherwise show the current date. We thus need to adapt the `render` method of our `App` component to include that. We check if `this.state.selected.temp` exists (i.e. isn't `null`, the default value), and if it does we render the text with `this.state.selected`:

```JS
var React = require('react');
var xhr = require('xhr');

var Plot = require('./Plot');

var App = React.createClass({
  getInitialState: function() { /* … */ },
  fetchData: function(evt) { /* … */ },
  onPlotClick: function(data) {
    if (data.points) {
      var number = data.points[0].pointNumber;
      this.setState({
        selected: {
          date: this.state.dates[number],
          temp: this.state.temps[number]
        }
      });
    }
  },
  changeLocation: function(evt) { /* … */ },
  render: function() {
    var currentTemp = 'not loaded yet';
    if (this.state.data.list) {
      currentTemp = this.state.data.list[0].main.temp;
    }
    return (
      <div>
        <h1>Weather</h1>
        <form onSubmit={this.fetchData}>
          <label>I want to know the weather for
            <input
              placeholder={"City, Country"}
              type="text"
              value={this.state.location}
              onChange={this.changeLocation}
            />
          </label>
        </form>
        {(this.state.data.list) ? (
          <div className="wrapper">
            {/* Render the current temperature if no specific date is selected */}
            <p className="temp-wrapper">
              <span className="temp">
                { this.state.selected.temp ? this.state.selected.temp : currentTemp }
              </span>
              <span className="temp-symbol">°C</span>
              <span className="temp-date">
                { this.state.selected.temp ? this.state.selected.date : ''}
              </span>
            </p>
            <h2>Forecast</h2>
            <Plot
              xData={this.state.dates}
              yData={this.state.temps}
              onPlotClick={this.onPlotClick}
              type="scatter"
            />
          </div>
        ) : null}

      </div>
    );
  }
});

module.exports = App;
```

Try opening your app again and clicking on a point on the graph, and you'll see our new functionality! There is one small user experience improvement we could do. When switching to a new city, the text persists because `this.state.selected.temp` still references the old data—in reality want to show the current temperature though!

To fix this, we set `selected` back to the default values in our `fetchData` method when the request has returned data:

```JS
var React = require('react');
var xhr = require('xhr');

var Plot = require('./Plot');

var App = React.createClass({
  getInitialState: function() { /* … */ },
  fetchData: function(evt) {
    /* … */
    xhr({
      url: url
    }, function (err, data) {

      /* … */
      /* Save the data, and reset the selected time to the default values */
      self.setState({
        data: data,
        dates: dates,
        temps: temps,
        selected: {
          date: '',
          temp: null
        }
      });
    });
  },
  onPlotClick: function(data) { /* … */ },
  changeLocation: function(evt) { /* … */ },
  render: function() { /* … */ }
});

module.exports = App;
```

Perfect, this now works beautifully! As you can see, another huge benefit of Plotly.js is that it makes interactivity really easy in combination with React.
Congratulations, you've built your first working application!

TK Challenge

# Summary of this chapter

We've created a new `Plot` component, shaped the data we get from the OpenWeatherMap API to suit our needs and used Plotly.js to render a beautiful and interactive 5 day weather forecast!
