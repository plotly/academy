---
title: Introduction to React.js
description: Learn the basics of React, one of the most popular JavaScript frameworks out there. It's used by companies large and small including Instagram, Netflix, Airbnb and many more!
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

It also popularised building apps with encapsulated, reusable and composable components. It's a different way of thinking and of going about building webapps, but once you're used to it you can never go back!

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

We'll use <a target="_blank" href="https://react.jsbin.com/sewaru/11/edit?js,output"><code>react.jsbin.com</code></a> for the initial explanation, which has a fully featured React environment set up. With this, you can quickly experiment and get a feel for React.

React consists of two libraries, `React` and `ReactDOM`. `React` allows you to create elements, which we render with `ReactDOM`. They are split because you could (theoretically) render those ReactElements anywhere, not only to the browser DOM.

> For example, there are initial experiments out there for rendering React to Canvas, WebVR and even hardware!

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

Now you might think creating a `ReactDOM.render()` function for every ReactElement you have is the way to go. That's not a very good idea – it empties the DOM node we use as an entry point. How do we render multiple ReactElements then? Let's take a look at the `React.createElement()` function to figure it out!

### `React.createElement()`

This function takes the node (or ReactElement) we want to create as the first argument and some properties (like `type`) in an object as the second argument:

```JS
React.createElement('input');
// -> <input></input>
React.createElement('input', { type: 'radio' });
// -> <input type="radio"></input>
React.createElement('input', { className: 'heading', type: 'radio' });
// -> <input class="heading" type="radio"></input>
```

> Notice how the HTML `class` attribute has to be set via `className` property in react. This is because `class` is a reserved keyword in JavaScript, which means we might introduce unwanted problems into our apps by passing in `class`. React mitigates this by using the `className` property instead of `class`!

We can also (optionally) pass children as the third argument! The simplest usecase here is to render a bit of text:

```JS
React.createElement('h1', null, 'Hello World');
// -> <h1>Hello World</h1>
```

The children (above: `'Hello World'`) can also be another ReactElement! Let's say we want to add a `<div class="wrapper">` around our heading. We use `React.createElement` to render a `div` with a `className` of `'wrapper'`, and then pass our heading in as the child:

```JS
React.createElement('div', { className: 'wrapper' },
  React.createElement('h1', null, 'Hello World')
)
```

This will render this HTML:

```HTML
<div class="wrapper">
  <h1>Hello World</h1>
</div>
```

<em>(<a target="_blank" href="https://react.jsbin.com/sewaru/7/edit?js,output">JSBin</a>)</em>

This `.wrapper` div might have a `max-width` and other styling associated with it. By reusing this element, we make sure our application is consistent since it has the same styling everywhere! This is what _components_ are for.

### Components

To create a `ReactComponent` we write a function that returns a `ReactElement`:

```JS
var Wrapper = function(props) {
  return React.createElement('div', { className: 'wrapper' });
}
```

We can then use these components like any DOM Node by passing it into a `createElement` call:

```JS
React.createElement(Wrapper);
// -> <div class="wrapper"></div>
```

Our wrapper component isn't very useful so far, since it doesn't render its children:

```JS
React.createElement(Wrapper, {}, 'Hello World!');
// -> <div class="wrapper"></div> (😢 no "Hello World" visible!)
```

This is because our component function gets passed the properties (`props`). In the last example we didn't use the properties we got passed from the `createElement(Wrapper)` call at all!

Let's render the children that our `Wrapper` gets passed:

```JS
var Wrapper = function(props) {
  // Render the children we get passed from the createElement(Wrapper) call
  return React.createElement('div', { className: 'wrapper' }, props.children);
}
```

Now the above example works perfectly:

```JS
React.createElement(Wrapper, {}, 'Hello World!');
// -> <div class="wrapper">Hello World</div>
```

Let's try rendering our heading inside our `Wrapper` component:

```JS
React.createElement(Wrapper, null,
  React.createElement('h1', null, 'Hello World')
)
// -> <div class="wrapper"><h1>Hello World</h1></div>
```
<em>(<a target="_blank" href="https://react.jsbin.com/sewaru/8/edit?js,output">JSBin</a>)</em>

