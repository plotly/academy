---
title: The Basics
description: Learn the basics of React.js, how to get up and running with the hottest framework currently available
layout: post
---

# Prerequisites

## Node

## `npm`

# Getting Started

We'll use [`react.jsbin.com`](https://react.jsbin.com/sewaru/6/edit?js,output) for the initial explanation, which has a fully featured React environment set up. With this, you can quickly experiment and get a feel for `React.js`.

React consists of two libraries, `React` and `ReactDOM`. `React` allows you to create elements, which we render with `ReactDOM`. They are split because you could (theoretically) render those ReactElements anywhere, not only to the browser DOM.

> Note: There are initial experiments out there for rendering React to HTML5 Canvas, WebVR and some others.

Open up our [first JSBin](https://react.jsbin.com/sewaru/6/edit?js,output), and you will see an `<h1>` with the text "Hello World!". This is the source code generating that text:

```JS
ReactDOM.render(
  React.createElement('h1', { className: 'heading' }, 'Hello World!'),
  document.getElementById('container')
);
```

We use the `ReactDOM.render()` function to render a ReactElement created with the `React.createElement()` function.

## `ReactDOM.render()`

The `ReactDOM.render()` function takes two arguments: The ReactElement to render, and the DOM node we want to render into. (the "entry point")

```JS
ReactDOM.render(
  React.createElement('h1', { className: 'heading' }, 'Hello World!'),
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
// <h1 class="heading">Hello World!</h1>
React.createElement('h1', { className: 'heading' }, 'Hello World!');
```

The children (the third argument), where it now says `'Hello World!'`, can also be another ReactElement! Lets say we want to add a `<div>` with a `wrapper` class around our heading, we could pass our heading element to another element as a child:

```JS
React.createElement('div', { className: 'wrapper' },
  React.createElement('h1', { className: 'heading' }, 'Hello World!')
)
```

which'll render this HTML:

```HTML
<div class="wrapper">
  <h1 class="heading">Hello World!</h1>
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
  React.createElement('h1', { className: 'heading' }, 'Hello World!')
)
```
*([JSBin](https://react.jsbin.com/sewaru/8/edit?js,output))*

Now we can reuse our `Wrapper` component across our application and have consistent styling!

## JSX

You might have seen React code samples floating around, and something that might've struck you is the weird HTML-ish syntax in the JavaScript code that is used by most of the community. This syntactic sugar is called "JSX", and is nothing but a wrapper for `React.createElement`.

Instead of calling `React.createElement`, we can use JSX:

```JS
ReactDOM.render(
  React.createElement(Wrapper, null,
    React.createElement('h1', { className: 'heading' }, 'Hello World!')
  ),
  document.getElementById('container')
);
```

is the same thing as

```JS
ReactDOM.render(
  <Wrapper>
    <h1 className="heading">Hello World!</h1>
  </Wrapper>,
  document.getElementById('container')
);
```

Passing properties to our components is as easy as writing them as attributes on these HTML-like tags, and to add children we simply wrap them! The nice thing about JSX is, since it is transpiled to JavaScript, we can use JavaScript code in JSX by wrapping it in curly braces.

Lets convert our `Wrapper` component to use JSX:

```JS
var Wrapper = function(props) {
  return (
    <div className="wrapper">{ props.children }</div>
  );
};
```

*([JSBin](https://react.jsbin.com/sewaru/10/edit?js,output))*

## Modules

### Browserify
