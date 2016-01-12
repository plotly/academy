# Plotly Academy

## Usage

### Setup

1. Clone repo `git clone https://github.com/plotly/academy.git`
2. Run `bundle install`

### Running locally

1. Run `bundle exec jekyll serve`
2. Open `localhost:4000` in your browser

### Adding a new tutorial

Add your tutorial to the [`_config.yml`](_config.yml) as a collection like this:

```YAML
collections:
  tutorialname:
    output: true
    permalink: /tutorialname/:path/index.html
    title: "Tutorial Title"
```

Add a folder in the root directory called `_tutorialname`, and put the Markdown files of the tutorial in there. That's it, your tutorial will now be visible on the homescreen!

## Licensing

Code released under [the MIT license](LICENSE.txt).
