---
title: Immutable React
description: Learn how to enhance your application with immutability to increase the performance and avoid mutation bugs!
layout: post
author:
  name: Max Stoiber
  avatar: http://mxstbr.com/headshot.jpeg
  twitter: "@mxstbr"
  bio: Max is the creator of <a href="https://github.com/mxstbr/react-boilerplate">react-boilerplate</a>, one of the most popular react starter kits, the co-creator of <a href="https://github.com/carteb/carte-blanche">Carte Blanche</a> and he co-organises the React.js Vienna Meetup. He works as an Open Source Developer at <a href="http://thinkmill.com.au">Thinkmill</a>, where he takes care of <a href="http://keystonejs.com">KeystoneJS</a>.
---

As we discovered in Chapter 4: Redux, immutability is quite helpful when developing applications! It makes it so much easier to reason about what is happening to your data, as nothing can be mutated from somewhere entirely different.

The problem is that JavaScript is by default a mutable language. Other developers that don't have this intricate knowledge of immutability might still mess up, mutate the state and break our app in unexpected ways.

Facebook released a second library called `Immutable.js` that adds immutable data structures to JavaScript! Let's see what this looks like.

## Introduction to ImmutableJS

> If you want to follow along with the initial explanations, you'll have to `npm install immutable`!

ImmutableJS exports this nice little `fromJS` function that allows us to create immutable data structures from your standard JavaScript objects and arrays. (it also adds a `toJS` method to make objects and arrays out of them again) Let's create an immutable object:

```JS
import { fromJS } from 'immutable';

var immutableObject = fromJS({
	some: 'object',
	some: {
		nested: 'object'
	}
});
```

If you now tried to do `object.some = 'notobject'`, i.e. tried to change the data inside this object, immutable would throw an error! That's the power of immutable data structures, you know exactly what they are.

Now you might be thinking "But then how can we set a property?". Well, ImmutableJS still let's us set properties with the `set` and `setIn` methods! Let's take a look at an example:

```JS
import { fromJS } from 'immutable';

var immutableObject = fromJS({
	some: 'object'
});

immutableObject.set('some', 'notobject');
```

If you now `console.log(immutableObject.toJS())` though, you'll get our initial object again. Why?

Well, since `immutableObject` is immutable, what happens when you `immutableObject.set` is **that a new immutable object is returned with the changes**. No mutation happening, this is kind of like what we did with `Object.assign` for our reducers!

Let's see if that works:

```JS
import { fromJS } from 'immutable';

var immutableObject = fromJS({
	some: 'object'
});

var newObject = immutableObject.set('some', 'notobject');
```

If you now `console.log(newObject.toJS())`, this is what you'll get:

```JSON
{
	"some": "notobject"
}
```

The changes are there, awesome! `immutableObject` on the other hand still is our old `{ some: 'object' }` without changes.

As I mentioned before, this is kind of what we did in our redux reducer right? So what would happen if we used ImmutableJS there? Let's try it!

## Immutable Redux

First, we need to install ImmutableJS from `npm`:

```
npm install --save immutable
```

Then we make the initial state in our reducer an immutable object by using the `fromJS` function! We simply wrap the object that we assign to `initialState` in `fromJS` like so:

```JS
// reducer.js
/* … */
import { fromJS } from 'immutable';

var initialState = fromJS({
  /* … */
});

/* … */
```

Now we need to rework our reducer. Since our state is now immutable, instead of doing `Object.assign({}, state, { /* … */ })` everywhere we can simply use `state.set`!

Let's showcase this on the `CHANGE_LOCATION` action. This is what our reducer looks like right now:

```JS
case 'CHANGE_LOCATION':
	return Object.assign({}, state, {
	  location: action.location		
	});
```

Instead of doing this whole assigning business, we can simply `return state.set('location', action.location)`!

```JS
case 'CHANGE_LOCATION':
	return state.set('location', action.location);
```

Not only is that a lot cleaner, it's also forcing us to work immutably, which means we can't accidentally mess something up and introduce weird bugs! 🎉

Let's do the same thing for our `SET_DATA`, `SET_DATES` and `SET_TEMPS` cases:

```JS
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
```

This whole block becomes:

```JS
case 'SET_DATA':
 return state.set('data', fromJS(action.data));
case 'SET_DATES':
 return state.set('dates', fromJS(action.dates));
case 'SET_TEMPS':
 return state.set('temps', fromJS(action.temps));
```

Isn't that nice? Now, here's the last trickery in our reducer, because what do we do for `SET_SELECTED_TEMP` and `SET_SELECTED_DATE`? How do we set `state.selected.temp`?

