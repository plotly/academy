---
title: Introduction
description: Learn the basics of the tools we use to build web apps
layout: post
---

# What we'll build (app preview)

# Prerequisites

## Node

TK

## `npm`

TK

# Why React.js?

The big benefits of React are performance and reusability.

## Performance

Normally, when your application state changes and some part of the page has to render again, the entire page renders. This is a huge performance problem for bigger applications. React circumvents with its "virtual DOM".

The virtual DOM is a virtual representation of the browsers DOM. When the state changes, React calculates a virtual DOM with the new state and compares it with the virtual representation of the currently rendered DOM. If something changed, React renders the changes – only the changes. This means we no longer rerender the entire page for the tiniest changes, instead we only render the parts we need to.

## Reusability

React calls the smallest parts of your application "elements", which compose together into "components". These components are encapsulated parts, e.g. a `Button` component, which combine together to make the page.

# Getting Started

We'll use [`react.jsbin.com`](https://react.jsbin.com/sewaru/11/edit?js,output) for the initial explanation, which has a fully featured React environment set up. With this, you can quickly experiment and get a feel for `React.js`.

React consists of two libraries, `React` and `ReactDOM`. `React` allows you to create elements, which we render with `ReactDOM`. They are split because you could (theoretically) render those ReactElements anywhere, not only to the browser DOM.

> Note: There are initial experiments out there for rendering React to HTML5 Canvas, WebVR and some others.

