## Features

- Ready-made CSS stylesheets for Markdown, just copy the assets folder you want
- Bundled with `generate-md`, a small tool that converts a folder of Markdown documents into a output folder of HTML documents, preserving the directory structure)
- Use your own custom markup and CSS via `--layout`.
- Support for relative paths to the assets folder via `{{assetsRelative}}` and document table of content generation via `{{toc}}`.
- Support for generic metadata via a meta.json file

-----

## Using the CSS stylesheets

If you just want the stylesheets, you can just copy the `./assets` folder from the layout you want.

To preview the styles in the browser, clone this repo locally and then open `./output/index.html` or run `make preview` which opens that page in your default browser.

## Using generate-md

This repo also includes a small tool for generating HTML files from Markdown files.

The console tool is `generate-md`, e.g.

    generate-md --layout jasonm23-foghorn --output ./test/

[Here is an example](https://github.com/zendesk/radar/blob/gh-pages/Makefile) of how I generated the project docs for [Radar](https://github.com/zendesk/radar) using generate-md, a Makefile and a few custom assets.

`--input` specifies the input directory (default: `./input/`).

`--output` specifies the output directory (default: `./output/`).

`--layout` specifies the layout to use. This can be either one of built in layouts, or a path to a custom template file with a set of custom assets.

To override the layout, simply create a directory, such as `./my-theme/`, with the following structure:

````bash
├── my-theme
│   ├── assets
│   │   ├── css
│   │   ├── img
│   │   └── js
│   └── page.html

````

Then, running a command like:

      generate-md --input ./input/ --layout ./my-theme/page.html --output ./test/

will:

1. convert all Markdown files in `./input` to HTML files under `./test`, preserving paths in `./input`.
2. use the template `./my-theme/page.html`, replacing values such as `{{content}}`, `{{toc}}` and `{{assetsRelative}}` (see the layouts for examples on this)
3. (recursively) copy over the assets from `./my-theme/assets` to `./test/assets`.

This means that you could, for example, point a HTTP server at the root of `./test/` and be done with it.

You can also use the current directory as the output (e.g. for Github pages).

## New! Syntax highlighting support

`generate-md` supports syntax highlighting during the Markdown-to-HTML conversion process.

To enable the syntax highlighting support, install `highlight.js`:

    npm install --save highlight.js markdown-styles

Note that you need to install `markdown-styles` locally like shown above and invoke it as `./node_modules/.bin/generate-md`, so that `require('highlight.js')` will find the module we just installed locally.

You will also need to include [one of the highlight.js CSS style sheets](http://softwaremaniacs.org/media/soft/highlight/test.html) in your assets folder/layout file CSS (e.g. by using a custom `--layout` file).

## New! --command

`--command <cmd>`: Pipe each Markdown file through a shell command and capture the output before converting. Useful for filtering the file, for example.

## New! --asset-dir

`--asset-dir <path>`: Normally, the asset directory is assumed to be `./assets/` in the same folder the `--layout` file is. You can override it to a different asset directory explicitly with `--asset-dir`, which is useful for builds where several directories use the same layout but different asset directories.

## Metadata support

You can also add a file named `meta.json` to the folder from which you run `generate-md`.

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

This is rather imperfect, but works for small stuff, feel free to contribute improvements back.

## Acknowledgments

I'd like to thank the authors the following CSS stylesheets:

- jasonm23-dark, jasonm23-foghorn, jasonm23-markdown and jasonm23-swiss are based on https://github.com/jasonm23/markdown-css-themes by [jasonm23](https://github.com/jasonm23)
- thomasf-solarizedcssdark and thomasf-solarizedcsslight are based on https://github.com/thomasf/solarized-css by [thomasf](https://github.com/thomasf)
- markedapp-byword is based on the user-contributed stylesheet at http://bywordapp.com/extras/

## Screenshots of the layouts

Note: these screenshots are generate via cutycapt, so they look worse than they do in a real browser.

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

### mixu-bootstrap (new!)

![mixu-bootstrap](https://github.com/mixu/markdown-styles/raw/master/screenshots/mixu-bootstrap.png)

### mixu-bootstrap-2col (new!)

![mixu-bootstrap-2col](https://github.com/mixu/markdown-styles/raw/master/screenshots/mixu-bootstrap-2col.png)

### mixu-gray (new!)

![mixu-gray](https://github.com/mixu/markdown-styles/raw/master/screenshots/mixu-gray.png)

### thomasf-solarizedcssdark

![thomasf-solarizedcssdark](https://github.com/mixu/markdown-styles/raw/master/screenshots/thomasf-solarizedcssdark.png)

### thomasf-solarizedcsslight

![thomasf-solarizedcsslight](https://github.com/mixu/markdown-styles/raw/master/screenshots/thomasf-solarizedcsslight.png)

## Adding new styles

Create a new directory under `./output/themename`.

If a file called `./layouts/themename/page.html` exists, it is used, otherwise the default footer and header in `./layouts/plain/` are used.

The switcher is an old school frameset, you need to add a link in `./output/menu.html`.

To regenerate the pages, you need node:

    git clone git://github.com/mixu/markdown-styles.git
    npm install
    make build

To regenerate the screenshots, you need cutycapt (or some other Webkit to image tool) and imagemagic. On Ubuntu / Debian, that's:

    sudo aptitude install cutycapt imagemagick

You also need to install the web fonts locally so that cutycapt will find them, run `node font-download.js` to get the commands you need to run (basically a series of wget and fc-cache -fv commands).

Finally, run:

    make screenshots
