---
title: Testing your app with Jest
description: Testing React.js applications
layout: post
author:
  name: Max Stoiber
  avatar: http://mxstbr.com/headshot.jpeg
  twitter: "@mxstbr"
  bio: Max is the creator of <a href="https://github.com/mxstbr/react-boilerplate">react-boilerplate</a>, one of the most popular react starter kits, the co-creator of <a href="https://github.com/carteb/carte-blanche">Carte Blanche</a> and he co-organises the React.js Vienna Meetup. He works as an Open Source Developer at <a href="http://thinkmill.com.au">Thinkmill</a>, where he takes care of <a href="http://keystonejs.com">KeystoneJS</a>.
---

Testing apps is something that a lot of developers _should_ be doing, but a lot of them don't. It has a bunch of really nice benefits:

1. **You catch bugs before they happen.** The obvious out of the bunch, but nontheless very important. We all make mistakes, and with an automated test suite (an array of tests) we make sure no users has to ever see those!
2. **Tests are executable documentation.** This is in my opinion the biggest benefit. With a function that is well tested you can immediately figure out what it's used for, how you should use it and what to expect it to do! No more tedious documentation writing.
3. **Tests save time.** This might be a bit counterintuitive, since writing tests takes away time you'd spend writing your app. But then you still have to do Q&A, manual testing to make sure you didn't break something else with a change! Automated tests save so much time that would be spent manually doing Q&A and finding bugs!
4. **You will write better code.** Some code is harder to test, some easier. You'll start writing easier testable code, which automatically is better code!

With this in mind, there's no way we could not test our application! Let's get started!

## Unit testing

Unit testing is the practice of testing the smallest possible *units* of our code. In JavaScript, those are functions. We run our tests and automatically verify that our functions do the thing we expect them to do. We assert that, given a set of inputs, our functions return the proper values and handle problems.

We'll be using the <a target="_blank" href="https://facebook.github.io/jest/">Jest</a> test framework by facebook. It was written to help test react apps, and is perfect for that purpose! It makes writing tests as easy as speaking - you `describe` a unit of your code and `expect` `it` to do the correct thing.

Thankfully, `create-react-app` comes with it installed by default so we won't need to do any setup! Simply enter `npm run test` into your terminal to run the tests we'll write below.

> Note: You need version 0.0.3 or higher of `create-react-app` for Jest support. To check which version you have installed look into the `package.json` of the `weather-app` folder to the version next to `"react-scripts"`, and possibly update it with this command: `npm install --save-dev react-scripts@"^0.3.0 || 0.3.0-alpha"`

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

> Note: This is the <a target="_blank" href="http://facebook.github.io/jest">official documentation</a> of Jest.

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

