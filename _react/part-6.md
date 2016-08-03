---
title: Testing
description: Testing React.js applications
layout: post
---

## Unit testing

Unit testing is the practice of testing the smallest possible *units* of our code, functions. We run our tests and automatically verify that our functions do the thing we expect them to do. We assert that, given a set of inputs, our functions return the proper values and handle problems.

We'll be using the [Mocha](https://github.com/mochajs/mocha) test framework to run the tests and [expect](http://github.com/mjackson/expect) for assertions. These libraries make writing tests as easy as speaking - you `describe` a unit of your code and `expect` `it` to do the correct thing.

### Basics

For the sake of this guide, lets pretend we're testing this function. It's situated in the `add.js` file:

```javascript
// add.js

export function add(x, y) {
  return x + y;
}
```

### Mocha

Mocha is our unit testing framework. Its API, which we write tests with, is speech like and easy to use.

> Note: This is the [official documentation](http://mochajs.org) of Mocha.

We're going to add a second file called `add.test.js` with our unit tests inside. Running said unit tests requires us to enter `mocha add.test.js` into the command line.

First, we `import` the function in our `add.test.js` file:

```javascript
// add.test.js

import { add } from './add.js';
```

Second, we `describe` our function:

```javascript
describe('add()', function() {

});
```

Third, we tell Mocha what `it` (our function) should do:

```javascript
describe('add()', function() {
  it('adds two numbers', function() {

  });

  it('doesnt add the third number', function() {

  });
});
```

That's the entire Mocha part! Onwards to the actual tests.

### expect

Using expect, we `expect` our little function to return the same thing every time given the same input.

> Note: This is the [official documentation](https://github.com/mjackson/expect) for expect.

First, we have to import `expect` at the top of our file, before the tests:

```javascript
import expect from 'expect';

describe('add()', function() {
  // [...]
});
```

We're going to test that our little function correctly adds two numbers first. We are going to take some chosen inputs, and `expect` the result `toEqual` the corresponding output:

```javascript
// [...]
it('adds two numbers', function() {
  expect(add(2, 3)).toEqual(5);
});
// [...]
```

Lets add the second test, which determines that our function doesn't add the third number if one is present:

```javascript
// [...]
it('doesnt add the third number', function() {
 expect(add(2, 3, 5)).toEqual(add(2, 3));
});
// [...]
```

> Note: Notice that we call `add` in `toEqual`. I won't tell you why, but just think about what would happen if we rewrote the expect as `expect(add(2, 3, 5)).toEqual(5)` and somebody broke something in the add function. What would this test actually... test?

Should our function work, Mocha will show this output when running the tests:

```
add()
  ✓ adds two numbers
  ✓ doesnt add the third number
```

Lets say an unnamed colleague of ours breaks our function:

```javascript
// add.js

export function add(x, y) {
  return x * y;
}
```

Oh no, now our function doesn't add the numbers anymore, it multiplies them! Imagine the consequences to our code that uses the function!

Thankfully, we have unit tests in place. Because we run the unit tests before we deploy our application, we see this output:

```
add()
  1) adds two numbers
  ✓ doesnt add the third number

  1) add adds two numbers:
    Error: Expected 6 to equal 5
```

This tells us that something is broken in the add function before any users get the code! Congratulations, you just saved time and money!

### Installation

Let's get to it and actually test some application parts.

First we have to install a few necessary modules, namely `mocha` (the testing framework) and `babel-core` with `babel-preset-es2015`. (to transpile our code to ES5)

```
npm install babel-core mocha babel-preset-es2015
```

We then add a `.babelrc` file at the root folder which tells Babel to transpile our code to ES2015:

```JSON
{
	"presets": ["es2015"]
}
```

To run our tests, look into your `package.json` and add this to the `"scripts"` field:

```JSON
"scripts" {
		"test": "mocha src/test/*.test.js --compilers js:babel-core/register"
}
```

This tells Mocha to run all the `.test.js` files in the `test` folder (you better create that now!) and to compile those files with Babel.

### Redux

The nice thing about Redux is that it makes our data flow entirely consist of "pure" functions. Pure functions are functions that return the same output with the same input everytime – they don't have any side effects!

Let's test our actions first!

### Actions

Create a new file called `actions.test.js` in the `src/test/` folder. (create that if you haven't already) Let's start by testing the good ol' `changeLocation` action. Add the default structure, we'll need to import `expect` and the action we want to test and `describe` "actions" and `changeLocation`:

```JS
// actions.test.js
import expect from 'expect';
import {
  changeLocation
} from '../actions';

describe('actions', function() {
  describe('changeLocation', function () {

  });
});
```

There's two things we want to verify of our action function: that it has the correct type and that it passes on the data we tell it to pass on. Let's verify the type of the `changeLocation` action is `'CHANGE_LOCATION'`:

```JS
// actions.test.js
/* … */
describe('changeLocation', function () {
  it('should have a type of "CHANGE_LOCATION"', function() {
    expect(changeLocation().type).toEqual('CHANGE_LOCATION');
  });
});
```

Run `npm run test` in the console and this is what you should see:

```
actions
  changeLocation
    ✓ should have a type of CHANGE_LOCATION


  1 passing
```

Nice, let's verify that it passes on the location we pass into it:

```JS
// actions.test.js
/* … */
describe('changeLocation', function () {
  it('should have a type of "CHANGE_LOCATION"', function() {
    expect(changeLocation().type).toEqual('CHANGE_LOCATION');
  });

  it('should pass on the location we pass in', function() {
    var location = 'Vienna, Austria';
    expect(changeLocation(location).location).toEqual(location);
  });
});
```

Nice! Now let's do the same thing for the `setSelectedDate` and `setSelectedTemp` action! First, `import` those two actions at the of the file and add the `describe` and `it`s:

```JS
describe('actions', function() {
  describe('changeLocation', function () { /* … */ });

  describe('setSelectedDate', function() {
    it('should have a type of SET_SELECTED_DATE', function() { });

		it('should pass on the date we pass in', function() { });
  });

  describe('setSelectedTemp', function() {
    it('should have a type of SET_SELECTED_TEMP', function() { });

		it('should pass on the temp we pass in', function() { });
  });
});
```

First let's verify our `setSelectedDate` works as expected:

```JS
describe('actions', function() {
  describe('changeLocation', function () { /* … */ });

  describe('setSelectedDate', function() {
    it('should have a type of SET_SELECTED_DATE', function() {
			expect(setSelectedDate().type).toEqual('SET_SELECTED_DATE');
		});

		it('should pass on the date we pass in', function() {
			var date = '2016-01-01';
			expect(setSelectedDate(date).date).toEqual(date);
		});
  });

  describe('setSelectedTemp', function() {
    it('should have a type of SET_SELECTED_TEMP', function() { });

		it('should pass on the temp we pass in', function() { });
  });
});
```

and then our `setSelectedTemp`:

```JS
describe('actions', function() {
  describe('changeLocation', function () { /* … */ });

  describe('setSelectedDate', function() {
    it('should have a type of SET_SELECTED_DATE', function() {
			expect(setSelectedDate().type).toEqual('SET_SELECTED_DATE');
		});

		it('should pass on the date we pass in', function() {
			var date = '2016-01-01';
			expect(setSelectedDate(date).date).toEqual(date);
		});
  });

  describe('setSelectedTemp', function() {
    it('should have a type of SET_SELECTED_TEMP', function() {
			expect(setSelectedTemp().type).toEqual('SET_SELECTED_TEMP');
		});

		it('should pass on the temp we pass in', function() {
			var temp = '31';
			expect(setSelectedTemp(temp).temp).toEqual(temp);
		});
  });
});
```

Not too hard, huh? Run `npm run test` in your console now, and this is what you should see:

```
actions
  changeLocation
    ✓ should have a type of CHANGE_LOCATION
    ✓ should pass on the location we pass in
  setSelectedDate
    ✓ should have a type of SET_SELECTED_DATE
    ✓ should pass on the date we pass in
  setSelectedTemp
    ✓ should have a type of SET_SELECTED_TEMP
    ✓ should pass on the temp we pass in


  6 passing
```

Now go on and test the other actions too, I'll be here waiting for you! (skip the `fetchData` action, one negative aspect of thunks is how hard they are to test so we'll skip it)

----

Back? Everything tested? You should now see something like this in your console when running `npm run test`:

```
actions
  changeLocation
    ✓ should have a type of CHANGE_LOCATION
    ✓ should pass on the location we pass in
  setSelectedDate
    ✓ should have a type of SET_SELECTED_DATE
    ✓ should pass on the date we pass in
  setSelectedTemp
    ✓ should have a type of SET_SELECTED_TEMP
    ✓ should pass on the temp we pass in
  setData
    ✓ should have a type of SET_DATA
    ✓ should pass on the data we pass in
  setDates
    ✓ should have a type of SET_DATES
    ✓ should pass on the dates we pass in
  setTemps
    ✓ should have a type of SET_TEMPS
    ✓ should pass on the temps we pass in


  12 passing
```

And this is what your `actions.test.js` file could look like:

```JS
// actions.test.js

import expect from 'expect';
import {
	changeLocation,
	setSelectedDate,
	setSelectedTemp,
	setData,
	setDates,
	setTemps
} from '../actions';

describe('actions', function() {
	describe('changeLocation', function() {
		it('should have a type of CHANGE_LOCATION', function() {
			expect(changeLocation().type).toEqual('CHANGE_LOCATION');
		});

		it('should pass on the location we pass in', function() {
			var location = 'Vienna, Austria';
			expect(changeLocation(location).location).toEqual(location);
		});
	});

	describe('setSelectedDate', function() {
		it('should have a type of SET_SELECTED_DATE', function() {
			expect(setSelectedDate().type).toEqual('SET_SELECTED_DATE');
		});

		it('should pass on the date we pass in', function() {
			var date = '2016-01-01';
			expect(setSelectedDate(date).date).toEqual(date);
		});
	});

	describe('setSelectedTemp', function() {
		it('should have a type of SET_SELECTED_TEMP', function() {
			expect(setSelectedTemp().type).toEqual('SET_SELECTED_TEMP');
		});

		it('should pass on the temp we pass in', function() {
			var temp = '31';
			expect(setSelectedTemp(temp).temp).toEqual(temp);
		});
	});

	describe('setData', function() {
		it('should have a type of SET_DATA', function() {
			expect(setData().type).toEqual('SET_DATA');
		});

		it('should pass on the data we pass in', function() {
			var data = { some: 'data' };
			expect(setData(data).data).toEqual(data);
		});
	});

	describe('setDates', function() {
		it('should have a type of SET_DATES', function() {
			expect(setDates().type).toEqual('SET_DATES');
		});

		it('should pass on the dates we pass in', function() {
			var dates = ['2016-01-01', '2016-01-02'];
			expect(setDates(dates).dates).toEqual(dates);
		});
	});

	describe('setTemps', function() {
		it('should have a type of SET_TEMPS', function() {
			expect(setTemps().type).toEqual('SET_TEMPS');
		});

		it('should pass on the temps we pass in', function() {
			var temps = ['31', '32'];
			expect(setTemps(temps).temps).toEqual(temps);
		});
	});
});
```

Perfect, that part of our app is now comprehensively tested and we'll know as soon as somebody breaks something! Onwards to the reducer!

### Reducer

The reducer is, again, a pure function! It's quite easy to see what we need to validate actually, basically every `case` of our `switch` needs to have a test:

```JS
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

Let's showcase this on the `'CHANGE_LOCATION'` case, first create a `reducer.test.js` file in the `test/` directory and


```
actions
  changeLocation
    ✓ should have a type of CHANGE_LOCATION
    ✓ should pass on the location we pass in
  setSelectedDate
    ✓ should have a type of SET_SELECTED_DATE
    ✓ should pass on the date we pass in
  setSelectedTemp
    ✓ should have a type of SET_SELECTED_TEMP
    ✓ should pass on the temp we pass in
  setData
    ✓ should have a type of SET_DATA
    ✓ should pass on the data we pass in
  setDates
    ✓ should have a type of SET_DATES
    ✓ should pass on the dates we pass in
  setTemps
    ✓ should have a type of SET_TEMPS
    ✓ should pass on the temps we pass in

  mainReducer
    ✓ should return the initial state
    ✓ should react to an action with the type 'CHANGE_LOCATION'
    ✓ should react to an action with the type 'SET_DATA'
    ✓ should react to an action with the type 'SET_DATES'
    ✓ should react to an action with the type 'SET_TEMPS'
    ✓ should react to an action with the type 'SET_SELECTED_DATE'
    ✓ should react to an action with the type 'SET_SELECTED_TEMP'


  19 passing
```

## React

<!-- Syntax highlighting -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.5.1/prism.min.js"></script>
<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.5.1/themes/prism.min.css">
<!-- /Syntax highlighting -->
