---
title: The Basics
description: Starting to write our first React.js application
layout: post
---

Lets use our knowledge to write an actual app! What we'll build is a weather application that'll display the current conditions and a 7 day forecast.

## Setup

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

## Start

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

Refreshing the `index.html` file in your browser should now show a heading saying "Weather"!
