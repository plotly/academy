---
title: Your first app
description: Starting to write our first React.js application, we learn how to structure our app and how to fetch data
layout: post
author:
  name: Max Stoiber
  avatar: http://mxstbr.com/headshot.jpeg
  twitter: "@mxstbr"
  bio: Max is the creator of <a href="https://github.com/mxstbr/react-boilerplate">react-boilerplate</a>, one of the most popular react starter kits, the co-creator of <a href="https://github.com/carteb/carte-blanche">Carte Blanche</a> and he co-organises the React.js Vienna Meetup. He works as an Open Source Developer at <a href="http://thinkmill.com.au">Thinkmill</a>, where he takes care of <a href="http://keystonejs.com">KeystoneJS</a>.
---

Let's use our knowledge to write an actual app! What we'll build is a weather application that'll display the current conditions and a 7 day forecast. Again, here is a live preview of what we're going to build:

<div class="post__example post__example--full-width">
  <div class="post__example-bar">
    <div class="post__example-controls"></div>
  </div>
  <div class="post__example-content">
    <iframe class="preview-iframe-DO-NOT-APPLY-THIS-CLASS-ANYWHERE-ELSE" src="http://blog.mxstbr.com/weather-app/"></iframe>
  </div>
</div>

*You can also see this example in your own browser at <a target="_blank" href="http://blog.mxstbr.com/weather-app">blog.mxstbr.com/weather-app</a>*

<style>
.preview-iframe-DO-NOT-APPLY-THIS-CLASS-ANYWHERE-ELSE {
  width: 100%;
  border: none;
  height: 98.4%;
  margin: 0;
}
</style>

## Setup

### Prerequisites

#### Node

Node.js is a JavaScript runtime for your terminal. Don't worry too much about it, but it's used by some tools we'll be using to build our application. If you don't have it installed already (check by running `node -v` in your terminal, which should print a version number) head over to <a target="_blank" href="https://nodejs.org">nodejs.org</a>, follow the instructions there to install the latest version (v6 at the time of this writing) and you're good to go!

### `create-react-app`

Facebook recently open sourced a neat little tool called <a target="_blank" href="https://github.com/facebookincubator/create-react-app"><code>create-react-app</code></a> that allows us to very easily get started with our React app! It includes all the necessary build tools and transpilation steps to just get stuff done.

Let's install it with `npm`:

```Sh
npm install -g create-react-app
```

As soon as that's finished you now have access to the `create-react-app` command in your terminal! Let's create our barebones weather app:

```Sh
create-react-app weather-app
```

> The argument to `create-react-app`, in our case `weather-app`, tells the utility what to name the folder it'll create. Since we're creating a weather app, `weather-app` seems like a solid choice!

Take a look into the `src/index.js` file and you'll see something like this:

```JS
// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

Thankfully, `create-react-app` includes a simple server so instead of having to open the `index.html` file manually we can simply run `npm run start` in the `weather-app` directory and see our application at `localhost:3000`!

## First steps

If you take a look into the `src/App.js` component, you'll see a bunch of boilerplate code in there. Delete the `import logo from './logo.svg';` (and the `logo.svg` file if you want) and all of the JSX, and instead render a heading saying "Weather":

```JS
// App.js
import React from 'react';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <h1>Weather</h1>
    );
  }
}

export default App;
```

Save the file, go back to your browser and you should see a heading saying "Weather"! But what is all that `import` and `export` business?

### Modules

Real world applications can have any number of components, ranging from a handful to thousands. Having all of them in a single file is impractical, so we structure them into **modules**. This allows us to keep our applications well structured and easy to work with. What we are doing above is telling the App component that we're using the `react` module and the `App.css` module!

We can create modules by `export`ing something from a file, like above we're exporting the App component. This component can then be imported in another file with `import App from './path/to/App.js'`. (in fact, take a look at the `index.js` file and you'll see if being done!)

#### Node Modules

What we've done above when we ran the `npm install` command was that we installed a module. This means that somebody has pushed a module (just like our `App` module above!) to `npm` (Node Package Manager), which we can then install and use in our code!

This way we can use React and build our app without having to globally attach anything, a big benefit in terms of understanding what is going on!

Alright, back to our weather app.

We'll need a bit of styling to make sure our app looks good. I've prepared that for you so you can focus on React, simply replace all the CSS in `App.css` with what is on <a target="_blank" href="https://github.com/plotly/academy/blob/gh-pages/weather-app/src/App.css">this page</a>.

We'll also need to be able to tell our app for which location we want the weather, so let's add a form with an input field and label that says "City, Country"!

```JS
// App.js
class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Weather</h1>
        <form>
          <label>I want to know the weather for
            <input placeholder={"City, Country"} type="text" />
          </label>
        </form>
      </div>
    );
  }
}
```

> We nest the `input` inside the `label` so the input is focussed when users click on the label!

When entering something into the input field and pressing "Enter", the page refreshes and nothing happens. What we really want to do is fetch the data when a city and a country are input. Let's add an `onSubmit` handler to the `form` and a `fetchData` function to our component!

```JS
// App.js
class App extends React.Component {
  fetchData = (evt) => {
    evt.preventDefault();
    console.log('fetch data!');
  };

