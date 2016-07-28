---
title: ImmutableJS
description: Enhance your application with immutability
layout: post
---

As we discovered in Part 4: Redux, immutability is quite helpful when developing applications! It makes it so much easier to reason about what is happening to your data, as nothing can be mutated from somewhere entirely different.

The problem is that JavaScript is by default a mutable language. Other developers that don't have this intricate knowledge of immutability might still mess up, mutate the state and break our app in unexpected ways.

Facebook released a second library called `Immutable.js` that adds immutable data structures to JavaScript! Let's see what this looks like.

## Introduction to ImmutableJS

> If you want to follow along with the initial explanations, you'll have to `npm install immutable`!

ImmutableJS exports this nice little `fromJS` function that allows us to create immutable data structures from your standard JavaScript objects and arrays. (also adds a `toJS` method to make objects and arrays out of them again) Let's create an immutable object:

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

If you now `console.log(immutableObject.toJS())` though, you'll get our initial object again though? Why?

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
$ npm install immutable
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

Instead of doing this whole assinging business, we can simply `return state.set('location', action.location)`!

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

2. You thus loose the main benefit of ImmutableJS, which is performance!

Now you might be thinking "But if it's so expensive, how can ImmutableJS have performance as its main benefit?". To explain that we have to quickly go over how ImmutableJS works.

## How ImmutableJS works

Immutable data structures can't be changed. So when we convert a regular JavaScript object with `fromJS` what ImmutableJS does is loop over every single property and value in the object (including nested object and arrays) and transfers it to a new, immutable one. (the same thing applies in the other direction for `toJS`)

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

That's very very slow.

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

In our `mapStateToProps` function, instead of returning `state.toJS()` we should just return the immutable state. The problem is that redux expects the value we return from `mapStateToProps` to be a standard javascript object, and it'll throw an error if we just do `return state;` and nothing will work.

So let's return an object from `mapStateToProps` that has a `redux` field instead:

```JS
function mapStateToProps(state) {
  return {
		redux: state
	};
}
```