It turns out Immutable provides us with a really nice function for that called `setIn`. We can use `setIn` to set a nested property by passing in an array of keys we want to iterate through! Let's take a look at that for our `SET_SELECTED_DATE`.

This is what it currently looks like:

```JS
case 'SET_SELECTED_DATE':
  return Object.assign({}, state, {
    selected: {
      date: action.date,
      temp: state.selected.temp
    }
  });
```

This works, but you have to agree it's not very nice. With `setIn`, we can simply replace this entire call with this short form:

```JS
case 'SET_SELECTED_DATE':
  return state.setIn(['selected', 'date'], action.date);
```

So beautiful! Let's do the same thing for `SET_SELECTED_TEMP` and we're done here!

```JS
case 'SET_SELECTED_TEMP':
  return Object.assign({}, state, {
    selected: {
      date: state.selected.date,
      temp: action.temp
    }
  });
```

becomes

```JS
case 'SET_SELECTED_TEMP':
  return state.setIn(['selected', 'temp'], action.temp);
```

This is what our reducer looks like finally:

```JS
import { fromJS } from 'immutable';

var initialState = fromJS({
  location: '',
  data: {},
  dates: [],
  temps: [],
  selected: {
    date: '',
    temp: null
  }
});

export default function mainReducer(state = initialState, action) {
  switch (action.type) {
    case 'CHANGE_LOCATION':
      return state.set('location', action.location);
    case 'SET_DATA':
      return state.set('data', fromJS(action.data));
    case 'SET_DATES':
      return state.set('dates', fromJS(action.dates));
    case 'SET_TEMPS':
      return state.set('temps', fromJS(action.temps));
    case 'SET_SELECTED_DATE':
      return state.setIn(['selected', 'date'], action.date);
    case 'SET_SELECTED_TEMP':
      return state.setIn(['selected', 'temp'], action.temp);
    default:
      return state;
  }
}
```

If you now try to run your app though, nothing will work and you'll get an error.

This is because in our `App` component we have a `mapStateToProps` function that simply returns the entire state! An easy trick would be to return `state.toJS`, kind of like this:

```JS
function mapStateToProps(state) {
  return state.toJS();
}
```

In fact, try this and you'll see that works! There's two downsides to this approach though:

1. Converting from (`fromJS`) and to (`toJS`) JavaScript objects to immutable data structures is _very performance expensive and slow_. This is fine for the `initialState` because we only ever convert that once, but doing that on every render will have an impact on your app.

2. You thus lose the main benefit of ImmutableJS, which is performance!

Now you might be thinking "But if it's so expensive, how can ImmutableJS have performance as its main benefit?". To explain that we have to quickly go over how ImmutableJS works.

## How ImmutableJS works

Immutable data structures can't be changed. So when we convert a regular JavaScript object with `fromJS` what ImmutableJS does is loop over every single property and value in the object (including nested objects and arrays) and transfers it to a new, immutable one. (the same thing applies in the other direction for `toJS`)

The problem with standard JavaScript objects is that they have reference equality. That means even when two objects have the same content, they're not the same:

```JS
var object1 = {
	twitter: '@mxstbr'
};

var object2 = {
	twitter: '@mxstbr'
};

console.log(object1 === object2); // -> false
```

In the above example, even though `object1` and `object2` have the exact same contents, they aren't the exact same object and thus aren't equal. To properly check if two variables contain the same thing in JavaScript we'd have to loop over every property and value in those variables (including nested things) and check it against the other object.

That's very, very slow.

Since immutable objects can't ever be changed again, ImmutableJS can _compute a hash based on the contents of the object_ and store that in a private field. Since this hash is based on the contents, when Immutable then compares two objects it only has to compare two hashes, i.e. two strings! That's a lot faster than looping over every property and value and comparing those!

```JS
var object1 = fromJS({
	twitter: '@mxstbr'
});

var object2 = fromJS({
	twitter: '@mxstbr'
});

console.log(object1.equals(object2)); // -> true 🎉
```

That's nice and all, but how is this helpful in our app?

## Utilising ImmutableJS for top performance

As a short experiment, try putting a `console.log('RENDER PLOT')` into the `render` method of the `Plot` component:

```JS
class Plot extends React.Component {
	/* … */
	render() {
		console.log('RENDER PLOT');
    return (
      <div id="plot" ref="plot"></div>
    );
  }
}
```

Now try using the app for a bit, clicking around, request data for different cities. What you might notice is _that the `Plot` rerenders even if we only change the location field and the plot itself stays the exact same_!