Amazing! 🎉 Now we have a reusable `Wrapper` component that could make sure every page across our application has consistent styling.

### JSX

You might have seen React code samples floating around, and something that might've struck you is the weird HTML-ish syntax in the JavaScript code that is used by most of the community.

This syntactic sugar is called "JSX", and is nothing but a wrapper for `React.createElement`!

Instead of calling `React.createElement` manually, we can use JSX to make the code look more like the rendered HTML:

```HTML
<Wrapper>
  <h1 className="heading">Hello World</h1>
</Wrapper>
```

is the same thing as

```JS
React.createElement(Wrapper, null,
  React.createElement('h1', {className: 'heading'}, 'Hello World')
)
```

> Using JSX is a bit tricky: since it's a non-standard extension of JavaScript no browser will understand it. This means we have to *transpile* (compile JavaScript to JavaScript) our code with a build tool – thankfully, `react.jsbin.com` does that automatically for us, so we don't have to worry about it.

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

It's not that different from calling `createElement` manually, but JSX is much nicer to read and understand!

> JSX is the preferred way of writing react applications because it is easier to read and understand. Thus, this tutorial will from now on use JSX.

### Classes

As mentioned in the "Why React?" section, React has the virtual DOM to minimize rerendering when the application state changes. But what is application state and how do we manage it in React?

Any real world application will have _state_. State can be anything and everything, ranging from "this checkbox is checked" over "that modal is open" to "this data was fetched".

As a simple example of state, let's create a `Counter` component that counts how often we've clicked a button! Our `Wrapper` component above was written as a *functional component*. To create _stateful_ components, we have to use a slightly different notation to create components – the `class` notation!

To create a stateful component, we create a new `class` that extends `React.Component`. (`React.Component` is a base we can build upon that React provides for us) We assign it a `render` method from which we return our `ReactElements`, not unlike the functional component:

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

Now let's increase a number every time a user clicks on our `Button` by using an `onClick` handler:

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

Here we need to differentiate between react components and real DOM nodes. Event handlers, like `onClick`, `onMouseOver`, etc., only work when they are attached to a real DOM node. The above example doesn't work, because we're only attaching it to a `ReactComponent`. You can click the `Button` however much you like, you will never see `"click!"` in the console!

To make this work, we have to attach the `onCLick` handler to the native DOM `button` node inside the `Button` component:

```JS
var Button = function(props) {
  return (
    <button onClick={props.onClick}>{ props.text }</button>
  );
}
```

<em>(<a target="_blank" href="http://react.jsbin.com/welihac/1/edit?js,output">JSBin</a>)</em>

Yey, this works!

We don't actually want to log "click!" every time we click the button though – we want to count the times it has been clicked! To do that, we have to add state to our `Counter` component. State is a plain object in react, which can have as little or as many properties as you like! Out state will have a `clicks` property, which initially is zero and increments by one with each click.

The first thing we need to do is set the initial state. Classes have a `constructor` that is called when the class is first initialised, which we can use to assign the initial state to our component:

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

That alone won't do anything though, we don't see that number anywhere on the page! (<a target="_blank" href="https://react.jsbin.com/xeroja/1/edit?js,output">JSBin</a>) To access the current state of our component anywhere within our component we access `this.state`. Let's render the current number of clicks as text for a start:

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

The problem here is that `this` is undefined in `increment` because of the way ES6 `class`es work – the easiest way to fix this is to `bind` the context of `increment` to the class in the constructor like so:

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

Now that we understand React we know everything we need to know to get started with building our app. Continue with <a href="/react/2-first-app/">Chapter 2: "The first app"</a>!

## Additional material

> This section at the end of each chapter will contain a few more links to articles of related topics.

- <a target="_blank" href="https://facebook.github.io/react/">Official React Docs</a>
- <a target="_blank" href="https://facebook.github.io/react/docs/jsx-in-depth.html">JSX in depth</a>
- <a target="_blank" href="https://medium.com/javascript-scene/jsx-looks-like-an-abomination-1c1ec351a918#.2fvbsips2">JSX Looks Like An Abomination, But it’s Good for You</a>

<!-- Syntax highlighting -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.5.1/prism.min.js"></script>
<!-- /Syntax highlighting -->
