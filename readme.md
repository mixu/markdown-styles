# markdown-styles

CSS stylesheets / themes for Markdown.

## Using

Copy the assets folder from the layout you want to use.

To preview the styles in the browser, clone this repo locally and then open `./output/index.html`.

## Using via npm

This repo also includes a small tool for generating HTML files from Markdown files.

The console tool is `generate-md`, e.g.

    generate-md --layout jasonm23-foghorn --output ./test/

Options:

`--layout` specifies the layout to use.

Note: the layout can also be a specific file. In this case, that file is used as the template, and if a `./assets/` directory exists in the same location as the layout, it is copied to the output directory. For example:

      generate-md --layout ./layout/page.html --output ./test/

`--input` specifies the input directory (default: `./input/`).

`--output` specifies the output directory (default: `./output/`).



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
