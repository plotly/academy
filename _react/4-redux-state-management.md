---
title: State Management with Redux
description: Learn how to handle application state in a centralized store with Redux, the most popular unidirectional data flow library!
layout: post
author:
  name: Max Stoiber
  avatar: http://mxstbr.com/headshot.jpeg
  twitter: "@mxstbr"
  bio: Max is the creator of <a href="https://github.com/mxstbr/react-boilerplate">react-boilerplate</a>, one of the most popular react starter kits, the co-creator of <a href="https://github.com/carteb/carte-blanche">Carte Blanche</a> and he co-organises the React.js Vienna Meetup. He works as an Open Source Developer at <a href="http://thinkmill.com.au">Thinkmill</a>, where he takes care of <a href="http://keystonejs.com">KeystoneJS</a>.
---

We've been using a top-level component called `App` to manage our global application state. That works fine for a small application, but as we add more and more functionality it becomes very tedious to work with.

Together with React, Facebook released something called Flux. Flux is a methodology that helps you manage your global application state. Flux works fine, but has the downside that it uses events, which can lead to quite a bit of confusion.

Thankfully, <a target="_blank" href="https://twitter.com/dan_abramov">Dan Abramov</a> stepped in and created Redux. Redux has the same core concept as Flux, but works without events, is much easer to understand and now basically the standard for application state management.

