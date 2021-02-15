# markdown-styles

Converts Markdown files to HTML, with over a dozen builtin themes.

Looking for something to generate a blog from Markdown files? Check out [ghost-render](https://github.com/mixu/ghost-render).

Looking to automatically render your Markdown site on `git push`? Check out [markdown-styles-lambda](https://github.com/mixu/markdown-styles-lambda)

## Features

- `v3.2.0` drops support for Node versions older than v10.12.0, removes mkdirp in favor of the [native recursive mkdir](https://github.com/nodejs/node/blob/master/doc/changelogs/CHANGELOG_V10.md#2018-10-10-version-10120-current-targos) and upgrades all dependencies to recent versions.
- `v3.1.10` fixes an issue with single file inputs, thanks @josimard!
- `v3.1.9` adds support for Chinese characters in heading link ids, thanks @weihong1028! Also includes a fix by @csandor for metadata with Windows line endings.
- `v3.1.8` fixes an issue with links that consist of internal anchors, thanks @a7madgamal & @nazrhyn!
- `v3.1.7` fixes an issue with paths on Windows and a default font protocol in mixu-page, thanks @hakkanicko and wirmar!
- `v3.1.6` fixes a compatibility issue with Node 6, thanks @maximumstock!
- `v3.1.5` updates some dependencies to add YAML syntax highlighting, thanks @omnibs!
- `v3.1.4` added linkification for relative links to markdown files, e.g. `[link](./foo.md)` -> `<a href="./foo.html">link</a>`.
- `v3.1.3` added a few additional properties to the programmatic API.
- `v3.1.2` added default classes that allow you to [style headings in the table of contents](#table-of-contents). See [the changelog](./changelog.md) for changes made in older versions.
- Includes 15+ ready-made CSS stylesheets for Markdown, see the bottom of the readme for screenshots.
- Reuse the stylesheets or use the `generate-md` tool to convert a folder of Markdown files to HTML using one of the built-in layouts or a custom layout.
- Completely static output is easy to host anywhere.
- Metadata support: Each file can include additional metadata in a header section, such as the page title and author name which can then be used in the layout.

### Layout features

- Built in support for code syntax highlighting via highlight.js; all layouts include a Github-style code highlighting theme by default.
- Built in table of contents generation from Markdown headings, fully customizable by replacing the `{{> toc}}` partial in custom layout.
- Built in header id and anchor generation for headings written in Markdown; all layouts support revealing the URL via header hover links.
- Support for custom logic for rendering code blocks via `--highlight-*`; this can be used to implement custom blocks that render the content of the code block in some interesting way. For example, I used this in my CSS book to [implement](https://github.com/mixu/cssbook/blob/master/layout/highlighters/spoiler.js) hidden [spoiler texts](http://book.mixu.net/css/5-tricks.html#box-rendering-and-stacking-context).
- Automatically detects the document title from the first heading in the Markdown markup.

### Features for creating your own layout

- To make it easier to get started, you can export an existing layout using `--exports` and use that as a starting point for your layouts.
- Create your own layout based on an existing layout via `--layout` with:
  - Full [Handlebars](http://handlebarsjs.com/) support for layouts, helpers and partials
  - Fully customizable table of contents template via the `toc` partial
  - Support for relative path generation via the `{{asset 'path'}}` helper
- API support: `markdown-styles` now has a public API

For changes, see [the changelog](changelog.md).

-----

## Quickstart

Install `generate-md` via npm (to get npm, just [install Node.js](http://nodejs.org/download/)):

    sudo npm install -g markdown-styles

Create a markdown file and then convert it to html:

    mkdir input/
    echo "# Hello world\n YOLO" > input/index.md
    generate-md --layout github --input ./input --output ./output
    google-chrome ./output/index.html

Try out different layouts by changing the `--layout` parameter; screenshots are at the bottom of this page.

![montage](https://github.com/mixu/markdown-styles/raw/master/screenshots/montage.jpg)

## generate-md CLI options

- `--input <path>` specifies the input directory (default: `./input/`).
- `--output <path>` specifies the output directory (default: `./output/`).
- `--layout <path>` specifies the layout. It can be:
  - The name of a builtin layout, such as `github` or `mixu-page`.
  - A path to a layout folder (full path, or a path relative to `process.cwd`).
  - A layout folder consists of:
    - `./page.html`, the template to use in the layout
    - `./assets`, the assets folder to copy over to the output
    - `./partials`, the [partials](#partials) directory
    - `./helpers`, the [helpers](#helpers) directory
- `--export <name>`: Exports a built-in layout to a directory. Use `--output <path>` to specify the location to write the built-in layout. For example, `--export github --output ./custom-layout` will copy the `github` builtin layout to `./custom-layout`.
- `--highlight-<language> <module>`: Specifies a custom highlighter module to use for a specific language. For example, `--highlight-csv mds-csv` will highlight any `csv` code blocks using the `mds-csv` module.
- `--no-header-links`: If this flag is passed, the HTML for header links will not be generated. The hover links are enabled by default.

## The resulting output

The output HTML is fully static and uses relative paths to the asset files, which are also copied into the output folder. This means that you could, for example, point a HTTP server at the output folder and be done with it or push the output folder to Amazon S3.

For example, here is how I deploy one of my books: `aws s3 sync ./output/ s3://some-s3-bucket/some-folder/ --delete --exclude "node_modules/*"  --exclude ".git"` (assuming credentials are in the necessary environment variables and that the AWS CLI is installed).

## Syntax highlighting

`v2.0` has syntax highlighting enabled by default. Every layout has also been updated to include a default [highlight.js](https://highlightjs.org/) syntax highlighting theme, which means everything works out of the box. For more highlighter themes, [check out this demo site](https://highlightjs.org/static/demo/) - you can find the [highlight.js CSS styles here](https://github.com/isagalaev/highlight.js/tree/master/src/styles).

To enable language-specific syntax highlighting, you need to specify the language of the code block, e.g.:

    ```js
    var foo = 'bar';
    ```

`v2.0` also supports additional language specific syntax highlighters - check out [mds-csv](https://github.com/mixu/mds-csv) for an example of a syntax highlighter for a specific language.

To enable additional language-specific syntax highlighters, install the module (e.g. `mds-csv`), then add `--highlight-{languagename} {modulename}` to the command line. For example, `generate-md --highlight-csv mds-csv ...` to enable the CSV highlighter for `csv` code blocks.

## Table of contents

The following built in layouts include the `{{~> toc}}` partial:

- mixu-book
- mixu-bootstrap-2col
- mixu-gray
- mixu-radar

These are mostly templates that have a sensible place to put this table of contents, such as a sidebar. I didn't want to default to putting a table of contents into the layouts that had no sidebar, but you can add it quite easily.

The `{{~> toc}}` partial generates a table of contents list. The list contains links to every header in your Markdown file. In addition, every Markdown header is automatically converted to a linkable anchor (e.g. `#table_of_contents`) when the page is generated.

You can customize the table of contents markup by overriding the [./partials/toc.hbs](https://github.com/mixu/markdown-styles/blob/master/builtin/partials/toc.hbs) partial in your custom layout. By default, it looks like this:

```html
<ul class="nav nav-list">
  {{#each headings}}
    <li class="sidebar-header-{{depth}}"><a href="#{{id}}">{{text}}</a></li>
  {{/each}}
</ul>
```

Note that by default (since v3.1.2), each heading list item has a class that depends on the level of the heading (`.sidebar-header-1`, `.sidebar-header-2`, ...). Thanks @mixinmax!

The `headings` metadata is an array of objects with:

- an `id` field (the HTML anchor id),
- a `text` field (the heading text) and
- a `depth` field (the depth of the heading, e.g. the number of `#` characters in the heading).

## Header hover links (v2.1)

If you are reading this on Github, hover over the header above. You'll see a link appear on the side of the header. The same feature is supported by all of the layouts. The feature is implemented purely with CSS, and you can find the details in `pilcrow.css` in each layout's assets folder. To disable the feature, pass the `--no-header-links` flag.

`v2.4` added support for having unique links for duplicated header names (e.g. using the same header text multiple times in the same file). The header id for the first occurrence stays the same as earlier (`#header-text`), but the second and subsequent headers get a counter appended (e.g. `#header-text-1`, `#header-text-2`). Thanks @xcv58!

## Metadata sections

Each markdown file can have metadata associated with it. To set the metadata, start your markdown file with a metadata block that looks like this:

```
title: Page title
---
# Hello world
YOLO
```

There must be at least three `-` characters that separate the header from the rest of the content (on a single line).

You can reference the metadata values in your template by name. The default layouts only make use of the `{{title}}` metadata value, but your custom layouts can refer to any additional fields you want.

`{{title}}` is used as the page title. If you do not set the value explicitly, it is automatically detected from the first heading in the markdown file.

The metadata can also be written using JSON syntax or YAML syntax. This makes it possible to add arrays and hashes in the metadata. Using [handlebars.js](https://github.com/wycats/handlebars.js) you can go even further. For example, you can add a tags array into the metadata section:

```
title: Page title
tags: ["handlebars", "template"]
---
# Hello world
```

... which can then be [iterated over using the standard Handlebars `{{#each}}` iterator](http://handlebarsjs.com/block_helpers.html):

```html
<ul>
{{#each tags}}
    <li>{{ this }}</li>
{{/each}}
</ul>
```

which will result in:

```html
<ul>
    <li>handlebars</li>
    <li>template</li>
</ul>
```

If you take a look at [the `{{~> toc}}` built in partial](https://github.com/mixu/markdown-styles/blob/master/builtin/partials/toc.hbs), you can see that it is actually [iterating over a metadata field](#table-of-contents) called `headings` using the same syntax.

## Writing your own layout

`v2.0` makes it easier to get started with a custom layout via `--export`, which exports a built in layout as a starting point. Just pick a reasonable built in layout and start customizing. For example:

```sh
generate-md --export github --output ./my-layout
```

will export the `github` layout to `./my-layout`. To make use of your new layout:

```sh
generate-md --layout ./my-layout --input ./some-input --output ./output
```

If you look under `./my-layout`, you'll see that a layout folder consists of:

- `./page.html`, the template to use in the layout
- `./assets`, the assets folder to copy over to the output
- `./partials`, the [partials](#partials) directory
- `./helpers`, the [helpers](#helpers) directory

See the next few sections for more details for how these features work.

### Template Evaluation (page.html)

The [handlebars.js](https://github.com/wycats/handlebars.js) template language is used to evaluate both the template and the markdown.

Here is a list of all the built in features:

- `{{~> content}}`: renders the markdown content
- `{{asset 'asset-path'}}`: renders a specific asset path
- `{{~> toc}}`: renders the table of contents
- `{{title}}`: renders the title from the metadata section

Any metadata fields you have defined in the page's metadata section can be referenced in `page.html` by name. For example, `{{title}}` is replaced with the value of the `title` metadata field when the template is rendered.

You can include your own helpers and partials in your custom layout as shown below.

### Assets folder (./assets)

All files in the assets folder are copied from the layout folder to the output folder.

To refer to files in the assets folder, use the `{{asset 'path'}}` helper. For example, `{{asset 'css/style.css'}}` will be replaced with a relative path to the file in `./assets/css/style.css`. Take a look at the built in layouts for some examples.

### Partials

Partials are html files that can be included via handlebars `{{> partialName}}` style. Usually they are .html files. For example, if `footer.html` resides in the partials directory, `{{> footer}}` will be replaced with `footer.html`'s content. For more advanced topics, see [handlebars partials documentation](https://github.com/wycats/handlebars.js#partials). Don't use `content.html`, it is reserved to the html generated from the markdown. You can override the `toc` partial by adding `./partials/toc.html` as a partial in your custom layout, e.g.

```html
<h1>My Table of Contents</h1>
<ul class="nav nav-list">
  {{#each headings}}
    <li><a href="#{{id}}">{{text}}</a></li>
  {{/each}}
</ul>
```

### Helpers

Helpers are functions that you can use throughout the template. See [handlebars helpers](https://github.com/wycats/handlebars.js#registering-helpers).
For example, add `linkTo.js` to the `./helpers` directory in your custom layout:

```js
var Handlebars = require('handlebars');
module.exports = function(){
  return new Handlebars.SafeString("<a href='" + Handlebars.Utils.escapeExpression(this.url) + "'>" + Handlebars.Utils.escapeExpression(this.body) + "</a>");
};
```

Next, in `./my-layout`, run `npm install handlebars` (since we're requiring handlebars) in the code.

In your metadata heading:

```
links:
  - url: "/hello"
    body: "Hello"
  - url: "/world"
    body: "World!"
---
# Hello world
```
or:

```
links: [ { url: "/hello", body: "Hello"},
         { url: "/world", body: "World!" } ]
---
# Hello world
```
and somewhere in your template:

```html
<ul>{{#links}}<li>{{{linkTo}}}</li>{{/links}}</ul>
```

Note the usage of the "triple-stash", e.g. `{{{` here. The technical reason for this is documented [in this issue in Handlebars](https://github.com/wycats/handlebars.js/issues/886) and will be apparently fixed in Handlebars `3.0`. For now, use triple-stash to invoke any helpers that generate HTML.

... will result in:

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

### `meta.json` (new behavior in 3.x)

If you want to apply additional metadata to all Markdown files in a particular folder, you can add a file named `meta.json` to the root of the input folder.

For example, if you run `generate-md --input foo`, the `meta.json` file should be located at `./foo/meta.json`.

(Note: in `v1.x`, `meta.json` was read from `process.cwd()`, e.g. the folder from which you ran `generate-md`).

Metadata handling has changed in v3.0.0. The metadata is now applied by sequentially merging keys which represent paths. This allows you to set default values for all of the files and then override those values for each subdirectory in `meta.json`

The keys in meta.json represent file paths relative to the root of the input directory. Each file will be rendered with the merged metadata.

Here are a couple of quick examples:

| meta.json content                 | `{{key}}` is available in: |
|-----------------------------------|-----------------------------------------
| `{ "*": {"key": "value" }}`       | all input files
| `{ "foo": {"key": "value" }}`     | `./input/foo.md`
| `{ "foo/*": {"key": "value" }}`   | `./input/foo/*` and subdirs
| `{ "foo/bar": {"key": "value" }}` | `./input/foo/bar.md`
| `{ "foo/bar/*": {"key": "value" }}` | `./input/foo/bar/*` and subdirs

More specifically, the merge proceeds as follows:

- Start with an empty object
- Read the `*` key in `meta.json`
- Take split the pathname of the current file relative to the input directory by the path separator (`/` in Linux/OSX and `\\` in Windows; note that the key lookup will always use `/` on all platforms). For example, if the filename is `./input/a/b/c.md` and the input directory is `./input`, then the path components would be `a`, `b`.
- Concatenate the components one by one and look for keys that end with the concatenated path + `/*`. For example, for `./input/a/b/c.md`, the keys will be `a/*`, `a/b/*`.
- Merge the metadata values from the keys in order of specificity, e.g. starting with the values under the `*` key, then `a/*`, then `a/b/*`.
- Look for a key that matches the full relative file name without the extension. e.g. `a/b/c`, and merge that in.
- Read the file, and overwrite the metadata values with the values set in the file.
- Finally, if the title property is still not set, automatically set using the first heading in the markdown file.

For example, a `./input/meta.json` file like this:

````json
{
  "*": {
    "repoUrl": "DEFAULT"
  },
  "foo/*": {
    "repoUrl": "MORE SPECIFIC"
  }
}
````

would make the metadata value `{{repoUrl}}` available in the template for all input files to `DEFAULT` except for input files in `./input/foo/`. For `./input/foo/*` and all subdirectories, `repoUrl` would be set to `MORE SPECIFIC`.

If any markdown file in `./input/foo/` defines a metadata value called `repoUrl`, then that value will override the value from `meta.json`.

### API

- `.resolveArgs(argv)`: given a hash containing command line args, returns the fully resolved arguments. This does two things: it takes care of relative paths and loads the modules passed via `highlight-*` so that they can be invoked as functions when highlighting a specific language.
- `.render(argv, onDone)`: given a hash of resolved arguments, it processes every file just like the command line tool; this includes copying files.
- `.pipeline(argv)`: given a hash of resolved arguments, it returns a writable object mode stream that accepts objects with the following keys:
  - `path` (an absolute path to the input file name),
  - `stat` (the fs.stat object associated with the input file),
  - `contents` (a string with the content of the input file).
- Since `v3.1.3`, the `pipeline` function supports a couple of arguments that are not exposed on the CLI (in addition to all the CLI args):
  - `meta`: a hash of JSON (the contents of a meta.json file if you prefer to set that explicitly)
  - `asset-path`: a full path to the `/assets` folder, defaults to `${output}/assets`.

The writable stream returns objects with the same properties, plus any metadata. The pipeline updates `path` to be the output path that generate-md would write the file to, and updates `contents` to be a string of HTML.

To plug the equivalent of `generate-md` into your grunt/gulp etc. task, use the following code:

```js
var mds = require('markdown-styles'),
    path = require('path');

mds.render(mds.resolveArgs({
  input: path.normalize(process.cwd() + '/input'),
  output: path.normalize(process.cwd() + '/output'),
  layout: path.normalize(process.cwd() + '/my-layout'),
}), function() {
  console.log('All done!');
});
```

See `bin/generate-md` and `test/api.test.js` for details.

## Acknowledgments

I'd like to thank the following people for contributing new features:

- @mixinmax for adding default class names to the table of contents
- @parmentelat for adding the cascading meta.json logic
- @AaronJan for contributing a patch that adds support for Windows
- @joebain for a fix related to using markdown-styles with grunt
- @xcv58 for dealing with the case where the same header text is used multiple times in the same file
- @iamdoron for contributing the initial implementation of the Handlebars templating integration

I'd like to thank the following people for making CSS stylesheets available with a permissive open source license:

- the `witex` style is based on [AndrewBelt/WiTeX](https://github.com/AndrewBelt/WiTeX)
- the `github` style is based on [sindresorhus/github-markdown-css](https://github.com/sindresorhus/github-markdown-css)
- the `bootstrap3` style was contributed by @MrJuliuss
- jasonm23-dark, jasonm23-foghorn, jasonm23-markdown and jasonm23-swiss are based on https://github.com/jasonm23/markdown-css-themes by [jasonm23](https://github.com/jasonm23)
- thomasf-solarizedcssdark and thomasf-solarizedcsslight are based on https://github.com/thomasf/solarized-css by [thomasf](https://github.com/thomasf)
- markedapp-byword is based on the user-contributed stylesheet at http://bywordapp.com/extras/
- roryg-ghostwriter is based on https://github.com/roryg/ghostwriter
- github is based on [sindresorhus/github-markdown-css](https://github.com/sindresorhus/github-markdown-css) (sorry, sindresorhus-github is too long to type as a layout name!)

## Screenshots of the layouts

Thanks to [electroshot](https://github.com/mixu/electroshot), the screenshots now look about right (e.g. web fonts render correctly).

### github

![github](https://github.com/mixu/markdown-styles/raw/master/screenshots/github.jpg)

### witex

![witex](https://github.com/mixu/markdown-styles/raw/master/screenshots/witex.jpg)

### roryg-ghostwriter

![roryg-ghostwriter](https://github.com/mixu/markdown-styles/raw/master/screenshots/roryg-ghostwriter.jpg)

### mixu-bootstrap

![mixu-bootstrap](https://github.com/mixu/markdown-styles/raw/master/screenshots/mixu-bootstrap.jpg)

### mixu-bootstrap-2col

![mixu-bootstrap-2col](https://github.com/mixu/markdown-styles/raw/master/screenshots/mixu-bootstrap-2col.jpg)

### mixu-gray

![mixu-gray](https://github.com/mixu/markdown-styles/raw/master/screenshots/mixu-gray.jpg)

### jasonm23-dark

![jasonm23-dark](https://github.com/mixu/markdown-styles/raw/master/screenshots/jasonm23-dark.jpg)

### jasonm23-foghorn

![jasonm23-foghorn](https://github.com/mixu/markdown-styles/raw/master/screenshots/jasonm23-foghorn.jpg)

### jasonm23-markdown

![jasonm23-markdown](https://github.com/mixu/markdown-styles/raw/master/screenshots/jasonm23-markdown.jpg)

### jasonm23-swiss

![jasonm23-swiss](https://github.com/mixu/markdown-styles/raw/master/screenshots/jasonm23-swiss.jpg)

### markedapp-byword

![markedapp-byword](https://github.com/mixu/markdown-styles/raw/master/screenshots/markedapp-byword.jpg)

### mixu-book

![mixu-book](https://github.com/mixu/markdown-styles/raw/master/screenshots/mixu-book.jpg)

### mixu-page

![mixu-page](https://github.com/mixu/markdown-styles/raw/master/screenshots/mixu-page.jpg)

### mixu-radar

![mixu-radar](https://github.com/mixu/markdown-styles/raw/master/screenshots/mixu-radar.jpg)

### thomasf-solarizedcssdark

![thomasf-solarizedcssdark](https://github.com/mixu/markdown-styles/raw/master/screenshots/thomasf-solarizedcssdark.jpg)

### thomasf-solarizedcsslight

![thomasf-solarizedcsslight](https://github.com/mixu/markdown-styles/raw/master/screenshots/thomasf-solarizedcsslight.jpg)

### bootstrap3

![bootstrap3](https://github.com/mixu/markdown-styles/raw/master/screenshots/bootstrap3.jpg)

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

If you have phantomjs installed, run:

    make phantomjs

which will use a phantomjs script to capture the screenshots.