This is a react feature, react rerenders your entire app whenever something changes. This doesn't necessarily have a massive performance impact on our current application, but it'll definitely bite you in a production application! So, what can we do against that?

### `shouldComponentUpdate`


React provides us with a nice lifecycle method called `shouldComponentUpdate` which allows us to regulate when our components should rerender. As an example, try putting this into your `Plot`:

```JS
class Plot extends React.Component {
	shouldComponentUpdate(nextProps) {
		return false;
	}
	/* … */
}
```

Now try loading some data and rendering a plot. What you see is that _the plot never renders_. This is because we're basically telling react above that no matter what data comes into our component, it should never render the `Plot`! On the other hand, if we `return true` from there we'd have the default behaviour back, i.e. rerender whenever new data comes in.


As I've hinted with the variable above, `shouldComponentUpdate` gets passed `nextProps`. This means, in theory, we could check if the props of the `Plot` have changed and only rerender if that happens, right? Something like this:

```JS
class Plot extends React.Component {
	shouldComponentUpdate(nextProps) {
		return this.props !== nextProps;
	}
	/* … */
}
```

Well, here we hit the problem we talked about above. (`{ twitter: '@mxstbr' } !== { twitter: '@mxstbr' }`) Those will always be different since they might have the same content, but they won't be the same object!

This is where ImmutableJS comes in, because while we could do a _deep comparison_ of those two objects, it's a lot cheaper if we could just do this:

```JS
class Plot extends React.Component {
	shouldComponentUpdate(nextProps) {
		return !this.props.equals(nextProps);
	}
	/* … */
}
```

Let's try getting some immutable data to our `Plot`!

In our `mapStateToProps` function, instead of returning `state.toJS()` we should just return the immutable state. The problem is that redux expects the value we return from `mapStateToProps` to be a standard javascript object, and it'll throw an error if we just do `return state;` and nothing will work.

So let's return an object from `mapStateToProps` that has a `redux` field instead:

```JS
function mapStateToProps(state) {
  return {
		redux: state
	};
}
```

Then, in our `App` we now have access to `this.props.redux`! We can access properties in there with `this.props.redux.get` (and `getIn`), so let's replace all instances where we access the state with that.

Let's start from the top, in `fetchData`. There's only a single `this.props.location` in there, which we replace with `this.props.redux.get('location')`:

```JS
class App extends React.Component {
  fetchData = (evt) => {
    evt.preventDefault();

    var location = encodeURIComponent(this.props.redux.get('location'));

    /* … */
  };

  onPlotClick = (data) => {/* … */};

  changeLocation = (evt) => {/* … */};

  render() {/* … */}
}
```

We don't access the props at all in `onPlotClick` and `changeLocation`, so we can skip those!

In `render`, the first access is already a bit more difficult – we want to replace `this.props.data.list`… Do you remember how to do that?

…

With `getIn`! Like this:

```JS
class App extends React.Component {
	fetchData = (evt) => {/* … */};

	onPlotClick = (data) => {/* … */};

	changeLocation = (evt) => {/* … */};

	render() {
		var currentTemp = 'not loaded yet';
		if (this.props.redux.getIn(['data', 'list'])) {
			/* … */
		}
		return (/* … */);
	}
}
```

Now, for the next one (`this.props.data.list[0].main.temp`) you might think of writing `this.props.redux.getIn(['data', 'list'])[0].main.temp`, but the problem is that `this.props.redux.getIn(['data', 'list'])` is an immutable array too!

So, instead we can just further use `getIn`:

```JS
class App extends React.Component {
  fetchData = (evt) => {/* … */};

  onPlotClick = (data) => {/* … */};

  changeLocation = (evt) => {/* … */};

  render() {
    var currentTemp = 'not loaded yet';
    if (this.props.redux.getIn(['data', 'list'])) {
      currentTemp = this.props.redux.getIn(['data', 'list', '0', 'main', 'temp']);
    }
    return (/* … */);
  }
}
```

Now try doing the other `this.props.something` on your own! I'll be here waiting…

----

Done? This is what your `render` method should look like:

