---
title: The Basics
description: Starting to write our first React.js application, we learn how to structure our app and how to fetch data
layout: post
---

Lets use our knowledge to write an actual app! What we'll build is a weather application that'll display the current conditions and a 7 day forecast.

# Setup

Start by creating a file called `app.js`. Require `react` and `react-dom`, and `ReactDOM.render` a simple "Hello World" heading:

```JS
// app.js
var React = require('react');
var ReactDOM = require('react-dom');

ReactDOM.render(
  <h1>Hello World!</h1>,
  document.getElementById('react-root')
);
```

This on its own won't do anything, lets create an `index.html` file with some basic content:

```HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Weather</title>
</head>
<body>
  <div id="react-root"></div>
  <script src="bundle.js"></script>
</body>
</html>
```

If you look closely above, you'll see that we reference a script called `bundle.js`. Didn't we just create a file called `app.js`?! Well yes, but we have to transpile it with browserify.

First, install a few modules we'll need:

```sh
$ npm install react react-dom babelify babel-preset-react
```

Then transpile our first `app.js` with this browserify command:

```
browserify app.js -o bundle.js -t [ babelify --presets [ react ] ]
```

Finally open our `index.html` in the browser and you should see some text saying "Hello World!"!

# First steps

Instead of rendering `<h1>Hello World!</h1>`, we'll render a to-be-made `<App />` component. Create a subfolder called `components`, which all our React.js components will live in, and add a file called `App.js` in there. This is what your folder structure should look like:

```
weather-app/
├── app.js
└── components/
    └── App.js
```

Require and render said (still non-existant) `App` component from our main javascript entry point `app.js`:

```JS
// app.js
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./components/App.js');

ReactDOM.render(
  <App />,
  document.getElementById('react-root')
);
```

In the `components/App.js`, render a first heading saying "Weather".

```JS
// components/App.js
var React = require('react');

var App = React.createClass({
  render: function() {
    return (
      <h1>Weather</h1>
    );
  }
});
```

Refreshing the `index.html` file in your browser should now show a heading saying "Weather"! That's nice, but we'll need to be able to tell our app for which location we want the weather, so lets add a form with an input field and label that says "City, Country"!

```JS
// components/App.js
var React = require('react');

var App = React.createClass({
  render: function() {
    return (
      <div>
        <h1>Weather</h1>
        <form>
          <label>City, Country
            <input placeholder={"City, Country"} type="text" />
          </label>
        </form>
      </div>
    );
  }
});
```

> TK: Why do we nest inputs inside labels

When entering something into the input field and pressing "Enter", the page refreshes and nothing happens. What we really want to do is fetch the data when a city and a country are input. Lets add an `onSubmit` handler to the `form` and a `fetchData` function to our component!

```JS
// components/App.js
var React = require('react');

var App = React.createClass({
  fetchData: function(evt) {
    evt.preventDefault();
    console.log('fetch data!');
  },
  render: function() {
    return (
      <div>
        <h1>Weather</h1>
        <form onSubmit={this.fetchData}>
          <label>City, Country
            <input placeholder={"City, Country"} type="text" />
          </label>
        </form>
      </div>
    );
  }
});
```

By running `evt.preventDefault()` in fetchData (which is called when we press enter in the form), we tell the browser to not refresh the page and instead ignore whatever it wanted to and do what we tell it to. Right now, it logs "fetch data!" in the console over and over again whenever you submit the form. How do we get the entered city and country in that function though?

By storing the value of the text input in our local component state, we can grab it from that method. When we do that, we make our input a so-called "controlled input".

We'll store the currently entered location in `this.state.location`, and add a utility method to our component called `changeLocation` that is called `onChange` of the text input and sets the state to the current text:

```JS
// components/App.js
var React = require('react');

var App = React.createClass({
  fetchData: function(evt) { /* … */ },
  changeLocation: function(evt) {
    this.setState({
      location: evt.target.value
    });
  },
  render: function() {
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
      </div>
    );
  }
});
```

In our fetchData function, we can then access `this.state.location` to get the current location:

```JS
// components/App.js
var React = require('react');

var App = React.createClass({
  fetchData: function(evt) {
    evt.preventDefault();
    console.log('fetch data for', this.state.location);
  },
  changeLocation: function(evt) { /* … */ },
  render: function() { /* … */ }
});
```

Now, whichever location you enter it should log "fetch data for MyCity, MyCountry"!

# Fetching data