> Note: None of the following concepts and technologies are **necessary** to build a production app with react. Many people use them to their advantage, but they have some downsides too. (which we'll examine)

## The Concept

Remember the initial state of our `App` component? It looks like this:

```JS
state = {
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
};
```

The object we return from this function is our entire application state. At the first start of our application, our state thus looks like this:

```JS
{
  location: '',
  data: {},
  dates: [],
  temps: [],
  selected: {
    date: '',
    temp: null
  }
}
```

When users now change the location input field, the `location` field of our state changes:

```JS
{
  location: 'Vienna, Austria',
  data: {},
  dates: [],
  temps: [],
  selected: {
    date: '',
    temp: null
  }
}
```

Instead of directly changing that location with `this.setState`, we'll call a function called `changeLocation` from our component. Redux will pick up that said function was called, do its magic and change the `location` field of our application state.

Now that the location is different and thus our application state has changed, our main `<App />` component will automatically rerender with the new data! (just like with component state)

The big advantage of this approach is that the component no longer needs to know how exactly we save the location. We could be persisting it as a coordinate, we could save it without whitespace, but the component doesn't have to care about that—the component only calls `changeLocation` and that's it! The application state is thus decoupled from the individual components.

This cycle of state management thus looks like this:

<img src="/react/assets/basic-state-management.svg" alt="Graph of basic state management as explained above" />

If we put this into more general terms, we call a function which changes something in the application state which rerenders some component:

<img src="/react/assets/general-state-management.svg" alt="Graph of general state management as explained above" />

We'll now need to introduce some terminology before we can finally start implementing this. This function that we call to change the application state is called an "action" in Redux, and we "dispatch" the "action". Let's change the cycle one last time with the terminology:

<img src="/react/assets/redux-state-management.svg" alt="Graph of redux state management as explained above" />

## Writing our first Redux parts

Let's write our first action! We'll start with the location field, since it's a very typical example. An action function in Redux returns an object with a `type` and can optionally also pass some data along the way. Our `changeLocation` action looks like this:

```JS
function changeLocation(location) {
  return {
    type: 'CHANGE_LOCATION',
    location: location
  };
}
```

This action thus has a type of `'CHANGE_LOCATION'` and passes along some data with the `location` property.

That's nice and all, but this won't change the state automatically. We have to tell Redux what to do when this action comes in, which we do in a so-called reducer.

A reducer is a simple function that takes two arguments, the current state and the action that was dispatched:

```JS
function mainReducer(state, action) {
  return state;
}
```

Right now, no matter what action comes in and what data it has the state will always stay the same – that's not quite optimal, as nobody will be able to work with the app! Let's change the `location` field in the state based on the data in the action with the `'CHANGE_LOCATION'` type.

```JS
function mainReducer(state, action) {
  switch (action.type) {
    case 'CHANGE_LOCATION':
      state.location = action.location;
      return state;
  }
}
```

What we're doing here is _mutating_ the state. We assign `state.location` the value of `action.location`. This is discouraged by Redux because it introduces potential bugs and side effects. What we instead should be doing is _returning a new object_ which is a copy of the state!

JavaScript has a handy function called `Object.assign`, which allows you to do that. Let's take a look at the solution first:

```JS
function mainReducer(state, action) {
  switch (action.type) {
    case 'CHANGE_LOCATION':
      return Object.assign({}, state, {
        location: action.location
      });
  }
}
```

By passing in a new, empty object (`{}`) as the first argument and the current `state` as the second one, we create a carbon copy of the state. The third argument of the function (`{ location: action.location }`) is _just the changes to our state_!

This creates a new object, meaning the state stays the same which is A+ behaviour and will keep us from a lot of bugs!

With a bit of glue this'll already work! We should do two more small things to make this better: we should return the state unchanged if no action we want to handle comes in and we should use the initial state if state is undefined:

```JS
var initialState = {
  location: '',
  data: {},
  dates: [],
  temps: [],
  selected: {
    date: '',
    temp: null
  }
};

function mainReducer(state = initialState, action) {
  switch (action.type) {
    case 'CHANGE_LOCATION':
      return Object.assign({}, state, {
        location: action.location
      });
    default:
      return state;
  }
}
```

We'll now need to `dispatch` this action when the location changes:

```JS
class App extends React.Component {
 fetchData = (evt) => { /* … */ };
 onPlotClick = (data) =>  { /* … */ };
 changeLocation = (evt) => {
   this.props.dispatch(changeLocation(evt.target.value));
 };
 render() { /* … */ }
});
```

> Don't worry about where `this.props.dispatch` comes from for now, we'll get to that!

Imagine `evt.target.value` is `"Sydney, Australia"`, this is what our global state is going to look like when we `dispatch` the `changeLocation` action:

```JS
{
  location: 'Sydney, Australia',
  /* …the rest stays the same… */
}
```

## Tying it all together

Now that we understand the basic parts that are involved, let's tie it all together! First, we need to install two new modules:

```
npm install --save redux react-redux
```

> `redux` is the main package and is framework agnostic. `react-redux` provides bindings for react, as we'll see shortly!

Then we need to create a store for our state and provide the state to our root `App` component. The `store` combines all of the apps reducers and (as the name suggests) stores the state. Once the store is set up though, you can forget about it again since we'll be using the state, but not the store directly!

We do this in our main `index.js` file, and we'll use the `createStore` function from the `redux` package and the `Provider` component from the `react-redux` package.

First, `import` those functions:

```JS
// index.js

/* … */
import ReactDOM from 'react-dom';

import { createStore } from 'redux';

import { Provider } from 'react-redux';

import App from './App.js';
/* … */
```

Then we need to create our store:

```JS
// index.js

/* … */
import App from './App.js';

var store = createStore();

ReactDOM.render(
/* … */
);
```

Lastly, we need to wrap our `App` component in the `Provider` and pass in the store:

```JS
/* … */
ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
  document.getElementById('root')
);
/* … */
```

And that's it, our Redux integration is done! 🎉

Well, except it doesn't do anything yet. Let's create an `actions.js` file and put our `changeLocation` action from above inside:

```JS
// actions.js

function changeLocation(location) {
  return {
    type: 'CHANGE_LOCATION',
    location: location
  };
}
```

We'll want to import it in other files, so we need to `export` it for that to work:

```JS
// actions.js

export function changeLocation(location) {
	return {
		type: 'CHANGE_LOCATION',
		location: location
	};
}
```

Awesome, we've got our first action – now we need to add our reducer!

Same deal as with the action, add a `reducers.js` file and export our previously written reducer from there:

```JS
// reducers.js

var initialState = {
  location: '',
  data: {},
  dates: [],
  temps: [],
  selected: {
    date: '',
    temp: null
  }
};

export default function mainReducer(state = initialState, action) {
  switch (action.type) {
    case 'CHANGE_LOCATION':
      return Object.assign({}, state, {
        location: action.location
      });
    default:
      return state;
  }
}
```

> We export the reducer by default since it'll be the only thing we're exporting from that file

That's our reducer done,

Now we need to tell our store to use that reducer, so we `import` and pass it into the `createStore` call in the `index.js`:

```JS
// index.js

/* … */
import App from './App.js';

import mainReducer from './reducers';

var store = createStore(mainReducer);

ReactDOM.render(
/* … */
);
```

Awesome, now everything's wired up except our `App` component! We need to connect it to the global redux state, which the `react-redux` module thankfully has a handy function for. Instead of exporting the raw `App` component, we export the `connect`ed component:

```JS
// App.js

/* …more imports… */

import { connect } from 'react-redux';

/* … */

export default connect()(App);
```

While this is nice, we also need to tell `connect` that it should inject the `location` field we have in our reducer into this component. We do this by passing in a function as the first argument that takes the entire state, and then we return what we want to inject as props into our component. (this automatically injects `dispatch` to run our actions, which is why we can use `this.props.dispatch` in the `App` component)

```JS
// App.js

/* … */

export default connect(function (state) {
	return {
		location: state.location
	};
})(App);
```

This function is called `mapStateToProps`, let's make that an external function so it's a bit clearer:

```JS
// App.js

/* … */

function mapStateToProps(state) {
	return {
		location: state.location
	};
}

export default connect(mapStateToProps)(App);
```

And that's everything we need to get our App to get the location from the Redux state! Let's adapt our `App` to get the location from the props:

```JS
// App.js

/* …more imports… */

import {
  changeLocation
} from './actions';

class App extends React.Component {
	fetchData = (evt) => {
    evt.preventDefault();

    var location = encodeURIComponent(this.props.location);

    /* … */
  };
	onPlotClick = (data) => { /* … */ };
	changeLocation = (evt) => {
		this.props.dispatch(changeLocation(evt.target.value));
	};
	render() {
		<div>
			{/* … */}
					<input
						placeholder={"City, Country"}
						type="text"
						value={this.props.location}
						onChange={this.changeLocation}
					/>
			{/* … */}
		</div>
	}
}
```

That's everything needed to get the initial wiring done! Open this in your browser and change the location input, you should see the value adjusting – this means redux is working as expected!

## Wiring up the rest

Let's wire up some other actions, the goal here is to get rid of the entire component state of the `App` component! Let's take a look at the selected date and temperature. The first we'll write is two actions, `setSelectedDate` and `setSelectedTemp`, that pass on the value that they get passed in.

```JS
// actions.js

export function setSelectedDate(date) {
  return {
    type: 'SET_SELECTED_DATE',
    date: date
  };
}

export function setSelectedTemp(temp) {
  return {
    type: 'SET_SELECTED_TEMP',
    temp: temp
  };
}
```

Nothing fancy here, standard actions like the `changeLocation` one.

Let's add those two constants to our reducer, and also adjust the initial state a bit to include those fields:

```JS
// reducers.js
export default function mainReducer(state = initialState, action) {
  switch (action.type) {
    case 'CHANGE_LOCATION':
      return Object.assign({}, state, {
        location: action.location
      });
    case 'SET_SELECTED_TEMP':
      return state;
    case 'SET_SELECTED_DATE':
      return state;
    default:
      return state;
  }
}
```

Now our reducer just needs to return the changed state for those actions:

```JS
// reducers.js

export default function mainReducer(state = initialState, action) {
  switch (action.type) {
    case 'CHANGE_LOCATION':
      return Object.assign({}, state, {
        location: action.location
      });
    case 'SET_SELECTED_TEMP':
      return Object.assign({}, state, {
        selected: {
          temp: action.temp,
          date: state.selected.date
        }
      });
    case 'SET_SELECTED_DATE':
      return Object.assign({}, state, {
        selected: {
          date: action.date,
          temp: state.selected.temp
        }
      });
    default:
      return state;
  }
}
```

Now let's wire it all up again in our `App` component:

```JS
// App.js

/* …more imports… */

import {
  changeLocation,
  setSelectedTemp,
  setSelectedDate
} from './actions';

class App extends React.Component{
  state = {
    return {
      data: {},
      dates: [],
      temps: [],
    };
  };

  fetchData = (evt) => {
    /* … */

      self.setState({
        data: data,
        dates: dates,
        temps: temps,
      });

      self.props.dispatch(setSelectedTemp(null));
      self.props.dispatch(setSelectedDate(''));
    /* … */
  };
  onPlotClick = (data) => {
    if (data.points) {
      var number = data.points[0].pointNumber;
      this.props.dispatch(setSelectedDate(data.points[0].x));
      this.props.dispatch(setSelectedTemp(data.points[0].y));
    }
  };
  changeLocation = (evt) => { /* … */ };
  render() {
    /* … */
    return (
      {/* … */}
              <p>The temperature on { this.props.selected.date } will be { this.props.selected.temp }°C</p>
      {/* … */}
    );
  }
}

function mapStateToProps(state) {
	return {
		location: state.location,
    selected: state.selected
	};
}
```

There are three more actions (and constants and reducer cases) that need to be implemented here: `setData`, `setDates` and `setTemps`. I'll leave it up to you here to implement them, taking inspiration from our already implemented actions!

----

Are you done? This is what your `App` component should look like now:

```JS
import React from 'react';
import './App.css';
import xhr from 'xhr';
import { connect } from 'react-redux';

import Plot from './Plot';
import {
  changeLocation,
  setData,
  setDates,
  setTemps,
  setSelectedDate,
  setSelectedTemp
} from './actions';

class App extends React.Component {
  fetchData = (evt) => {
    evt.preventDefault();

    var location = encodeURIComponent(this.props.location);

    var urlPrefix = 'http://api.openweathermap.org/data/2.5/forecast?q=';
    var urlSuffix = '&APPID=dbe69e56e7ee5f981d76c3e77bbb45c0&units=metric';
    var url = urlPrefix + location + urlSuffix;

    var self = this;

    xhr({
      url: url
    }, function (err, data) {

      var body = JSON.parse(data.body);
      var list = body.list;
      var dates = [];
      var temps = [];
      for (var i = 0; i < list.length; i++) {
        dates.push(list[i].dt_txt);
        temps.push(list[i].main.temp);
      }

      self.props.dispatch(setData(body));
      self.props.dispatch(setDates(dates));
      self.props.dispatch(setTemps(temps));
      self.props.dispatch(setSelectedDate(''));
      self.props.dispatch(setSelectedTemp(null));
    });
  };

  onPlotClick = (data) => {
    if (data.points) {
      var number = data.points[0].pointNumber;
      this.props.dispatch(setSelectedDate(this.props.dates[number]));
      this.props.dispatch(setSelectedTemp(this.props.temps[number]))
    }
  };

  changeLocation = (evt) => {
    this.props.dispatch(changeLocation(evt.target.value));
  };

  render() {
    var currentTemp = 'not loaded yet';
    if (this.props.data.list) {
      currentTemp = this.props.data.list[0].main.temp;
    }
    return (
      <div>
        <h1>Weather</h1>
        <form onSubmit={this.fetchData}>
          <label>City, Country
            <input
              placeholder={"City, Country"}
              type="text"
              value={this.props.location}
              onChange={this.changeLocation}
            />
          </label>
        </form>
        {/*
          Render the current temperature and the forecast if we have data
          otherwise return null
        */}
        {(this.props.data.list) ? (
          <div>
            {/* Render the current temperature if no specific date is selected */}
            {(this.props.selected.temp) ? (
              <p>The temperature on { this.props.selected.date } will be { this.props.selected.temp }°C</p>
            ) : (
              <p>The current temperature is { currentTemp }°C!</p>
            )}
            <h2>Forecast</h2>
            <Plot
              xData={this.props.dates}
              yData={this.props.temps}
              onPlotClick={this.onPlotClick}
              type="scatter"
            />
          </div>
        ) : null}

      </div>
    );
  }
}

// Since we want to have the entire state anyway, we can simply return it as is!
function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(App);
```

As you can see, everything is handled by our actions and reducer. Let's take a look at the reducer before we move on to make sure we're on the same page:

```JS
var initialState = {
  location: '',
  data: {},
  dates: [],
  temps: [],
  selected: {
    date: '',
    temp: null
  }
};

export default function mainReducer(state = initialState, action) {
  switch (action.type) {
    case 'CHANGE_LOCATION':
      return Object.assign({}, state, {
        location: action.location
      });
    case 'SET_DATA':
      return Object.assign({}, state, {
        data: action.data
      });
    case 'SET_DATES':
      return Object.assign({}, state, {
        dates: action.dates
      });
    case 'SET_TEMPS':
      return Object.assign({}, state, {
        temps: action.temps
      });
    case 'SET_SELECTED_DATE':
      return Object.assign({}, state, {
        selected: {
          date: action.date,
          temp: state.selected.temp
        }
      });
    case 'SET_SELECTED_TEMP':
      return Object.assign({}, state, {
        selected: {
          date: state.selected.date,
          temp: action.temp
        }
      });
    default:
      return state;
  }
}
```

We still have that ugly `xhr({})` call in our `fetchData` function though. This works, but as we add more and more components to our application it'll become hard to figure out where what data is fetched.

That's why the redux community has adopted `redux-thunk` as a new standard for fetching data!

## `redux-thunk`

The idea behind `redux-thunk` is that we return a function from an action that gets passed `dispatch`. This allows us to do asynchronous things (like data fetching) in our actions:

```JS
function someAction()
  // Notice how we return a function – this is what's called a "thunk"!
  return function thisIsAThunk(dispatch) {
    // Do something asynchronous in here
  }
}
```

### First implementation

Let's try to write an action called `fetchData` that fetches our data! Start with the basic structure:

```JS
// actions.js

/* …more actions here… */

export function fetchData() {
  return function thunk(dispatch) {
    // LET'S FETCH OUR DATA HERE
  }
}
```

Now let's copy and paste the `xhr` call from the `App` component and put it in there:

```JS
// actions.js

/* …more actions here… */

export function fetchData() {
  return function thunk(dispatch) {
    xhr({
      url: url
    }, function (err, data) {

      var body = JSON.parse(data.body);
      var list = body.list;
      var dates = [];
      var temps = [];
      for (var i = 0; i < list.length; i++) {
        dates.push(list[i].dt_txt);
        temps.push(list[i].main.temp);
      }

      self.props.dispatch(setData(body));
      self.props.dispatch(setDates(dates));
      self.props.dispatch(setTemps(temps));
      self.props.dispatch(setSelectedDate(''));
      self.props.dispatch(setSelectedTemp(null));
    });
  }
}
```

Now we need to fix three things: 1) We need to import `xhr`, 2) we need to get the URL from the action and 3) we need to rename all `self.props.dispatch` calls to `dispatch`:

