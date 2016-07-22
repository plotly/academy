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
var immutable = require('immutable');

var immutableObject = immutable.fromJS({
	some: 'object',
	some: {
		nested: 'object'
	}
});
```

If you now tried to do `object.some = 'notobject'`, i.e. tried to change the data inside this object, immutable would throw an error! That's the power of immutable data structures, you know exactly what they are.

Now you might be thinking "But then how can we set a property?". Well, ImmutableJS still let's us set properties with the `set` and `setIn` methods! Let's take a look at an example:

```JS
var immutable = require('immutable');

var immutableObject = immutable.fromJS({
	some: 'object'
});

immutableObject.set('some', 'notobject');
```

If you now `console.log(immutableObject.toJS())` though, you'll get our initial object again though? Why?

Well, since `immutableObject` is immutable, what happens when you `immutableObject.set` is **that a new immutable object is returned with the changes**. No mutation happening, this is kind of like what we did with `Object.assign` for our reducers!

Let's see if that works:

```JS
var immutable = require('immutable');

var immutableObject = immutable.fromJS({
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

Then we make the initial state in our reducer an immutable object by using the `fromJS` function! We simply wrap the object that we assign to `initialState` in `immutable.fromJS` like so:

```JS
// reducer.js
/* … */
var immutable = require('immutable');

var initialState = immutable.fromJS({
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

Not only is that a lot cleaner, it's also forcing us to work immutably which means we can't accidentally mess something up and introduce weird bugs! 🎉