Lets get into fetching data. Instead of console logging a text, we need to get some weather information. We'll be using the [OpenWeatherMap API](api.openweathermap.org) for this task, which is a free service that provides access to data for basically all locations all around the world. You'll need to get an API key from it, so head over to [api.openweathermap.org](http://api.openweathermap.org) and register for a free account.

As soon as you've done that go to your account page, copy the `API key` and keep it somewhere safe.

TK screenshot of account page

Now that we have access to all the weather data our heart could desire, lets get on with our app!

Inside our `fetchData` function, we'll have to make a request to the API. I like to use a npm module called `xhr` for this, a wrapper around the JavaScript XMLHttpRequest that makes said requests a lot easier. Run `npm install xhr` to get it! While that's installing, `require` it in your App component at the top:

```JS
// components/App.js
var React = require('react');
var xhr = require('xhr');

var App = React.createClass({ /* … */ });
```

To get the data, the structure of the URL we'll request looks like this:

```
http://api.openweathermap.org/data/2.5/forecast?q=CITY,COUNTRY&APPID=YOURAPIKEY&units=metric
```

Replace `CITY,COUNTRY` with a city and country combination of choice and paste your copied API key from the OpenWeatherMap dashboard where it says `YOURAPIKEY`, and open that URL in your browser. (it should look something like this: `http://api.openweathermap.org/data/2.5/forecast?q=Vienna,Austria&APPID=asdf123&units=metric`)

What you'll get is a JSON object that has the following structure:

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

The top level `list` array contains time sorted weather data reaching forward 5 days. One of those weather objects looks like this: (only relevant lines shown)

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

The five properties we care about are: `dt`, the epoch time of the weather prediction, `temp`, the expected temperature, `temp_min` and `temp_max`, the, respectively, minimum and maximum expected temperature, and `weather[0].main`, a string description of the weather at that time. OpenWeatherMap gives us a lot more data than that though, and I encourage you to snoop around a bit more and see what you could use to make the application more comprehensive!

Now that we know what we need, lets get down to it – how do we actually fetch the data here? (by now `xhr` should have finished installing)

The general usage of `xhr` looks like this:

```JS
xhr({
  url: 'someURL'
}, function (err, data) {
  /* Called when the request is finished */
});
```

> TK: Show how horrible the native XMLHttpRequest version is, maybe

As you can see, everything we really need to take care of is constructing the url and saving the returned data somewhere!

We know that the URL has a prefix that's always the same, `http://api.openweathermap.org/data/2.5/forecast?q=`, and a suffix that's always the same, `&APPID=YOURAPIKEY&units=metric`. The sole thing we need to do is insert the location the user entered into the URL!

TK explanation how to change the units of the data we get back via the `units` URL parameter

Now, if you're thinking this through you know what might happen – the user might enter spaces in the input! URLs with spaces aren't valid, so it wouldn't work and everything would break! While that is true, JavaScript gives us a very handy method to escape non-URL-friendly characters. It is called `encodeURIComponent()`, and this is how one uses it:

```JS
encodeURIComponent('My string with spaces'); // -> 'My%20string%20with%20spaces'
```

Combine this method with the URL structure we need, the `xhr` explanation and the state of the component and we've got all the ingredients we need to get the data from the server!

First, lets encode the location from the state:

```JS
// components/App.js
var React = require('react');
var xhr = require('xhr');

var App = React.createClass({
  fetchData: function(evt) {
    evt.preventDefault();

    var location = encodeURIComponent(this.state.location);
  },
  changeLocation: function(evt) { /* … */ },
  render: function() { /* … */ }
});
```

Second, lets construct the URL we need using that escaped location:

```JS
// components/App.js
var React = require('react');
var xhr = require('xhr');

var App = React.createClass({
  fetchData: function(evt) {
    evt.preventDefault();

    var location = encodeURIComponent(this.state.location);

    var urlPrefix = 'http://api.openweathermap.org/data/2.5/forecast?q=';
    var urlSuffix = '&APPID=YOURAPIKEY&units=metric';
    var url = urlPrefix + location + urlSuffix;
  },
  changeLocation: function(evt) { /* … */ },
  render: function() { /* … */ }
});
```

The last thing we need to do to get the data from the server is call `xhr` with that url!

```JS
// components/App.js
var React = require('react');
var xhr = require('xhr');

var App = React.createClass({
  fetchData: function(evt) {
    evt.preventDefault();

    var location = encodeURIComponent(this.state.location);

    var urlPrefix = 'http://api.openweathermap.org/data/2.5/forecast?q=';
    var urlSuffix = '&APPID=YOURAPIKEY&units=metric';
    var url = urlPrefix + location + urlSuffix;

    xhr({
      url: url
    }, function (err, data) {
      /* …save the data here */
    });
  },
  changeLocation: function(evt) { /* … */ },
  render: function() { /* … */ }
});
```

Since we want React to rerender our application when we've loaded the data, we'll need to save it to the state of our `App` component.

TK explanation why we need to save the instance of the component to `self`

```JS
// components/App.js
var React = require('react');
var xhr = require('xhr');

var App = React.createClass({
  fetchData: function(evt) {
    evt.preventDefault();

    var location = encodeURIComponent(this.state.location);

    var urlPrefix = 'http://api.openweathermap.org/data/2.5/forecast?q=';
    var urlSuffix = '&APPID=YOURAPIKEY&units=metric';
    var url = urlPrefix + location + urlSuffix;

    var self = this;

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

As mentioned in Part 1, when saving anything our local state, we should predefine it in our `getInitialState` method. Lets do that:


```JS
// components/App.js
var React = require('react');
var xhr = require('xhr');

var App = React.createClass({
  getInitialState: function() {
    return {
      data: {}
    };
  },
  fetchData: function(evt) { /* … */ },
  changeLocation: function(evt) { /* … */ },
  render: function() { /* … */ }
});
```

Now that we've got the weather data for the location we want in our component state, we can use it in our render method! Remember, the data for the current weather is in the `list` array, sorted by time. The first element of said array is thus the current temperature, so lets try to render that first:

```JS
// components/App.js
var React = require('react');
var xhr = require('xhr');

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
      </div>
    );
  }
});
```

Now  that we have the current temperature, we need to render the 5 day forecast! Thankfully, we have Plotly which makes it very easy for us to create amazing graphs. TK link to part 3

# Summary of this chapter

We learned how to structure our application, with a common `components/` folder. We then created a controlled text input and used that to fetch our first data using `xhr`!

We're not taking of rendering an error message if the API sends back an error – that part is left as an exercise to the reader. Show us your solution by sending us your code to EMAIL@PLOT.LY (TK real email) and we might do something. TK reward for sending in challenges
