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
  "dt": 1460235600,
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

What we really care about is `data.list[element].dt`, which is a timestamp that we'll have to convert to a human readable date, and `data.list[element].main.temp`, the temperature at that time.

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
        dates.push(list[i].dt);
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

Now we have the necessary data for our graph, but the timestamp is a huge number and not in a human readable format! This timestamp is an epoch data, meaning it's the seconds that have passed since 01.01.1970 (TK double check date, not 100% sure it's 1970). Using the JavaScript `Date` primitive, we can create a human readable date, but that takes milliseconds, so we'll have to take the timestamp times 1000 and then create a `new Date(timestamp * 1000)`.

Lets save the data in that format:

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
        dates.push(new Date(list[i].dt * 1000));
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
        dates.push(new Date(list[i].dt * 1000));
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
          <label>City, Country
            <input
              placeholder={"City, Country"}
              type="text"
              value={this.state.location}
              onChange={this.changeLocation}
            />
          </label>
        </form>
        <p>The current temperature is { currentTemp }!</p>
        <h2>Forecast</h2>
        <Plot
          xData={this.state.dates}
          yData={this.state.temps}
          type="scatter"
        />
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
          <label>City, Country
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
          <div>
            <p>The current temperature is { currentTemp }!</p>
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

Awesome! Normally, creating a graph like this would take ages, but Plotly.js makes this incredibly easy!

TK Challenge

# Summary of this chapter

We've created a new `Plot` component, shaped the data we get from the OpenWeatherMap API to suit our needs and used Plotly.js to render a beautiful and interactive 5 day weather forecast!
