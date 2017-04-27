# Academy

[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

> Skills, style guides, and tutorials for work at Plotly

## Install

1. Clone this repository by entering `git clone https://github.com/plotly/academy.git` into your terminal
2. When that is finished, enter the directory of the repo with `cd academy`
3. Install the dependencies of this page with `bundle install`

> Note: See [`Prerequisites.md`](prerequisites.md) if you encounter a problem with the initial setup.

### Running locally

1. Enter `bundle exec jekyll serve` into your terminal
2. Open `localhost:4000` in your browser

## Usage

### Typography

We use [Typography.js](https://github.com/KyleAMathews/typography.js) to set up our typography styles. If you need to adjust the typography, follow the steps below:

1. Go to the `scripts/` folder and run `npm install`.
2. Make changes to the generated typography css, make changes to `write-typography.js`
3. Run `npm run write-typography`. This will write out a file to the \_sass src directory.

Now you can just start jekyll like normally and the new styles will be there!

### Adding a new tutorial

There are two types of tutorials: site internal tutorials, and external tutorials. Site internal tutorials are all tutorials that live in this repository and can be accessed directly at academy.plotly.com/tutorialname, e.g. the React tutorials.

External tutorials are links to tutorials that live on other websites.

#### Internal tutorials

Add your tutorial to the [`_config.yml`](_config.yml) as a collection like this:

```YAML
collections:
  tutorialname:
    output: true
    permalink: /tutorialname/:path/index.html
    title: "Tutorial Title"
    category: "Frontend"
```

Add a folder in the root directory called `_tutorialname`, and put the Markdown files of the tutorial in there. That's it, your tutorial will now be visible on the home screen!

> Note the `category` field, this field can be one of these two values: "Frontend" or "Data Science"!

#### External tutorials

To add an external tutorial, again add your tutorial to the [`_config.yml`](_config.yml) as a collection but this time with `output` set to `false`:

```YAML
collections:
  tutorialname:
    output: false
    title: "Tutorial Title"
    category: "Data Science"
```

Also similar to the internal tutorials, you again add a directory called `_tutorialname` to the root folder and put Markdown files in there, one for each tutorial part.

The difference lies within the Markdown files, instead of containing the parts themselves, they specify `links_to` in their YAML Front Matter, like this:

```Markdown
---
title: Test 1
description: This is a test external tutorial
links_to: http://plot.ly
---
```

And you'll see a list of your tutorial parts with links to the external sites on the homepage!

## Maintainers

Currently, there is no single maintainer for this project. Would you like to become one? [Ask us by opening an issue!](https://github.com/plotly/academy/issues/new).

## Contribute

Please do! This is an open source project. [Open an issue](https://github.com/plotly/academy/issues/new) or submit a PR.

Please note that all work on any Plotly repository must follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## License

[MIT](LICENSE.txt) © 2016-2017 Plotly.
