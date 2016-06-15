---
title: Redux
description: Properly handling application state
layout: post
---

We've been using a top-level component called `App` to manage our global application state. That works fine for a small application, but as we add more and more functionality it becomes very tedious to work with.

Together with React, Facebook released something called Flux. Flux is a methodology that helps you manage your global application state. Flux works fine, but has the downside that it uses events, which can lead to quite a bit of confusion.

Thankfully, [Dan Abramov](https://twitter.com/dan_abramov) stepped in and created Redux. Redux has the same core concept as Flux, but works without events, is much easer to understand and now basically the standard for application state management.

## The concept

Remember the `getInitialState` function of our `App` component? It looks like this:

```JS
getInitialState: function() {
  return {
    location: '',
    data: {},
    dates: [],
    temps: [],
    selected: {
      date: '',
      temp: null
    }
  };
},
```

The object we return from this function is our entire application state. At the first start of our application, our state thus looks like this:

```JS
{
  location: '',
  data: {},
  dates: [],
  temps: [],
  selected: {
    date: '',
    temp: null
  }
}
```

When users now change the location input field, the `location` field of our state changes:

```JS
{
  location: 'Vienna, Austria',
  /* …the rest stays the same… */
}
```

Instead of directly changing that location with `this.setState`, we'll call a function called `changeLocation` from our component. Redux will pick up that said function was called, do its magic and change the `location` field of our application state.

Now that the location is different and thus our application state has changed, our main `<App />` component will automatically rerender with the new data! (just like with component state)

The big advantage of this approach is that the component no longer needs to know how exactly we save the location. We could be persisting it as a coordinate, we could save it without whitespace, but the component doesn't have to care about that—the component only calls `changeLocation` and that's it! The application state is thus decoupled from the individual components.

This cycle of state management thus looks like this:

TK Image of state management with `changeLocation`, `location` and component

If we put this into more general terms, we call a function which changes something in the application state which rerenders some component:

TK Image of more general state management cycle

We'll now need to introduce some terminology before we can finally start implementing this. This function that we call to change the application state is called an "action" in Redux, and we "dispatch" the "action". Lets change the cycle one last time with the terminology:

TK Image of Redux specific state management cycle

Lets write our first action! We'll start with the location field, since it's a very typical example. An action function in Redux returns an object with a `type` and can optionally also pass some data along the way. Our `changeLocation` action looks like this:

```JS
function changeLocation(location) {
  return {
    type: 'CHANGE_LOCATION',
    location: location
  };
}
```

This action thus has a type of `'CHANGE_LOCATION'` and passes along some data with the `location` property. We'll now need to `dispatch` this action when the location changes:

```JS
var App = React.createClass({
  fetchData: function(evt) { /* … */ },
  onPlotClick: function(data)  { /* … */ },
  changeLocation: function(evt) {
    this.props.dispatch(actions.setLocation(evt.target.value));
  },
  render: function() { /* … */ }
});
```

> Don't worry about where `this.props.dispatch` comes from for now, we'll get to that!

That's nice and all, but this won't change the store automatically. We have to tell Redux what to do when this action comes in, which we do in a so-called reducer.

A reducer is a simple function that takes two arguments, the current state and the action that was called:

```JS
function appReducer(state, action) {
  return state;
}
```

Right now, no matter what action comes in and what data it has the state will always stay the same – that's not quite optimal, as nobody will be able to work with the app! Let's change the `location` field in the state based on the data in the action with the `'CHANGE_LOCATION'` type.

```JS
function appReducer(state, action) {
  switch (action.type) {
    case 'CHANGE_LOCATION':
      state.location = action.location;
      return state;
  }
}
```

// TODO MUTATION VS NO MUTATION
// TODO DEFAULT RETURN STATE

Imagine `evt.target.value` is `"Sydney, Australia"`, this is what our global state is going to look like when `dispatch` this action:

```JS
{
  location: 'Sydney, Australia',
  /* …the rest stays the same… */
}
```