```JS
// actions.js

// REQUIRE xhr
import xhr from 'xhr';

/* …more actions here… */

// PASS URL IN HERE
export function fetchData(url) {
  return function thunk(dispatch) {
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
      // RENAME self.props.dispatch TO dispatch
      dispatch(setData(data));
      dispatch(setDates(dates));
      dispatch(setTemps(temps));
      dispatch(setSelectedDate(''));
      dispatch(setSelectedTemp(null));
    });
  }
}
```

Well, that was easy! That's our thunked action done – let's call it from our `App` component:

```JS
/* … */

class App extends React.Component {
  fetchData = (evt) => {
    evt.preventDefault();

    var location = encodeURIComponent(this.props.location);

    var urlPrefix = 'http://api.openweathermap.org/data/2.5/forecast?q=';
    var urlSuffix = '&APPID=dbe69e56e7ee5f981d76c3e77bbb45c0&units=metric';
    var url = urlPrefix + location + urlSuffix;

    this.props.dispatch(fetchData(url));
  },
  onPlotClick = (data) => { /* … */ },
  changeLocation = (evt) => { /* … */ },
  render() { /* … */ }
});

/* … */
```

That makes our `App` so much nicer to work with already!

### Wiring it up

The last step is wiring up `redux-thunk`. `redux-thunk` is a so-called "middleware". Middlewares sit in between the action and the reducers, every action you dispatch gets passed to all middlewares you add. (that's why they're called _middle_ ware)!

