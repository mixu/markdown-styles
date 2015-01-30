# markdown-styles

Converts Markdown files to HTML, with over a dozen builtin themes.

Looking for something to generate a blog from Markdown files? Check out [ghost-render](https://github.com/mixu/ghost-render).

## Features

- `v2.0` is a major rewrite, with significant usability improvements; the core has been rewritten to use object mode streams via [pipe-iterators](https://github.com/mixu/pipe-iterators)
- Includes 15+ ready-made CSS stylesheets for Markdown
- Reuse the stylesheets or use `generate-md` to convert a folder of Markdown documents to HTML, preserving the directory structure
- Completely static output is easy to host anywhere
- Metadata support: Each file can include additional metadata, such as the title and author name which can then be used in the layout (new in 2.0!)
- Layout features:
  - Built in support for syntax highlighting via highlight.js (new in 2.0!)
  - All layouts now include a Github-style code highlighting theme (v2.0!)
  - Built in table of contents generation from Markdown headings
  - Automatically detects the document title from the first heading in the Markdown markup (new in 2.0!)
- Easier to get started with a custom layout via `--exports`, which exports a built in layout as a starting point (new in 2.0).
- Create your own layout based on an existing layout via `--layout` with:
  - Full Handlebars support for layouts, helpers and partials (new in 2.0!)
  - Fully customizable table of contents template via the `toc` partial (new in 2.0!)
  - Support for relative path generation via the `{{asset 'path'}}` helper
- API support: `markdown-styles` now has a public API
- Changes in 2.0:
  - Deprecated `--command`, `{{styles}}`, `--template`, `--asset-dir`, `--partials`, `--helpers`, `--runner`.
  - Improved highlighter support, including adding a default hl.js style in every layout and enabling highlighting by default
  - Layout partials and helpers have been renamed: `{{content}}` -> `{{> content}}`, `{{toc}}` -> `{{> toc}}`, `{{assetsRelative}}` -> `{{asset 'path'}}`
  - The default layout is now `github`


-----

## Quickstart

Install `generate-md` via npm:

    sudo npm install -g markdown-styles

Create a markdown file and then convert it to html:

    mkdir input/
    echo "# Hello world\n YOLO" > input/index.md
    generate-md --layout github --input ./input --output ./output
    google-chrome ./output/index.html

Try out different layouts by changing the `--layout` parameter; screenshots are at the bottom of this page.

![montage](https://github.com/mixu/markdown-styles/raw/master/screenshots/montage.png)


## Metadata sections

Each markdown file can have metadata associated with it. To set the metadata, start your markdown file with a metadata block that looks like this:

```
title: Page title
---
# Hello world
YOLO
```

You can reference the metadata values in your template by name. The default layouts only make use of the `{{title}}` metadata value, but your custom layouts can refer to any additional fields you want.

`{{title}}` is used as the page title. If you do not set the value explicitly, it is automatically detected from the first heading in the markdown file.


## CLI

- `--input <path>` specifies the input directory (default: `./input/`).
- `--output <path>` specifies the output directory (default: `./output/`).
- `--layout <path>` specifies the layout. It can be:
  - The name of a builtin layout, such as `github` or `mixu-page`.
  - A path to a layout folder (full path, or path relative to `process.cwd`).
  - A layout folder consists of:
    - `./page.html`, the template to use in the layout
    - `./assets`, the assets folder to copy over to the output
    - `./partials`, the [partials](#partials) directory
    - `./helpers`, the [helpers](#helpers) directory
  - Note that `--template`, `--asset-dir`, `--partials` and `--helpers` are deprecated. This simplifies the loading logic. You need to put each of those resources in the same layout folder.
- `--export <name>`: Exports a built-in layout to a directory. Use `--output <path>` to specify the location to write the built-in layout. For example, `--export github --output ./custom-layout` will copy the `github` builtin layout to `./custom-layout`.
- `--highlight-<language> <module>`: Specifies a custom highlighter module to use for a specific language. For example, `--highlight-csv mds-csv` will highlight any `csv` code blocks using the `mds-csv` module.

## Syntax highlighting

`v2.0` has syntax highlighting enabled by default. Every layout has also been updated to include a default [highlight.js](https://highlightjs.org/) syntax highlighting theme, which means everything works out of the box. For more highlighter themes, [check out this demo site](https://highlightjs.org/static/demo/) - you can find the [highlight.js CSS styles here](https://github.com/isagalaev/highlight.js/tree/master/src/styles).

To enable language-specific syntax highlighting, you need to specify the language of the code block, e.g.:

    ```js
    var foo = bar;
    ```

`v2.0` also supports additional language specific syntax highlighters - check out [mds-csv](https://github.com/mixu/mds-csv) for an example of a syntax highlighter for a specific language.

To enable additional language-specific syntax highlighters, install the module (e.g. `mds-csv`), then add `--highlight-{languagename} {modulename}` to the command line. For example, `generate-md --highlight-csv mds-csv ...` to enable the CSV highlighter for `csv` code blocks.

## Writing your own layout

`v2.0` makes it easier to get started with a custom layout via `--exports`, which exports a built in layout as a starting point. Just pick a reasonable built in layout and start customizing. For example:

    generate-md --export github --output ./my-layout

will export the `github` layout to `./my-layout`. To make use of your new layout:

    generate-md --layout ./my-layout --input ./some-input --output ./output

If you look under `./my-layout`, you'll see that a layout folder consists of:

- `./page.html`, the template to use in the layout
- `./assets`, the assets folder to copy over to the output
- `./partials`, the [partials](#partials) directory
- `./helpers`, the [helpers](#helpers) directory

See the next few sections for more details for how these features work.


### Template Evaluation (page.html)

The [handlebars.js](https://github.com/wycats/handlebars.js) template language is used to evaluate both the template and the markdown.



Together with the `meta.json`, partials and helpers both template and markdown can be enhanced.


### Assets folder (./assets)

All files in the assets folder are copied from the layout folder to the output folder.



Then, running a command like:

      generate-md --input ./input/ --layout ./my-theme/page.html --output ./test/

will:

1. convert all Markdown files in `./input` to HTML files under `./test`, preserving paths in `./input`.
2. use the template `./my-theme/page.html`, replacing values such as `{{> content}}`, `{{{toc}}}` and `{{assetsRelative}}` (see the layouts for examples on this)
3. (recursively) copy over the assets from `./my-theme/assets` to `./test/assets`.

This means that you could, for example, point a HTTP server at the root of `./test/` and be done with it.

You can also use the current directory as the output (e.g. for Github pages).

- better spec for layout authoring:
    - `{{> content}}`: renders the markdown content
    - `{{asset 'asset-path'}}`: renders a specific asset path (previously `{{assetsRelative}}` / `{{styles}}`)
    - `{{> toc}}`: renders the table of contents
    - `{{title}}`: renders the title
      - if the title is not set, it will be automatically detected from the headings



### Template Evaluation


#### `meta.json`
You can add a file named `meta.json` to the folder from which you run `generate-md`.

The metadata in that directory will be read and replacements will be made for corresponding `{{names}}` in the template.

The metadata is scoped by the top-level directory in `./input`.

For example:

````json
{
  "foo": {
    "repoUrl": "https://github.com/mixu/markdown-styles"
  }
}
````

would make the metadata value `{{repoUrl}}` available in the template, for all files that are in the directory `./input/foo`.

Using [handlebars.js](https://github.com/wycats/handlebars.js) we can go event farther. For example, you may add a tags array to the meta.json:

```json
{
  "foo": {
    "tags": ["handlebars", "template"]
  }
}
```

While in the html you may:

```html
<ul>
{{#each tags}}
    <li>{{ this }}</li>
{{/each}}
</ul>
```

Which will result in

```html
<ul>
    <li>handlebars</li>
    <li>template</li>
</ul>
```

#### Partials

Partials are html files that can be included via handlebars `{{> partialName}}` style. Usually they are .html files. For example, if `footer.html` resides in the partials directory, `{{> footer}}` will be replaced with `footer.html`'s content. For more advanced topics, see [handlebars partials documentation](https://github.com/wycats/handlebars.js#partials). Don't use `content.html`, it is reserved to the html generated from the markdown.

#### Helpers

Helpers are functions that you can use throughout the template. See [handlebars helpers ](https://github.com/wycats/handlebars.js#registering-helpers).
For example, add `linkTo.js` to the specified helpers directory:

```js
var Handlebars = require('handlebars');
module.exports = function(){
  return new Handlebars.SafeString("<a href='" + Handlebars.Utils.escapeExpression(this.url) + "'>" + Handlebars.Utils.escapeExpression(this.body) + "</a>");
};
```

In your `meta.json`
```json
{
  "foo": {
    "links": [
      {"url": "/hello", "body": "Hello"},
      {"url": "/world", "body": "World!"}
    ]
  }
}
```
Somewhere in your template:
```html
<ul>{{#links}}<li>{{linkTo}}</li>{{/links}}</ul>
```

The result:
```html
<ul>
  <li>
    <a href='/hello'>Hello</a>
  </li>
  <li>
    <a href='/world'>World!</a>
  </li>
</ul>
```

## Acknowledgments

I'd like to thank the authors the following CSS stylesheets:

- the `github` style is based on [sindresorhus/github-markdown-css](https://github.com/sindresorhus/github-markdown-css)
- the `bootstrap3` style was contributed by @MrJuliuss
- jasonm23-dark, jasonm23-foghorn, jasonm23-markdown and jasonm23-swiss are based on https://github.com/jasonm23/markdown-css-themes by [jasonm23](https://github.com/jasonm23)
- thomasf-solarizedcssdark and thomasf-solarizedcsslight are based on https://github.com/thomasf/solarized-css by [thomasf](https://github.com/thomasf)
- markedapp-byword is based on the user-contributed stylesheet at http://bywordapp.com/extras/
- roryg-ghostwriter is based on https://github.com/roryg/ghostwriter
- github is based on [sindresorhus/github-markdown-css](https://github.com/sindresorhus/github-markdown-css) (sorry, sindresorhus-github is too long to type as a layout name!)

## Screenshots of the layouts

Note: these screenshots are generate via cutycapt, so they look worse than they do in a real browser.

### github

![github](https://github.com/mixu/markdown-styles/raw/master/screenshots/github.png)

### roryg-ghostwriter

![roryg-ghostwriter](https://github.com/mixu/markdown-styles/raw/master/screenshots/roryg-ghostwriter.png)

### mixu-bootstrap

![mixu-bootstrap](https://github.com/mixu/markdown-styles/raw/master/screenshots/mixu-bootstrap.png)

### mixu-bootstrap-2col

![mixu-bootstrap-2col](https://github.com/mixu/markdown-styles/raw/master/screenshots/mixu-bootstrap-2col.png)

### mixu-gray

![mixu-gray](https://github.com/mixu/markdown-styles/raw/master/screenshots/mixu-gray.png)

### jasonm23-dark

![jasonm23-dark](https://github.com/mixu/markdown-styles/raw/master/screenshots/jasonm23-dark.png)

### jasonm23-foghorn

![jasonm23-foghorn](https://github.com/mixu/markdown-styles/raw/master/screenshots/jasonm23-foghorn.png)

### jasonm23-markdown

![jasonm23-markdown](https://github.com/mixu/markdown-styles/raw/master/screenshots/jasonm23-markdown.png)

### jasonm23-swiss

![jasonm23-swiss](https://github.com/mixu/markdown-styles/raw/master/screenshots/jasonm23-swiss.png)

### markedapp-byword

![markedapp-byword](https://github.com/mixu/markdown-styles/raw/master/screenshots/markedapp-byword.png)

### mixu-book

![mixu-book](https://github.com/mixu/markdown-styles/raw/master/screenshots/mixu-book.png)

### mixu-page

![mixu-page](https://github.com/mixu/markdown-styles/raw/master/screenshots/mixu-page.png)

### mixu-radar

![mixu-radar](https://github.com/mixu/markdown-styles/raw/master/screenshots/mixu-radar.png)

### thomasf-solarizedcssdark

![thomasf-solarizedcssdark](https://github.com/mixu/markdown-styles/raw/master/screenshots/thomasf-solarizedcssdark.png)

### thomasf-solarizedcsslight

![thomasf-solarizedcsslight](https://github.com/mixu/markdown-styles/raw/master/screenshots/thomasf-solarizedcsslight.png)

### bootstrap3

![bootstrap3](https://github.com/mixu/markdown-styles/raw/master/screenshots/bootstrap3.png)

## Contributing new styles to markdown-styles

Add new layouts to `./layouts/name`. To regenerate the pages, you need to run:

    git clone git://github.com/mixu/markdown-styles.git
    npm install
    make build

To regenerate the screenshots, you need cutycapt (or some other Webkit to image tool) and imagemagic. On Ubuntu / Debian, that's:

    sudo aptitude install cutycapt imagemagick

You also need to install the web fonts locally so that cutycapt will find them, run `node font-download.js` to get the commands you need to run (basically a series of wget and fc-cache -fv commands).

Finally, run:

    make screenshots
