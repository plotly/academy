---
title: Introduction to React.js
description: Learn the basics of the tools we'll use to build our app
layout: post
author:
  name: Max Stoiber
  avatar: http://mxstbr.com/headshot.jpeg
  twitter: "@mxstbr"
  bio: Max is the creator of <a href="https://github.com/mxstbr/react-boilerplate">react-boilerplate</a>, one of the most popular react starter kits, the co-creator of <a href="https://github.com/carteb/carte-blanche">Carte Blanche</a> and he co-organises the React.js Vienna Meetup. He works as an Open Source Developer at <a href="http://thinkmill.com.au">Thinkmill</a>, where he takes care of <a href="http://keystonejs.com">KeystoneJS</a>.
---

## Why React.js?

React, to quote Facebook themselves, was built to solve one problem: "building large applications with data that changes over time". (that's why Instagram and Facebook are built with it)

With React, it's simple to express how your app should look at any given point in time. It will figure out which parts need to update when the data changes for you, and will only render those.

It also popularized building apps with encapsulated, reusable and composable components. It's a different way of thinking and of going about building webapps, but once you're used to it you can never go back!

## What we'll build

This is the app we'll be building in this tutorial series (yes, this is a live example! Click around and explore):

<div class="post__example post__example--full-width">
  <div class="post__example-bar">
    <div class="post__example-controls"></div>
  </div>
  <div class="post__example-content">
    <iframe class="preview-iframe-DO-NOT-APPLY-THIS-CLASS-ANYWHERE-ELSE" src="http://blog.mxstbr.com/weather-app/"></iframe>
  </div>
</div>

*You can also see this example in your own browser at <a target="_blank" href="http://blog.mxstbr.com/weather-app">blog.mxstbr.com/weather-app</a>*

<style>
.preview-iframe-DO-NOT-APPLY-THIS-CLASS-ANYWHERE-ELSE {
  width: 100%;
  border: none;
  height: 98.4%;
  margin: 0;
}
</style>

In this first chapter of the tutorial we'll go through the React basics, before starting to build the above app in chapter two. If you feel comfortable with React and JSX feel free to [skip ahead](/react/2-first-app/) but **I highly recommend going through this chapter to make sure you know React**!

## Getting Started

We'll use <a target="_blank" href="https://react.jsbin.com/sewaru/11/edit?js,output"><code>react.jsbin.com</code></a> for the initial explanation, which has a fully featured React environment set up. With this, you can quickly experiment and get a feel for `React.js`.

React consists of two libraries, `React` and `ReactDOM`. `React` allows you to create elements, which we render with `ReactDOM`. They are split because you could (theoretically) render those ReactElements anywhere, not only to the browser DOM.

> Note: There are initial experiments out there for rendering React to HTML5 Canvas, WebVR and some others.

Open up our <a target="_blank" href="https://react.jsbin.com/sewaru/11/edit?js,output">first JSBin</a>, and you will see an `<h1>` with the text "Hello World". This is the source code generating that text:

```JS
ReactDOM.render(
  React.createElement('h1', {className: 'heading'}, 'Hello World'),
  document.getElementById('container')
);
```

We use the `ReactDOM.render()` function to render a ReactElement created with the `React.createElement()` function.

### `ReactDOM.render()`

The `ReactDOM.render()` function takes two arguments: The ReactElement to render, and the DOM node we want to render into. (the "entry point")

```JS
ReactDOM.render(
  React.createElement('h1', {className: 'heading'}, 'Hello World'),
  document.getElementById('container')
);
```

Now you might think creating a `ReactDOM.render()` function for every ReactElement you have is the way to go. That's not a very good idea – it empties the DOM node we use as an entry point. How do we render multiple ReactElements then? To find that out we have to examine the `React.createElement()` function.

### `React.createElement()`

This function takes the node (or ReactElement, as we'll see soon) we want to create as the first argument, some properties (like `className`) in an object as the second argument and the element's "children" as the third argument.

```JS
// <h1></h1>
React.createElement('h1');
// <h1 class="heading"></h1>
React.createElement('h1', { className: 'heading' });
// <h1 class="heading">Hello World</h1>
React.createElement('h1', {className: 'heading'}, 'Hello World');
```

The children (the third argument), where it now says `'Hello World'`, can also be another ReactElement! Let's say we want to add a `<div>` with a `wrapper` class around our heading, we could pass our heading element to another element as a child:

```JS
React.createElement('div', { className: 'wrapper' },
  React.createElement('h1', {className: 'heading'}, 'Hello World')
)
```

which'll render this HTML:

```HTML
<div class="wrapper">
  <h1 class="heading">Hello World</h1>
</div>
```

<em>(<a target="_blank" href="https://react.jsbin.com/sewaru/7/edit?js,output">JSBin</a>)</em>

This `.wrapper` div might have a `max-width` and other styling associated with it, and we might want to reuse it someplace else. Doing this makes our application consistent across all pages, since we use the same element everywhere! In React, this is easily doable by creating components.

### Components

To create a new `ReactComponent`, we make a new function that returns our `ReactElement`. That function gets passed the properties we give it when creating an element from it, plus a few extras. One of those extras is `children`, which is an array of all children.

Our `Wrapper` component thus looks like this:

```JS
var Wrapper = function(props) {
  return (
    React.createElement('div', { className: 'wrapper' }, props.children)
  );
};
```

By using `props.children` as the third argument, this component will render its children! We simply pass it to `createElement` as the first argument without passing any special properties, and our heading as the child:

```JS
React.createElement(Wrapper, null,
  React.createElement('h1', {className: 'heading'}, 'Hello World')
)
```
<em>(<a target="_blank" href="https://react.jsbin.com/sewaru/8/edit?js,output">JSBin</a>)</em>

Now we can reuse our `Wrapper` component across our application and have consistent styling!

### JSX

You might have seen React code samples floating around, and something that might've struck you is the weird HTML-ish syntax in the JavaScript code that is used by most of the community. This syntactic sugar is called "JSX", and is nothing but a wrapper for `React.createElement`.

Instead of calling `React.createElement`, we can use JSX:

```HTML
<Wrapper>
  <h1 className="heading">Hello World</h1>
</Wrapper>
```

which is the same thing as

```JS
React.createElement(Wrapper, null,
  React.createElement('h1', {className: 'heading'}, 'Hello World')
)
```

Using JSX is a bit tricky, since it's a non-standard extension of JavaScript no browser will understand it. This means we have to *transpile* our code with a build tool – thankfully, `react.jsbin.com` does that for us automatically, so we don't have to worry about that for now. Simply write JSX in there and it's going to work!

Passing properties to our components is as easy as writing them as attributes on these HTML-like tags, and to add children we simply wrap them! The nice thing about JSX is that we can use JavaScript code in JSX by wrapping it in curly braces.

Let's convert our `Wrapper` component to use JSX:

```JS
var Wrapper = function(props) {
  return (
    <div className="wrapper">{ props.children }</div>
  );
};
```

<em>(<a target="_blank" href="https://react.jsbin.com/sewaru/10/edit?js,output">JSBin</a>)</em>

> JSX is the preferred way of writing react applications because it is easier to read and understand. Thus, this tutorial will from now on use JSX.

### Classes

As mentioned in the "Why React?" section, React has the virtual DOM to minimize rerendering when the application state changes. But, how do we manage application state in React?

Above we had our `Wrapper` component, which was written as a *functional component*. We can also write our React components in a slightly different way so we can make it stateful. Let's write a `Counter` component that counts how often we've clicked a button!

React exports an instance which we can use to create components which is `React.Component`. We create a new `class` that extends `React.Component` and we can pass it a `render` function, like so:

```JS
class Counter extends React.Component {
  render() { /* component here */ }
}
```

This render function doesn't work any differently from the functional component we have seen before, we simply return some elements in there and they will be rendered:

```JS
class Counter extends React.Component {
  render() {
    return (
      <p>This is the Counter component!</p>
    );
  }
}
```

We can then render this component just like the other components with `ReactDOM.render`:

```JS
ReactDOM.render(
  <Counter />,
  document.getElementById('container')
);
```

<em>(<a target="_blank" href="http://react.jsbin.com/gakawe/1/edit?js,output">JSBin</a>)</em>

Let's make a separate `Button` component, which'll take a prop called `text`. We'll make this component a functional one again, since it won't need to store any state:

```JS
var Button = function(props) {
  return (
    <button>{ props.text }</button>
  );
}
```

Then we render our `Button` into our `Counter` with a text of `Click me!`:

```JS
class Counter extends React.Component {
  render() {
    return (
      <div>
        <p>This is the Counter component!</p>
        <Button text="Click me!"/>
      </div>
    );
  }
}
```

<em>(<a target="_blank" href="http://react.jsbin.com/dewoseb/1/edit?js,output">JSBin</a>)</em>

Now let's increase a number everytime our `Button` is clicked by using an `onClick` handler:

```JS
class Counter extends React.Component {
  render() {
    return (
      <div>
        <p>This is the Counter component!</p>
        <Button text="Click me!" onClick={function() { console.log('click!') }} />
      </div>
    );
  }
}
```

With only that code though, you can click the `Button` however much you like and you will never see `click!` in the console. That is because right now, we specified the `onClick` prop on a ReactComponent. To use this in the browser DOM, we have to attach it to the native DOM `button` node inside the React component:

```JS
var Button = function(props) {
  return (
    <button onClick={props.onClick}>{ props.text }</button>
  );
}
```

<em>(<a target="_blank" href="http://react.jsbin.com/welihac/1/edit?js,output">JSBin</a>)</em>

This works, but we don't actually want to log "click!" every time we click the button – we want to count the times it has been clicked! To do that, we have to add state to our `Counter` component. That state will have a `clicks` property, which initially is zero and increments by one with each click.

The first thing we need to do is set the initial state. Classes have a `constructor` that is called when the class is first initialized, which we can use to assign the initial state to our component:

```JS
class Counter extends React.Component {
  constructor() {
    super();
    this.state = {
      clicks: 0
    };
  }

  render() { /* ... */ }
}
```

That alone won't do anything though, we don't see that number anywhere on the page! (<a target="_blank" href="https://react.jsbin.com/xeroja/1/edit?js,output">JSBin</a>) To access the current state of the component we use `this.state`. Let's add that to our `render` method:

```JS
class Counter extends React.Component {
  constructor() {
    super();
    this.state = {
      clicks: 0
    };
  }

  render() {
    return (
      <div>
        <p>This is the Counter component! The button was clicked { this.state.clicks } times.</p>
        <Button text="Click me!" onClick={function() { console.log('click!') }} />
      </div>
    );
  }
}
```

<em>(<a target="_blank" href="https://react.jsbin.com/kakawi/1/edit?js,output">JSBin</a>)</em>

> The `{ }` notation in JSX works with any variable.
> `var favoriteFood = 'Pizza';` in combination with `I love { favoriteFood }!` will output "I love Pizza!"!

Our `Counter` now looks like this, but clicking on the button doesn't increment the click count!

![A counter with 0 clicks](https://i.imgur.com/zadL82o.jpg)

To change the state of a component, we use the `this.setState` helper function which React provides. Let's add an `increment` method to our `Counter`, which increments the `clicks` state by one, and call `this.increment` when our `Button` is clicked!

```JS
class Counter extends React.Component {
  constructor() {
    super();
    this.state = {
      clicks: 0
    };
  }

  increment() {
    this.setState({
      clicks: this.state.clicks + 1
    });
  };

  render() {
    return (
      <div>
        <p>This is the Counter component! The button was clicked { this.state.clicks } times.</p>
        <Button text="Click me!" onClick={this.increment} />
      </div>
    );
  }
}
```

The problem here is that `this` is undefined in `increment` – the easiest way to fix this is to `bind` the context of `increment` to the class in the constructor like so:

```JS
class Counter extends React.Component {
  constructor() {
    super();
    this.state = {
      clicks: 0
    };
    this.increment = this.increment.bind(this);
  }

  increment() {
    this.setState({
      clicks: this.state.clicks + 1
    });
  };

  render() {
    return (
      <div>
        <p>This is the Counter component! The button was clicked { this.state.clicks } times.</p>
        <Button text="Click me!" onClick={this.increment} />
      </div>
    );
  }
}
```

<em>(<a target="_blank" href="https://react.jsbin.com/cuvono/1/edit?js,output">JSBin</a>)</em>

Now it works, our `Counter` correctly increments the number when the button is clicked!

### Modules

Real world applications can have any number of components, ranging from a handful to thousands. Having all of them in a single file is impractical, so we structure them into **modules**. This allows us to keep our applications well structured and easy to work with.

#### Prerequisites

##### Node

Node.js is a JavaScript runtime for your terminal. Don't worry too much about it, but it's used by some tools we'll be using to build our application. Head over to <a target="_blank" href="https://nodejs.org">nodejs.org</a>, follow the instructions there to install the latest version (v6 at the time of this writing) and you're good to go!

#### Default exports

Let's say we want to have an `add` function, that adds two numbers together. We write this function into its own file, `add.js`:

```JS
// add.js

function add(x, y) {
  return x + y;
}
```

If we have all our functions in one file, reusing this function is no problem. By having this function in its own file, we can only use it that one file! To change that, we export this function using `export default <functionname>`:

```JS
// add.js

function add(x, y) {
  return x + y;
}

export default add;
```

To use this function in a separate file, we `import` it `from` the file name:

```JS
// someotherfile.js

import add from './add.js';

console.log(add(2, 2)); // => 4
```

#### Multiple exports

Now let's say we want to add a second function called `subtract`, but we don't want to add a second file. We rename `add.js` to `maths.js`, and add our `subtract` function in there:

```JS
// maths.js

function add(x, y) {
  return x + y;
}

function subtract(x, y) {
  return x - y;
}

export default add;
```

You might be thinking "Hah, just add another `export default` and everything will be fine!", but sadly that's not the case. Every file can only have a single default export, but thankfully we can export multiple things if we just leave away the `default`:

```JS
// maths.js

function add(x, y) {
  return x + y;
}

function subtract(x, y) {
  return x - y;
}

export {
  add,
  subtract
};
```

Now we have to tell the import in our `someotherfile.js` to specifically import those two functions by again using curly braces:

```JS
// someotherfile.js

import { add, subtract } from './maths.js';

console.log(add(2, 2)); // => 4
console.log(subtract(3, 2)); // => 1
```

The import here is telling `someotherfile.js` to import the `add` and `subtract` functions from our `maths.js` file.

Now, before you go ahead and try it, this won't work! We need special tools to take advantage of this feature. These build tools compile our possibly thousands of modules in different files into one file so we can use them in the browser.

#### Browserify

First, we have to install Browserify. Open your terminal and enter this command:

```sh
npm install -g browserify
```

Now you have access to the `browserify` command! (Try entering `browserify` in the terminal, and you should see a help message!) To try it out, create a new file called `log.js`, and fill it with this content:

```JS
// log.js

function log(message) {
  console.log(message);
}

export default log;
```

This is a simple function called `log()`, that will log a message to the console. Now create a second file called `main.js`, and fill it with this content:

```JS
// main.js

import log from './log.js';

log('Hello World!');
```

And as a third step, add an `index.html` file with this content:

```HTML
<!doctype html>
<head></head>
<body>
  <script src="./main.js"></script>
</body>
```

If you try opening the `index.html` file in your browser now, you'll see an error in your console saying something like "unexpected character import". This is because we haven't transpiled our JavaScript files with Browserify yet – let's do that! Run this command in your terminal:

```sh
browserify main.js -o bundle.js
```

This is telling browserify to transpile the `main.js` file and all modules found within, and to generate an output file called `bundle.js`. Let's edit our `index.html` and reference that transpiled bundle instead of our `main.js`!

```HTML
<!doctype html>
<head></head>
<body>
  <script src="./main.js"></script>
</body>
```

When you open this file in your browser now, you should see a message in the console saying "Hello World!". Congratulations, you just used your first build tool!

There's one problem though, we don't really want to be running a command in our terminal everytime we change something in our code. The solution to this is another tool called `watchify`!

##### Watchify

Again, install `watchify` with `npm`:

```Sh
npm install -g watchify
```

Now you have access to the `watchify` command! (Try entering `watchify` in the terminal, and you should see an error message!) Watchify watches our files and reruns browserify when something changes, meaning we don't have to do it manually. Replace `browserify` in our command above with `watchify` and everything's going to work exactly as before:

```Sh
watchify main.js -o bundle.js
```

Now try changing a file and reloading the browser. You should see the changes without having to run any commands, awesome!

#### Node Modules

What we've done above when we ran the `npm install` command was that we installed a module. This means that somebody has pushed a module (just like our `add` module above!) to `npm` (Node Package Manager), which we can then install and use in our code!

This way we can use React and build our app without having to globally attach anything, a big benefit in terms of understanding what is going on!

Now that we understand React and modules we know everything we need to know to get started with building our app. Continue with <a href="/react/2-first-app/">Part 2: "The first app"</a>!

<!-- Syntax highlighting -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.5.1/prism.min.js"></script>
<!-- /Syntax highlighting -->