  render() {
    return (
      <div>
        <h1>Weather</h1>
        <form onSubmit={this.fetchData}>
          <label>I want to know the weather for
            <input placeholder={"City, Country"} type="text" />
          </label>
        </form>
      </div>
    );
  }
}
```

By running `evt.preventDefault()` in fetchData (which is called when we press enter in the form), we tell the browser to not refresh the page and instead ignore whatever it wanted to and do what we tell it to. Right now, it logs "fetch data!" in the console over and over again whenever you submit the form. How do we get the entered city and country in that function though?

By storing the value of the text input in our local component state, we can grab it from that method. When we do that, we make our input a so-called "controlled input".

We'll store the currently entered location in `this.state.location`, and add a utility method to our component called `changeLocation` that is called `onChange` of the text input and sets the state to the current text:

```JS
// App.js
class App extends React.Component {
  fetchData = (evt) => { /* … */ };

  changeLocation = (evt) => {
    this.setState({
      location: evt.target.value
    });
  };

  render() {
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
      </div>
    );
  }
}
```

As mentioned in Chapter 1, when saving anything to our local state, we have to predefine it. Let's do that:

```JS
// App.js
class App extends React.Component {
  state = {
    location: ''
  };

  fetchData = (evt) => { /* … */ };

  changeLocation = (evt) => {
    this.setState({
      location: evt.target.value
    });
  };

  render() {
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
      </div>
    );
  }
}
```

In our fetchData function, we can then access `this.state.location` to get the current location:

```JS
// App.js

class App extends React.Component {
  state = { /* … */ };

  fetchData = (evt) => {
    evt.preventDefault();
    console.log('fetch data for', this.state.location);
  };

  changeLocation = (evt) => { /* … */ };

  render() { /* … */ }
}
```

Now, whichever location you enter it should log "fetch data for MyCity, MyCountry"!

## Fetching data

Let's get into fetching data. Instead of console logging a text, we need to get some weather information. We'll be using the <a target="_blank" href="openweathermap.org/api">OpenWeatherMap API</a> for this task, which is a free service that provides access to data for basically all locations all around the world. You'll need to get an API key from it, so head over to <a target="_blank" href="http://openweathermap.org/api">openweathermap.org/api</a>, press "Sign Up" in the top bar and register for a free account:

![Homepage of openweathermap.org](http://i.imgur.com/CNBLfVY.png)

![Sign up page of openweathermap.org](http://i.imgur.com/WZmEa4p.png)

As soon as you've done that go to your API key page by going to <a target="_blank" href="http://home.openweathermap.org/api_keys">home.openweathermap.org/api_keys</a>, copy the `API key` from there and keep it somewhere safe.

![Profile page of openweathermap.org](http://i.imgur.com/3zvplvp.png)

Now that we have access to all the weather data our heart could desire, let's get on with our app!

Inside our `fetchData` function, we'll have to make a request to the API. I like to use a npm module called `xhr` for this, a wrapper around the JavaScript XMLHttpRequest that makes said requests a lot easier. Run `npm install --save xhr` to get it! While that's installing, `import` it in your App component at the top:

```JS
// App.js
import React from 'react';
import xhr from 'xhr';

class App extends React.Component { /* … */ };
```

To get the data, the structure of the URL we'll request looks like this:

```
http://api.openweathermap.org/data/2.5/forecast?q=CITY,COUNTRY&APPID=YOURAPIKEY&units=metric
```

Replace `CITY,COUNTRY` with a city and country combination of choice, replace `YOURAPIKEY` with your copied API key and open that URL in your browser. (it should look something like this: `http://api.openweathermap.org/data/2.5/forecast?q=Vienna,Austria&APPID=asdf123&units=metric`)

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

The five properties we care about are: `dt_txt`, the time of the weather prediction, `temp`, the expected temperature, `temp_min` and `temp_max`, the, respectively, minimum and maximum expected temperature, and `weather[0].main`, a string description of the weather at that time. OpenWeatherMap gives us a lot more data than that though, and I encourage you to snoop around a bit more and see what you could use to make the application more comprehensive!

Now that we know what we need, let's get down to it – how do we actually fetch the data here? (by now `xhr` should have finished installing)

The general usage of `xhr` looks like this:

```JS
xhr({
  url: 'someURL'
}, function (err, data) {
  /* Called when the request is finished */
});
```

