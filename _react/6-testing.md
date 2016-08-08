---
title: Testing
description: Testing React.js applications
layout: post
author:
  name: Max Stoiber
  avatar: http://mxstbr.com/headshot.jpeg
  twitter: "@mxstbr"
  bio: Max is the creator of <a href="https://github.com/mxstbr/react-boilerplate">react-boilerplate</a>, one of the most popular react starter kits, the co-creator of <a href="https://github.com/carteb/carte-blanche">Carte Blanche</a> and he co-organises the React.js Vienna Meetup. He works as an Open Source Developer at <a href="http://thinkmill.com.au">Thinkmill</a>, where he takes care of <a href="http://keystonejs.com">KeystoneJS</a>.
---

## Unit testing

Unit testing is the practice of testing the smallest possible *units* of our code, functions. We run our tests and automatically verify that our functions do the thing we expect them to do. We assert that, given a set of inputs, our functions return the proper values and handle problems.

We'll be using the [Jest](https://facebook.github.io/jest/) test framework by facebook. It was written to help test react apps, and is perfect for that purpose! It makes writing tests as easy as speaking - you `describe` a unit of your code and `expect` `it` to do the correct thing.

### Basics

For the sake of this guide, lets pretend we're testing this function. It's situated in the `add.js` file:

```javascript
// add.js

export function add(x, y) {
  return x + y;
}
```

### Jest

Jest is our unit testing framework. Its API, which we write tests with, is speech like and easy to use.

> Note: This is the [official documentation](http://facebook.github.io/jest) of Jest.

We're going to add a second file called `add.test.js` in a subfolder called `__tests__` with our unit tests inside. Running said unit tests requires us to enter `npm run test -- __tests__/add.test.js` into the command line.

First, we `import` the function in our `add.test.js` file:

```javascript
// add.test.js

import { add } from '../add.js';
```

Second, we `describe` our function:

```javascript
describe('add()', function() {

});
```

Third, we tell Jest what `it` (our function) should do:

```javascript
describe('add()', function() {
  it('adds two numbers', function() {

  });

  it('doesnt add the third number', function() {

  });
});
```

Now we have to `expect` our little function to return the same thing every time given the same input. We're going to test that our little function correctly adds two numbers first. We are going to take some chosen inputs, and `expect` the result `toEqual` the corresponding output:

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

Should our function work, Jest will show this output when running the tests:

```
PASS  __tests__/add.test.js (0.537s)
2 tests passed (2 total in 1 test suite, run time 0.557s)
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
Using Jest CLI v14.1.0, jasmine2
 FAIL  __tests__/add.test.js (0.535s)
● add() › it adds two numbers
  - Expected 6 to equal 5.
        at Object.<anonymous> (__tests__/add.test.js:5:65)
1 test failed, 1 test passed (2 total in 1 test suite, run time 0.564s)
```

This tells us that something is broken in the add function before any users get the code! Congratulations, you just saved time and money!

### Redux

The nice thing about Redux is that it makes our data flow entirely consist of "pure" functions. Pure functions are functions that return the same output with the same input everytime – they don't have any side effects!

Let's test our actions first!

#### Actions

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
PASS  src/__tests__/actions.test.js (0.525s)
1 test passed (1 total in 1 test suite, run time 0.55s)
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
PASS  src/__tests__/actions.test.js (0.531s)
6 tests passed (6 total in 1 test suite, run time 0.554s)
```

Now go on and test the other actions too, I'll be here waiting for you! (skip the `fetchData` action, one negative aspect of thunks is how hard they are to test so we'll skip it)

----

Back? Everything tested? You should now see something like this in your console when running `npm run test`:

```
PASS  src/__tests__/actions.test.js (0.357s)
12 tests passed (12 total in 1 test suite, run time 0.384s)
```

This isn't the nicest output though, if you run `npm run test -- --verbose` you should see a much nicer list of tests that passed like so:

```
PASS  src/__tests__/actions.test.js (0.364s)
 actions
   changeLocation
     ✓ it should have a type of CHANGE_LOCATION (5ms)
     ✓ it should pass on the location we pass in (1ms)
   setSelectedDate
     ✓ it should have a type of SET_SELECTED_DATE (1ms)
     ✓ it should pass on the date we pass in
   setSelectedTemp
     ✓ it should have a type of SET_SELECTED_TEMP (1ms)
     ✓ it should pass on the temp we pass in
   setData
     ✓ it should have a type of SET_DATA
     ✓ it should pass on the data we pass in (1ms)
   setDates
     ✓ it should have a type of SET_DATES
     ✓ it should pass on the dates we pass in
   setTemps
     ✓ it should have a type of SET_TEMPS (1ms)
     ✓ it should pass on the temps we pass in

12 tests passed (12 total in 1 test suite, run time 0.392s)
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

#### Reducer

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
PASS  src/__tests__/actions.test.js (0.365s)
 actions
   changeLocation
     ✓ it should have a type of CHANGE_LOCATION (5ms)
     ✓ it should pass on the location we pass in (1ms)
   setSelectedDate
     ✓ it should have a type of SET_SELECTED_DATE (1ms)
     ✓ it should pass on the date we pass in
   setSelectedTemp
     ✓ it should have a type of SET_SELECTED_TEMP (1ms)
     ✓ it should pass on the temp we pass in
   setData
     ✓ it should have a type of SET_DATA (1ms)
     ✓ it should pass on the data we pass in
   setDates
     ✓ it should have a type of SET_DATES
     ✓ it should pass on the dates we pass in (1ms)
   setTemps
     ✓ it should have a type of SET_TEMPS
     ✓ it should pass on the temps we pass in (1ms)

PASS  src/__tests__/reducer.test.js (0.515s)
 mainReducer
   ✓ it should return the initial state (7ms)
   ✓ it should react to an action with the type 'CHANGE_LOCATION' (1ms)
   ✓ it should react to an action with the type 'SET_DATA' (3ms)
   ✓ it should react to an action with the type 'SET_DATES' (4ms)
   ✓ it should react to an action with the type 'SET_TEMPS' (2ms)
   ✓ it should react to an action with the type 'SET_SELECTED_DATE' (1ms)
   ✓ it should react to an action with the type 'SET_SELECTED_TEMP'

19 tests passed (19 total in 2 test suites, run time 0.819s)
```

## React




Now that we have all that done, let's make our app a true app and create Android and iOS versions of it in [Part 7: React Native](/react/7-native-mobile-apps/)!

<!-- Syntax highlighting -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.5.1/prism.min.js"></script>
<!-- /Syntax highlighting -->
