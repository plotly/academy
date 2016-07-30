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

 

### Actions

### Reducer

That's why Redux is awesome

## React

<!-- Syntax highlighting -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.5.1/prism.min.js"></script>
<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.5.1/themes/prism.min.css">
<!-- /Syntax highlighting -->