First, we need to install `redux-thunk`:

```Sh
npm install --save redux-thunk
```

Second, we need to `apply` the `thunk` middleware in our `createStore` call in `index.js`:

```JS
// index.js

/* … */
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

/* … */

var store = createStore(
  mainReducer,
  applyMiddleware(thunkMiddleware)
);
/* … */
```

And that's it, everything should be working again now. Look how easy it is to handle our components, how nicely everything is separeted by concern and how easy it would be to add a new feature to our app! That's the power of redux, our application is easier to reason about and to handle, instead of having one massive top-level `App` component we separate the concerns properly.

Now, let's find out how we can make our app so much more performant with immutable datastructures in <a href="/react/5-immutable-data/">Chapter 5: ImmutableJS</a>!

## Additional Material

- <a href="http://redux.js.org" target="_blank">Official Redux Docs</a>
- <a href="http://staltz.com/unidirectional-user-interface-architectures.html#redux" target="_blank">André Staltz' Unidirectional User Interface Architectures</a>
- <a href="https://egghead.io/courses/getting-started-with-redux" target="_blank">Egghead.io "Getting started with Redux" Video Course</a>
- <a href="https://egghead.io/courses/building-react-applications-with-idiomatic-redux" target="_blank">Egghead.io Advanced Redux Video Course</a>

<!-- Syntax highlighting -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.5.1/prism.min.js"></script>
<!-- /Syntax highlighting -->