Create a new file called `actions.test.js` in the `src/__test__ /` folder. (create that if you haven't already) Let's start by testing the good ol' `changeLocation` action. Add the default structure, we'll need to import the action we want to test and `describe` "actions" and `changeLocation`:

```JS
// actions.test.js
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

Let's showcase this on the `'CHANGE_LOCATION'` case, first create a `reducer.test.js` file in the `__test__ /` directory, import the reducer and add the basic structure:

```JS
// __test__/reducer.test.js
import mainReducer from '../reducer';

describe('mainReducer', function() {

});
```

The first branch of the switch statement we'll test is the `default` one – if we don't pass any state and an empty action in it should return the initial state. The thing is that the `initialState` is an immutable object, so we'll need to import `fromJS` too:

```JS
// __test__/reducer.test.js
import mainReducer from '../reducer';
import { fromJS } from 'immutable';

describe('mainReducer', function() {
  it('should return the initial state', function() {
    expect(mainReducer(undefined, {})).toEqual(fromJS({
			location: '',
		  data: {},
		  dates: [],
		  temps: [],
		  selected: {
		    date: '',
		    temp: null
		  }
		}));
  });
});
```

You should now see this output:

```
PASS  src/__tests__/actions.test.js (0.365s)
PASS  src/__tests__/reducer.test.js (0.215s)
13 tests passed (13 total in 2 test suites, run time 0.519s)
```

Brilliant! Let's showcase how we can test specific actions, again using our beloved `'CHANGE_LOCATION'` one.

First, add a new `it` explaining what the reducer should do:

```JS
// __test__/reducer.test.js
import mainReducer from '../reducer';
import { fromJS } from 'immutable';

describe('mainReducer', function() {
  it('should return the initial state', function() {/* … */});

  it('should react to an action with the type CHANGE_LOCATION', function() {

  });
});
```

Then, validate that the reducer changes the `location` field in the state correctly:

```JS
it('should react to an action with the type CHANGE_LOCATION', function() {
  var location = 'Vienna, Austria';
  expect(mainReducer(undefined, {
    type: 'CHANGE_LOCATION',
    location: location
  })).toEqual(fromJS({
    location: location,
    data: {},
    dates: [],
    temps: [],
    selected: {
      date: '',
      temp: null
    }
  }));
});
```

Now we know that our action returns an object with a `type` of `"CHANGE_LOCATION"` and that our reducer changes the `location` field in the state correctly in response to an object with a `type` of `"CHANGE_LOCATION"`! Brilliant!

Let's do the same thing for our `'SET_DATES'` case, first add the `it`:

```JS
// __test__/reducer.test.js
import mainReducer from '../reducer';
import { fromJS } from 'immutable';

describe('mainReducer', function() {
  it('should return the initial state', function() {/* … */});

  it('should react to an action with the type CHANGE_LOCATION', function() {/* … */});

  it('should react to an action with the type SET_DATES', function() {

  });
});
```

Then make sure our reducer acts accordingly:

```JS
it('should react to an action with the type SET_DATES', function() {
  var dates = ['2016-01-01', '2016-02-02'];
  expect(mainReducer(undefined, {
    type: 'SET_DATES',
    dates: dates
  })).toEqual(fromJS({
    location: '',
    data: {},
    dates: dates,
    temps: [],
    selected: {
      date: '',
      temp: null
    }
  }));
});
```

Not too hard, eh? That's the power of redux!

Now that we have showcased how it works with those two examples, go ahead and test the other cases too!

----

Done? This is what your terminal output should look like when running `npm run test -- --verbose`:

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

If you do not have all the 7 cases in your reducer tested, go back and try to do them all! It'll strengthen your testing muscle and help you get used to thinking this way!

When your output looks like the output above, you're done! This is what your `reducer.test.js` file should look like:

```JS
import mainReducer from '../reducer';
import { fromJS } from 'immutable';

describe('mainReducer', function() {
	it('should return the initial state', function() {
		expect(mainReducer(undefined, {})).toEqual(fromJS({
			location: '',
		  data: {},
		  dates: [],
		  temps: [],
		  selected: {
		    date: '',
		    temp: null
		  }
		}));
	});

	it("should react to an action with the type 'CHANGE_LOCATION'", function() {
		var location = 'Vienna, Austria';
		expect(mainReducer(undefined, {
			type: 'CHANGE_LOCATION',
			location: location
		})).toEqual(fromJS({
			location: location,
		  data: {},
		  dates: [],
		  temps: [],
		  selected: {
		    date: '',
		    temp: null
		  }
		}));
	});

	it("should react to an action with the type 'SET_DATA'", function() {
		var data = { some: 'data' };
		expect(mainReducer(undefined, {
			type: 'SET_DATA',
			data: data
		})).toEqual(fromJS({
			location: '',
		  data: data,
		  dates: [],
		  temps: [],
		  selected: {
		    date: '',
		    temp: null
		  }
		}));
	});

	it("should react to an action with the type 'SET_DATES'", function() {
		var dates = ['2016-01-01', '2016-02-02'];
		expect(mainReducer(undefined, {
			type: 'SET_DATES',
			dates: dates
		})).toEqual(fromJS({
			location: '',
		  data: {},
		  dates: dates,
		  temps: [],
		  selected: {
		    date: '',
		    temp: null
		  }
		}));
	});

	it("should react to an action with the type 'SET_TEMPS'", function() {
		var temps = ['31', '32'];
		expect(mainReducer(undefined, {
			type: 'SET_TEMPS',
			temps: temps
		})).toEqual(fromJS({
			location: '',
		  data: {},
		  dates: [],
		  temps: temps,
		  selected: {
		    date: '',
		    temp: null
		  }
		}));
	});

	it("should react to an action with the type 'SET_SELECTED_DATE'", function() {
		var date = '2016-02-01'
		expect(mainReducer(undefined, {
			type: 'SET_SELECTED_DATE',
			date: date
		})).toEqual(fromJS({
			location: '',
		  data: {},
		  dates: [],
		  temps: [],
		  selected: {
		    date: date,
		    temp: null
		  }
		}));
	});

	it("should react to an action with the type 'SET_SELECTED_TEMP'", function() {
		var temp = '31';
		expect(mainReducer(undefined, {
			type: 'SET_SELECTED_TEMP',
			temp: temp
		})).toEqual(fromJS({
			location: '',
		  data: {},
		  dates: [],
		  temps: [],
		  selected: {
		    date: '',
		    temp: temp
		  }
		}));
	});
});
```

Onwards to testing our components!

## Component Testing

When testing our components, the one thing we want to verify is that they render the same output as last time the test was ran. Since they are bound to change very often, more specific tests are more of a burden than a help. If the test fails, but we've manually verified the new output is correct we should be able to quickly tell that to our testing framework without much effort.

Exactly for that purpose, Jest recently added support for **component snapshots**. Component snapshots are generated on the first test run and saved in files in your project. They should be checked into version control if you have one, and code reviews should include them.

By having those snapshots after the first test run, we can immediately verify if our component output was changed. If any change happened and we manually verified the new version is correct we can run `jest -u` to update the existing snapshots!

### Setup

To render the components without opening a browser we'll have to install the `react-test-renderer`. It allows us to render the component to a JSON object!

```
npm install --save-dev react-test-renderer
```

Let's create a new file and add the basic testing code. We'll be starting with the App component, so `import` that for now:

```JS
// __tests__/components.test.js

import React from 'react';
import renderer from 'react-test-renderer';
import App from '../App';

describe('components', function() {
  describe('<App />', function() {

  });
});
```

The thing we want to verify in our `App` component is that it renders without throwing an error and taking a snapshot so we know when the output changes. Let's add an `it` to that effect:

```JS
// __tests__/components.test.js

import React from 'react';
import renderer from 'react-test-renderer';
import App from '../App';

describe('components', function() {
  describe('<App />', function() {
    it('renders correctly', function() {

    });
  });
});
```

Let's now create a renderer, render our `<App />` component to JSON and expect that to match the snapshot:

```JS
// __tests__/components.test.js

import React from 'react';
import renderer from 'react-test-renderer';
import App from '../App';

describe('components', function() {
  describe('<App />', function() {
    it('renders correctly', function() {
      var tree = renderer.create(<App />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
```

Try running this though, and you'll get this error:

```
- Invariant Violation: Could not find "store" in either the context or props of "Connect(App)". Either wrap the root component in a <Provider>, or explicitly pass "store" as a prop to "Connect(App)".
```

Ugh, what's this now? Couldn't find `store`? What?

Remember what we export from the `App.js` file? The `react-redux` `connect`ed component! What we want to test though is the actual component itself, so we'll have to export that too:

```JS
// App.js

/* … */

export class App extends React.Component {/* … */}

/* … */

export default connect(mapStateToProps)(App);
```

Awesome! Now we need to change the `import` in our test file to reference that new export and everything should work, right?

```JS
// __tests__/components.test.js

import { App } from '../App';

/* … */
```

Well, no, but we're getting a different error now! That's a good sign!

```
- TypeError: Cannot read property 'getIn' of undefined
```

Remember what `getIn` is used for? ImmutableJS! If you take a look into the component, it expects its `redux` prop to be an ImmutableJS data structure. At the moment, we aren't passing anything in as a prop so the `getIn` function is undefined.

We can fix that very easily by `import`ing `fromJS` and passing our `<App />` an empty prop of `redux`:

```JS
import React from 'react';
import renderer from 'react-test-renderer';
import { fromJS } from 'immutable';
import { App } from '../App';

describe('components', function() {
	describe('<App />', function() {
		it('renders correctly', function() {
			var tree = renderer.create(<App redux={fromJS({})} />).toJSON();
		  expect(tree).toMatchSnapshot();
		});
	});
});
```

Awesome, this totally works! When you now run your tests you'll see a new directory inside the `__tests__` directory called `__snapshots__`. It should contain a single file called `components.test.js` that has an export for our `App` component and some HTML as a string.

```JS
// __tests__/__snapshots__/components.test.js

exports[`components <App /> renders correctly 1`] = `
<div>
  <h1>
    Weather
  </h1>
  <form
    onSubmit={[Function anonymous]}>
    <label>
      I want to know the weather for
      <input
        onChange={[Function anonymous]}
        placeholder="City, Country"
        type="text"
        value={undefined} />
    </label>
  </form>
</div>
`;
```

Now try changing the text in the App component from "I want to know the weather for" to "I want to know todays weather for" and run `npm run test` again.

This is the output you should see:

```
PASS  src/__tests__/actions.test.js (0.487s)
PASS  src/__tests__/reducer.test.js (0.58s)
FAIL  src/__tests__/components.test.js (1.042s)
● components › <App /> › it renders correctly
 - expected value to match snapshot 1
   - expected + actual

     <div>
       <h1>
         Weather
       </h1>
       <form
         onSubmit={[Function anonymous]}>
         <label>
   -       I want to know the weather for
   +       I want to know todays weather for
           <input
             onChange={[Function anonymous]}
             placeholder="City, Country"
             type="text"
             value={undefined} />
         </label>
       </form>
     </div>

       at Object.<anonymous> (src/__tests__/components.test.js:10:17)

Snapshot Summary
› 1 snapshot test failed in 1 test file. Inspect your code changes or run with `npm test -- -u` to update them.

snapshot failure, 1 test failed, 19 tests passed (20 total in 3 test suites, run time 1.347s)
```

Awesome, Jest caught the changes in the output of our App component and immediately notified us of a potential error! If we wanted to make this the correct text, all we would have to do is run `npm run -- -u` (`-u` stands for "update snapshots") and Jest would recognize this output as the correct one!

Let's try to do the same thing for our `Plot`. First, import it and add the testing structure:

```JS
import Plot from '../Plot.js';

describe('components', function() {
  describe('<App />', function() {/* … */});

  describe('<Plot />', function() {
    it('renders correctly', function() {

    });
  });
});
```

> We don't need to export the Plot separately here since this isn't `connect`ed anyway!

Now try adding a first snapshot:

```JS
import Plot from '../Plot.js';

describe('components', function() {
  describe('<App />', function() {/* … */});

  describe('<Plot />', function() {
    it('renders correctly', function() {
      const tree = renderer.create(<Plot />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
```

Run `npm run test` and you'll see this error: `"ReferenceError: Plotly is not defined"`. We use `Plotly.newPlot` in the `drawPlot` method, so at least we know that's being ran!

We need to pretend to Jest that `Plotly` exists for our component. We do this by adding a new field to the `global` variable which the `Plot` component will try to get `Plotly` from:

```JS
import Plot from '../Plot.js';

describe('components', function() {
  describe('<App />', function() {/* … */});

  describe('<Plot />', function() {
    global.Plotly = {
      newPlot: () => {}
    };
    it('renders correctly', function() {
      const tree = renderer.create(<Plot />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
```

Now that that's "defined" (at least we pretend like it is), let's try running `npm run test` again! Another error, this time saying `"TypeError: Cannot read property 'toJS' of undefined"`?

Wait, didn't we have a similar error before? Exactly, this is an ImmutableJS problem again! Our `Plot` expects two immutable data structures to be passed in as `xData` and `yData`. Soo, let's do that? We have `fromJS` already imported from before, so we just add those as props:

```JS
import Plot from '../Plot.js';

describe('components', function() {
  describe('<App />', function() {/* … */});

  describe('<Plot />', function() {
    global.Plotly = {
      newPlot: () => {}
    };
    it('renders correctly', function() {
      const tree = renderer.create(<Plot xData={fromJS({})} yData={fromJS({})} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
```

Nothing fancy, let's see what happens now! Ugh, _another_ error saying `"ReferenceError: document is not defined"`. How many more errors will we get??

As a short aside, this is what happens when you integrate general JS libraries with React. The nice thing is, React is just JavaScript so contrary to some other frameworks it's possible! That doesn't mean it's easy though, but we're almost through it!

Let's get on with it, since the `react-test-renderer` renders the components in a non-browser context (the command line) we need to tell Jest that the `document` variable we use for `document.getElementById('...').on('...')` isn't undefined for us!

We do this again like `Plotly` above by attaching a new property to `global`:

```JS
import Plot from '../Plot.js';

describe('components', function() {
  describe('<App />', function() {/* … */});

  describe('<Plot />', function() {
    global.Plotly = {
      newPlot: () => {}
    };
    global.document = {
      getElementById: function() { return {
        on: function() {}
      }}
    };
    it('renders correctly', function() {
      const tree = renderer.create(<Plot xData={fromJS({})} yData={fromJS({})} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
```

Now when you run this, what do you see?!

```
 PASS  src/__tests__/actions.test.js (0.528s)
 PASS  src/__tests__/reducer.test.js (0.623s)
 PASS  src/__tests__/components.test.js (0.947s)

Snapshot Summary
› 1 snapshot written in 1 test file.

21 tests passed (21 total in 3 test suites, 2 snapshots, run time 1.242s)
```

Yesss!!! 🎉 We have now successfully tested our entire application, whenever something breaks we now immediately know!

## Outro

Congratulations, you've now built your first real-world React application!!!

We've gone over a lot, starting off with learning the basics of React, integrating a standard JavaScript library with it, fetching and managing data from an API, managing state with Redux and ImmutableJS all the way to testing our entire app!

This is everything you need to know to get started building your own app with React. Go out there and create amazing things!

<!-- Syntax highlighting -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.5.1/prism.min.js"></script>
<!-- /Syntax highlighting -->