As you can see, everything we really need to take care of is constructing the url and saving the returned data somewhere!

We know that the URL has a prefix that's always the same, `http://api.openweathermap.org/data/2.5/forecast?q=`, and a suffix that's always the same, `&APPID=YOURAPIKEY&units=metric`. The sole thing we need to do is insert the location the user entered into the URL!

> You can also change the units you get back by setting `units` to `imperial`: `http://api.openweathermap.org/data/2.5/forecast?q=something&APPID=YOURAPIKEY&units=imperial`

Now, if you're thinking this through you know what might happen – the user might enter spaces in the input! URLs with spaces aren't valid, so it wouldn't work and everything would break! While that is true, JavaScript gives us a very handy method to escape non-URL-friendly characters. It is called `encodeURIComponent()`, and this is how one uses it:

```JS
encodeURIComponent('My string with spaces'); // -> 'My%20string%20with%20spaces'
```

Combine this method with the URL structure we need, the `xhr` explanation and the state of the component and we've got all the ingredients we need to get the data from the server!

> Please note that you might need to restart the development server (`CTRL-C` to stop it, `npm start` to start it again) for it to know that a new module was installed!

First, let's encode the location from the state:

```JS
// App.js

import xhr from 'xhr';

class App extends React.Component {
  state = { /* … */ };

  fetchData = (evt) => {
    evt.preventDefault();

    var location = encodeURIComponent(this.state.location);
  };

  changeLocation = (evt) => { /* … */ };

  render() { /* … */ }
}
```

Second, let's construct the URL we need using that escaped location:

```JS
// App.js

import xhr from 'xhr';

class App extends React.Component {
  state = { /* … */ };

  fetchData = (evt) => {
    evt.preventDefault();

    var location = encodeURIComponent(this.state.location);

    var urlPrefix = 'http://api.openweathermap.org/data/2.5/forecast?q=';
    var urlSuffix = '&APPID=YOURAPIKEY&units=metric';
    var url = urlPrefix + location + urlSuffix;
  };

  changeLocation = (evt) => { /* … */ };

  render() { /* … */ }
}
```

The last thing we need to do to get the data from the server is call `xhr` with that url!

```JS
// App.js

import xhr from 'xhr';

class App extends React.Component {
  state = { /* … */ };

  fetchData = (evt) => {
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
  };

  changeLocation = (evt) => { /* … */ };

  render() { /* … */ }
}
```

Since we want React to rerender our application when we've loaded the data, we'll need to save it to the state of our `App` component. Also, network request data is a string, so we'll need to parse that with `JSON.parse` to make it an object.

```JS
// App.js

import xhr from 'xhr';

class App extends React.Component {
  state = { /* … */ };

  fetchData = (evt) => {
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
        data: JSON.parse(data.body)
      });
    });
  };

  changeLocation = (evt) => { /* … */ };

  render() { /* … */ }
}
```

> Note: `var self = this;` is necessary because the context (== `this`) of the inner function is no longer the component, but the inner function.

Let's define that `data` in our state:

```JS
// App.js

import xhr from 'xhr';

class App extends React.Component {
  state = {
    location: '',
    data: {}
  };

  fetchData = (evt) => { /* … */ };

  changeLocation = (evt) => { /* … */ };

  render() { /* … */ }
}
```

Now that we've got the weather data for the location we want in our component state, we can use it in our render method! Remember, the data for the current weather is in the `list` array, sorted by time. The first element of said array is thus the current temperature, so let's try to render that first:

```JS
// App.js

import xhr from 'xhr';

class App extends React.Component {
  state = { /* … */ };

  fetchData = (evt) => { /* … */ };
  changeLocation = (evt) => { /* … */ };

  render() {
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
        <p className="temp-wrapper">
          <span className="temp">{ currentTemp }</span>
          <span className="temp-symbol">°C</span>
        </p>
      </div>
    );
  }
}
```

Go open that in your browser, enter your current location and you'll see the current temperature! 🎉 Awesome!

## Summary of this chapter

We learned how to structure our application and then we created a controlled text input and used that to fetch our first data using `xhr`!

Now that we have the current temperature, we need to render the 5 day forecast! Continue with <a href="/react/3-with-plotly/">Chapter 3: Adding a Forecast Graph</a> where we'll learn how to draw a graph!

## Additional Material

- <a target="_blank" href="https://github.com/facebookincubator/create-react-app/blob/623e1bd189eeb154d52dad8d74dee251e54c8211/template/README.md">Official create-react-app docs</a>
- <a target="_blank" href="https://github.com/Raynos/xhr">Official xhr docs</a>
- <a target="_blank" href="http://readwrite.com/2013/09/19/api-defined/">What APIs Are And Why They’re Important</a>

<!-- Syntax highlighting -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.5.1/prism.min.js"></script>
<!-- /Syntax highlighting -->