```JS
class App extends React.Component {
  fetchData = (evt) => {/* … */};

  onPlotClick = (data) => {/* … */};

  changeLocation = (evt) => {/* … */};

  render() {
    var currentTemp = 'not loaded yet';
    if (this.props.redux.getIn(['data', 'list'])) {
      currentTemp = this.props.redux.getIn(['data', 'list', '0', 'main', 'temp']);
    }
    return (
      <div>
        <h1>Weather</h1>
        <form onSubmit={this.fetchData}>
          <label>I want to know the weather for
            <input
              placeholder={"City, Country"}
              type="text"
              value={this.props.redux.get('location')}
              onChange={this.changeLocation}
            />
          </label>
        </form>
        {/*
          Render the current temperature and the forecast if we have data
          otherwise return null
        */}
        {(this.props.redux.getIn(['data', 'list'])) ? (
          <div className="wrapper">
            {/* Render the current temperature if no specific date is selected */}
            <p className="temp-wrapper">
              <span className="temp">
                { this.props.redux.getIn(['selected', 'temp']) ? this.props.redux.getIn(['selected', 'temp']) : currentTemp }
              </span>
              <span className="temp-symbol">°C</span>
              <span className="temp-date">
                { this.props.redux.getIn(['selected', 'temp']) ? this.props.redux.getIn(['selected', 'date']) : ''}
              </span>
            </p>
            <h2>Forecast</h2>
            <Plot
              xData={this.props.redux.get('dates')}
              yData={this.props.redux.get('temps')}
              onPlotClick={this.onPlotClick}
              type="scatter"
            />
          </div>
        ) : null}

      </div>
    );
  }
}
```

As you might've noticed, this doesn't work though, the Plot doesn't render. Why? Well, take a look at how we pass in the data:

```HTML
<Plot
	xData={this.props.redux.get('dates')}
	yData={this.props.redux.get('temps')}
	onPlotClick={this.onPlotClick}
	type="scatter"
/>
```

As you can see, we pass in `this.props.redux.get('…')` – which is an immutable object! The `Plot` component cannot handle those at the moment though, so we need to update it a bit.

Let's take a peek at the only method where we use `this.props.xData` and `this.props.yData` in our `Plot` component:

```JS
// Plot.js

class Plot extends React.Component {
  drawPlot = () => {
    Plotly.newPlot('plot', [{
      x: this.props.xData,
      y: this.props.yData,
      type: this.props.type
    }], {/* … */}, {/* … */});
    /* … */
  }

  componentDidMount() {/* … */}
  componentDidUpdate() {/* … */}
  render() {/* … */}
}
```

This is where `toJS` comes in! Let's do this:

```JS
// Plot.js

class Plot extends React.Component {
  drawPlot = () => {
    Plotly.newPlot('plot', [{
      x: this.props.xData.toJS(),
      y: this.props.yData.toJS(),
      type: this.props.type
    }], {/* … */}, {/* … */});
    /* … */
  }

  componentDidMount() {/* … */}
  componentDidUpdate() {/* … */}
  render() {/* … */}
}
```

And everything works again!

We still haven't solved the original problem though, the `Plot` still rerenders everytime something changes, even if it's not related to the Plot. Really, _the only time we ever want that component to rerender is when either `xData` or `yData` changes!_

Let's apply our knowledge of ImmutableJS and of `shouldComponentUpdate`, and fix this together. Let's check if `this.props.xData` and `this.props.yData` are the same and only rerender if one of them changed:

```JS
// Plot.js

class Plot extends React.Component {
  drawPlot = () => {/* … */}

	shouldComponentUpdate(nextProps) {
		const xDataChanged = !this.props.xData.equals(nextProps.xData);
		const yDataChanged = !this.props.yData.equals(nextProps.yData);

		return xDataChanged || yDataChanged;
	}


  componentDidMount() {/* … */}
  componentDidUpdate() {/* … */}
  render() {/* … */}
}
```

> Since these two (`xData` and `yData`) are immutable, we can really quickly compare their contents, which means this won't have an unnecessary performance impact!

Try putting a `console.log` into your render function again:

```JS
class Plot extends React.Component {
	/* … */
	render() {
		console.log('RENDER PLOT');
    return (
      <div id="plot" ref="plot"></div>
    );
  }
}
```

Now try clicking around and loading different cities.

**The `Plot` component now only rerenders when new data comes in! 🎉**

We've entirely gotten rid of the continuous rerenders, and only rerender when it's _really_ necessary! This is awesome!

Let's explore how we can make sure our app works the way we expect it to, no matter who's working on it, in <a href="/react/6-testing/">Chapter 6: Testing</a>!

## Additional Material

- <a href="http://facebook.github.io/immutable-js" target="_blank">Official ImmutableJS docs</a>
- <a href="https://auth0.com/blog/intro-to-immutable-js/" target="_blank">Introduction to Immutable.js and Functional Programming Concepts</a>
- <a href="http://reactkungfu.com/2015/08/pros-and-cons-of-using-immutability-with-react-js/" target="_blank">Pros and Cons of using immutability with React.js</a>

<!-- Syntax highlighting -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.5.1/prism.min.js"></script>
<!-- /Syntax highlighting -->
