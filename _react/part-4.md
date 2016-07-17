---
title: Redux
description: Properly handling application state
layout: post
---

We've been using a top-level component called `App` to manage our global application state. That works fine for a small application, but as we add more and more functionality it becomes very tedious to work with.

Together with React, Facebook released something called Flux. Flux is a methodology that helps you manage your global application state. Flux works fine, but has the downside that it uses events, which can lead to quite a bit of confusion.

Thankfully, [Dan Abramov](https://twitter.com/dan_abramov) stepped in and created Redux. Redux has the same core concept as Flux, but works without events, is much easer to understand and now basically the standard for application state management.

## The concept

Remember the `getInitialState` function of our `App` component? It looks like this:

```JS
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
  /* …the rest stays the same… */
}
```

Instead of directly changing that location with `this.setState`, we'll call a function called `changeLocation` from our component. Redux will pick up that said function was called, do its magic and change the `location` field of our application state.

Now that the location is different and thus our application state has changed, our main `<App />` component will automatically rerender with the new data! (just like with component state)

The big advantage of this approach is that the component no longer needs to know how exactly we save the location. We could be persisting it as a coordinate, we could save it without whitespace, but the component doesn't have to care about that—the component only calls `changeLocation` and that's it! The application state is thus decoupled from the individual components.

This cycle of state management thus looks like this:

TK Image of state management with `changeLocation`, `location` and component

If we put this into more general terms, we call a function which changes something in the application state which rerenders some component:

TK Image of more general state management cycle

We'll now need to introduce some terminology before we can finally start implementing this. This function that we call to change the application state is called an "action" in Redux, and we "dispatch" the "action". Lets change the cycle one last time with the terminology:

TK Image of Redux specific state management cycle

## Writing our first Redux parts

Lets write our first action! We'll start with the location field, since it's a very typical example. An action function in Redux returns an object with a `type` and can optionally also pass some data along the way. Our `changeLocation` action looks like this:

```JS
function changeLocation(location) {
  return {
    type: 'CHANGE_LOCATION',
    location: location
  };
}
```

This action thus has a type of `'CHANGE_LOCATION'` and passes along some data with the `location` property.

That's nice and all, but this won't change the store automatically. We have to tell Redux what to do when this action comes in, which we do in a so-called reducer.

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

With a bit of glue this'll already work, but we should also return the state unchanged if no action we want to handle comes in:

```JS
function mainReducer(state, action) {
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
var App = React.createClass({
 fetchData: function(evt) { /* … */ },
 onPlotClick: function(data)  { /* … */ },
 changeLocation: function(evt) {
   this.props.dispatch(actions.setLocation(evt.target.value));
 },
 render: function() { /* … */ }
});
```

> Don't worry about where `this.props.dispatch` comes from for now, we'll get to that!

Imagine `evt.target.value` is `"Sydney, Australia"`, this is what our global state is going to look like when `dispatch` the `setLocation` action:

```JS
{
  location: 'Sydney, Australia',
  /* …the rest stays the same… */
}
```

## Tying it all together

Now that we understand the basic parts that are involved, let's tie it all together! First, we need to install two new modules:

```
$ npm install redux react-redux
```

> `redux` is the main package and is framework agnostic. `react-redux` provides bindings for react, as we'll see shortly!

Then we need to create a store for our state and provide the state to our root `App` component. We do this in our main `app.js` file, and we'll use the `createStore` function from the `redux` package and the `Provider` component from the `react-redux` package.

First, `require` those functions:

```JS
// app.js

/* … */
var ReactDOM = require('react-dom');

var redux = require('redux');
var createStore = redux.createStore;

var reactRedux = require('react-redux');
var Provider = reactRedux.Provider;

var App = require('./components/App.js');
/* … */
```

Then we need to create our store:

```JS
// app.js

/* … */
var App = require('./components/App.js');

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
	</Provider>
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

We'll want to import it in other files, so we need to prefix `exports.changeLocation` for that to work:

```JS
// actions.js

exports.changeLocation = function changeLocation(location) {
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

exports.mainReducer = function mainReducer(state, action) {
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

We'll also need to tell redux what our initial state is and return that if no state is passed in:

```JS
// reducers.js

var initialState = {
  location: ''
};

exports.mainReducer = function mainReducer(state, action) {
  state = state || initialState;
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

That's our reducer done,

Now we need to tell our store to use that reducer, so we `require` and pass it into the `createStore` call in the `app.js`:

```JS
// app.js

/* … */
var App = require('./components/App.js');

var main = require('./reducer').mainReducer;
var store = createStore(main);

ReactDOM.render(
/* … */
);
```

Awesome, now everything's wired up except our `App` component! We need to connect it to the store, which the `react-redux` module thankfully has a handy function for. Instead of exporting the raw `App` component, we export the `connect`ed component:

```JS
// components/App.js

/* … */

module.exports = connect()(App);
```

While this is nice, we also need to tell `connect` that it should inject the `location` field we have in our reducer into this component. We do this by passing in a function as the first argument that takes the entire state, and then we return what we want to inject as props into our component. (this automatically injects `dispatch` to run our actions, which is why we can use `this.props.dispatch` in the `App` component)

```JS
// components/App.js

/* … */

module.exports = connect(function (state) {
	return {
		location: state.location
	};
})(App);
```

This function is called `mapStateToProps`, let's make that an external function so it's a bit clearer:

```JS
// components/App.js

/* … */

function mapStateToProps(state) {
	return {
		location: state.location
	};
}

module.exports = connect(mapStateToProps)(App);
```

And that's everything need to get our App to get the location from the Redux store! Let's adapt our `App` to get the location from the props:

```JS
// components/App.js

/* … */

var actions = require('./actions');

var App = React.createClass({
	fetchData: function(evt) {
    evt.preventDefault();

    var location = encodeURIComponent(this.props.location);

    /* … */
  },
	onPlotClick: function(data)  { /* … */ },
	changeLocation: function(evt) {
		this.props.dispatch(actions.setLocation(evt.target.value));
	},
	render: function() {
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
});
```

That's everything needed to get the initial wiring done! Open this in your browser and change the location input, you should see the value adjusting – this means redux is working as expected!

## Wiring up the rest

Let's wire up some other actions, the goal here is to get rid of the entire component state of the `App` component! Let's take a look at the selected date and temperature. The first we'll write is two actions, `setSelectedDate` and `setSelectedTemp`, that pass on the value that they get passed in.

```JS
// actions.js

exports.setSelectedDate = function setSelectedDate(date) {
  return {
    type: 'SET_SELECTED_DATE',
    date: date
  };
}

exports.setSelectedTemp = function setSelectedTemp(temp) {
  return {
    type: 'SET_SELECTED_TEMP',
    temp: temp
  };
}
```

Nothing fancy here, standard actions like the `setLocation` one.

Let's add those two constants to our reducer, and also adjust the initial state a bit to include those fields:

```JS
// reducers.js

var initialState = {
  location: '',
  selected: {
    date: '',
    temp: null
  }
};

exports.mainReducer = function mainReducer(state, action) {
  state = state || initialState;
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

var initialState = {
  location: '',
  selected: {
    date: '',
    temp: null
  }
};

exports.mainReducer = function mainReducer(state, action) {
  state = state || initialState;
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
      });;
    default:
      return state;
  }
}
```

Now let's wire it all up again in our `App` component:

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
    };
  },
  fetchData: function(evt) {
    /* … */

      self.setState({
        data: data,
        dates: dates,
        temps: temps,
      });

      this.props.dispatch(actions.setSelectedTemp(null));
      this.props.dispatch(actions.setSelectedDate(''));
    /* … */
  },
  onPlotClick: function(data) {
    if (data.points) {
      var number = data.points[0].pointNumber;
      this.props.dispatch(actions.setSelectedDate(this.state.dates[number]));
      this.props.dispatch(actions.setSelectedTemp(this.state.temps[number]));
    }
  },
  changeLocation: function(evt) { /* … */ },
  render: function() {
    /* … */
    return (
      {/* … */}
              <p>The temperature on { this.props.selected.date } will be { this.props.selected.temp }°C</p>
      {/* … */}
    );
  }
});

function mapStateToProps(state) {
	return {
		location: state.location,
    selected: state.selected
	};
}
```

There's three more actions (and constants and reducer cases) that need to be implemented here: `setData`, `setDates` and `setTemps`. I'll leave it up to you here to implement them, taking inspiration from our already implemented actions!
