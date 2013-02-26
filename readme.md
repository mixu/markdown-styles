# markdown-styles

CSS stylesheets / themes for Markdown.

## Using

Copy the assets folder from the layout you want to use.

To preview the styles in the browser, clone this repo locally and then open `./output/index.html`.

## Using via npm

This repo also includes a small tool for generating HTML files from Markdown files.

The console tool is `generate-md`, e.g.

    generate-md --layout jasonm23-foghorn

Defaults:

- checks `./input/` and all subdirectories for files ending with `.md` (other files are ignored)
- if a folder named `./output/` exists, then files are placed there
- subdirectories are preserved, but they are not created (if the `./output/foo/` does not exist, then files in `./input/foo/` are ignored)
- if `./output/` does not exist, then output is written to the current directory

Options:

`--layout` specifies the layout to use.

`--input` specifies the input directory.

`--output` specifies the output directory.

## Screenshots

Note: there may be minor differences in the rendering since these screenshots are generated via cutycapt rather than a browser.

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

## Adding new styles

Create a new directory under `./output/themename`.

If a files called `./layouts/themename/header.html` and `./layouts/themename/footer.html` exist, they are used, otherwise the default footer and header in `./layouts/plain/` are used.

The switcher is an old school frameset, you need to add a link in `./output/menu.html`.

To regenerate the pages, you need node:

    git clone git://github.com/mixu/markdown-styles.git
    npm install
    make build

To regenerate the screenshots, you need cutycapt (or some other Webkit to image tool) and imagemagic.

You also need to install the web fonts locally so that cutycapt will find them, run `node font-download.js` to get the commands you need to run.

Finally, run:

    make screenshots