Open up our [first JSBin](https://react.jsbin.com/sewaru/11/edit?js,output), and you will see an `<h1>` with the text "Hello World". This is the source code generating that text:

```JS
ReactDOM.render(
  React.createElement('h1', {className: 'heading'}, 'Hello World'),
  document.getElementById('container')
);
```

We use the `ReactDOM.render()` function to render a ReactElement created with the `React.createElement()` function.

## `ReactDOM.render()`

The `ReactDOM.render()` function takes two arguments: The ReactElement to render, and the DOM node we want to render into. (the "entry point")

```JS
ReactDOM.render(
  React.createElement('h1', {className: 'heading'}, 'Hello World'),
  document.getElementById('container')
);
```

Now you might think creating a `ReactDOM.render()` function for every ReactElement you have is the way to go. That's not a very good idea – it empties the DOM node we use as an entry point. How do we render multiple ReactElements then? To find that out we have to examine the `React.createElement()` function.

## `React.createElement()`

This function takes the node (or ReactElement, as we'll see soon) we want to create as the first argument, some properties (like `className`) in an object as the second argument and the elements "children" as the third argument.

```JS
// <h1></h1>
React.createElement('h1');
// <h1 class="heading"></h1>
React.createElement('h1', { className: 'heading' });
// <h1 class="heading">Hello World</h1>
React.createElement('h1', {className: 'heading'}, 'Hello World');
```

The children (the third argument), where it now says `'Hello World'`, can also be another ReactElement! Lets say we want to add a `<div>` with a `wrapper` class around our heading, we could pass our heading element to another element as a child:

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

*([JSBin](https://react.jsbin.com/sewaru/7/edit?css,js,output))*

This `.wrapper` div might have a `max-width` and other styling associated with it, and we might want to reuse it someplace else. Doing this makes our application consistent across all pages, since we use the same element everywhere! In React, this is easily doable by creating components.

## Components

To create a new `ReactComponent`, we make a new function that returns our `ReactElement`. That function gets passed the properties we give it when creating an element from it, plus a few extras. One of those extras is `children`, which is an array of all children.

Our `Wrapper` component thus looks like this:

```JS
var Wrapper = function(props) {
  return (
    React.createElement('div', { className: 'wrapper' }, props.children)
  );
};
```

By using `props.children` as the third argument, this component will render it's children! We simply pass it to `createElement` as the first argument without passing any special properties, and our heading as the child:

```JS
React.createElement(Wrapper, null,
  React.createElement('h1', {className: 'heading'}, 'Hello World')
)
```
*([JSBin](https://react.jsbin.com/sewaru/8/edit?js,output))*

Now we can reuse our `Wrapper` component across our application and have consistent styling!

## JSX

You might have seen React code samples floating around, and something that might've struck you is the weird HTML-ish syntax in the JavaScript code that is used by most of the community. This syntactic sugar is called "JSX", and is nothing but a wrapper for `React.createElement`.

Instead of calling `React.createElement`, we can use JSX:

```JS
React.createElement(Wrapper, null,
  React.createElement('h1', {className: 'heading'}, 'Hello World')
)
```

is the same thing as

```HTML
<Wrapper>
  <h1 className="heading">Hello World</h1>
</Wrapper>
```

Using JSX is a bit tricky, since it's a non-standard extension of JavaScript no browser will understand it. This means we have to *transpile* our code with a build tool – thankfully, `react.jsbin.com` does that for us automatically, so we don't have to worry about that for now. Simply write JSX in there and it's going to work!

Passing properties to our components is as easy as writing them as attributes on these HTML-like tags, and to add children we simply wrap them! The nice thing about JSX is that we can use JavaScript code in JSX by wrapping it in curly braces.

Lets convert our `Wrapper` component to use JSX:

```JS
var Wrapper = function(props) {
  return (
    <div className="wrapper">{ props.children }</div>
  );
};
```

*([JSBin](https://react.jsbin.com/sewaru/10/edit?js,output))*

> JSX is the preferred way of writing react applications because it is easier to read and understand. Thus, this tutorial will from now on use JSX.

## `React.createClass()`

As mentioned in the "Why React?" section, React has the virtual DOM to minimize rerendering when the application state changes. But, how do we manage application state in React?

Above we had our `Wrapper` component, which was written as a *functional component*. We can also write our React components in a slightly different way so we can make it stateful. Let's write a `Counter` component that counts how often we've clicked a button!

React exports a separate function which we can use to create components which is `React.createClass()`. This function takes an object as its first argument, and we can pass it a `render` property, like so:

```JS
var Counter = React.createClass({
  render: function() { /* component here */ }
});
```

This render function doesn't work any differently from the functional component we have seen before, we simply return some elements in there and they will be rendered:

```JS
var Counter = React.createClass({
  render: function() {
    return (
      <p>This is the Counter component!</p>
    );
  }
});
```

We can then render this component just like the other components with `ReactDOM.render`:

```JS
ReactDOM.render(
  <Counter />,
  document.getElementById('container')
);
```

*([JSBin](http://react.jsbin.com/xitatudiyo/1/edit?js,output))*

Lets make a separate `Button` component, which'll take a prop called `text`. We'll make this component a functional one again, since it won't need to store any state:

```JS
var Button = function(props) {
  return (
    <button>{ props.text }</button>
  );
}
```

Then we render our `Button` into our `Counter` with a text of `Click me!`:

```JS
var Counter = React.createClass({
  render: function() {
    return (
      <div>
        <p>This is the Counter component!</p>
        <Button text="Click me!"/>
      </div>
    );
  }
});
```

*([JSBin](http://react.jsbin.com/xokunazoku/1/edit?js,output))*

Now lets increase a number everytime out `Button` is clicked by using an `onClick` handler:

```JS
var Counter = React.createClass({
  render: function() {
    return (
      <div>
        <p>This is the Counter component!</p>
        <Button text="Click me!" onClick={function() { console.log('click!') }} />
      </div>
    );
  }
});
```

With only that code though, you can click the `Button` however much you like and you will never see `click!` in the console. That is because right now, we specified the `onClick` prop on a ReactComponent. To use this in the browser DOM, we have to attach it to the native DOM `button` node inside the React component:

```JS
var Button = function(props) {
  return (
    <button onClick={props.onClick}>{ props.text }</button>
  );
}
```

*([JSBin](http://react.jsbin.com/xokunazoku/2/edit?js,output))*

This works, but we don't actually want to log "click!" every time we click the button – we want to count the times it has been clicked! To do that, we have to add state to our `Counter` component. That state will have a `clicks` property, which initially is zero and increments by one with each click.

The first thing we need to do is set the initial state. `React.createClass` lets us pass a `getInitialState` function to our component where we return an object which'll be the initial state:

```JS
var Counter = React.createClass({
  getInitialState: function() {
    return {
      clicks: 0
    };
  },
  render: function() { /* ... */ }
});
```

That alone won't do anything though, we don't see that number anywhere on the page! ([JSBin](react.jsbin.com/tovekeqoto/1/edit?js,output)) To access the current state of the component we use `this.state`. Lets add that to our `render` method:

```JS
var Counter = React.createClass({
  getInitialState: function() { /* ... */ },
  render: function() {
    return (
      <div>
        <p>This is the Counter component! The button was clicked { this.state.clicks } times.</p>
        <Button text="Click me!" onClick={function() { console.log('click!') }} />
      </div>
    );
  }
});
```

*([JSBin](react.jsbin.com/tovekeqoto/2/edit?js,output))*

> The `{ }` notation in JSX works with any variable.
> `var favoriteFood = 'Pizza';` in combination with `I love { favoriteFood }!` will output "I love Pizza!"!

Our `Counter` now looks like this, but clicking on the button doesn't increment the click count!

![A counter with 0 clicks](https://i.imgur.com/zadL82o.jpg)

To change the state of a component, we use the `this.setState` helper function which React provides. Lets add a `increment` method to our `Counter`, which increments the `clicks` state by one, and call `this.increment` when our `Button` is clicked!

```JS
var Counter = React.createClass({
  getInitialState: function() { /* ... */ },
  increment: function() {
    this.setState({
      clicks: this.state.clicks + 1
    });
  },
  render: function() {
    return (
      <div>
        <p>This is the Counter component! The button was clicked { this.state.clicks } times.</p>
        <Button text="Click me!" onClick={this.increment} />
      </div>
    );
  }
});
```

*([JSBin](http://react.jsbin.com/qebenenozo/1/edit?js,output))*

Now it works, our `Counter` correctly increments the number when the button is clicked!

## Modules

Real world applications can have any number of components, ranging from a handful to thousands. Having all of them in a single file is impractical, so we structure them into **modules**. This allows us to keep our applications well structured and easy to work with.

Lets say we want to have a `add` function, that adds two numbers together. We write this function into its own file, `add.js`:

```JS
// add.js

function add(x, y) {
  return x + y;
}
```

If we have all our functions in one file, reusing this function is no problem. By having this function in its own file, we can only use it that one file! To change that, we export this function using `module.exports`:

```JS
// add.js

function add(x, y) {
  return x + y;
}

module.exports = add;
```

To use this function in a separate file, we `require()` it, referencing the file name:

```JS
// someotherfile.js

var add = require('./add.js');

console.log(add(2, 2)); // => 4
```

Now, before you go ahead and try it, this won't work! We need special tools to take advantage of this feature. These build tools compile our possibly thousands of modules in different files into one file so we can use them in the browser. One of the most popular build tools to do this is Browserify.

### Browserify

First, we have to install Browserify. Open your terminal and enter this command:

```sh
$ npm install -g browserify
```

Now you have access to the `browserify` command! (Try entering `$ browserify` in the terminal, and you should see a help message!) To try it out, create a new file called `log.js`, and fill it with this content:

```JS
// log.js

function log(message) {
  console.log(message);
}

module.exports = log;
```

This is a simple function called `log()`, that will log a message to the console. Now create a second file called `main.js`, and fill it with this content:

```JS
// main.js

var log = require('./log.js');

log('Hello World!');
```

And as a third step, add an `index.html` file with this content:

```HTML
<!doctype html>
<head></head>
<body>
  <script src="./main.js" />
</body>
```

If you try opening the `index.html` file in your browser now, you'll see an error in your console saying something like "require is undefined". This is because we haven't transpiled our JavaScript files with Browserify yet – lets do that! Run this command in your terminal:

```sh
$ browserify main.js -o bundle.js
```

This is telling browserify to transpile the `main.js` file and all modules found within, and to generate an output file called `bundle.js`. Lets edit our `index.html` and reference that transpiled bundle instead of our `main.js`!

```HTML
<!doctype html>
<head></head>
<body>
  <script src="./bundle.js" />
</body>
```

When you open this file in your browser now, you should see a message in the console saying "Hello World!". Congratulations, you just used your first build tool!

#### Watchify

### Node Modules

TK

## Babel

TK

# Summary of this chapter

TK
