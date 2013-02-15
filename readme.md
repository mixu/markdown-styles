# markdown-styles

CSS stylesheets / themes for Markdown.

## Using

Copy the assets folder from the layout you want to use.

## Screenshots

Note: webfonts are missing right now, I think I'll need to switch to phantomJS to get full support for screenshots.

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

    git clone ...
    npm install
    node generate.js

To regenerate the screenshots, you need cutycapt (or some other Webkit to image tool) and imagemagic:


    make screenshots
