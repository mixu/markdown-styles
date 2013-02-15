# markdown-styles

CSS stylesheets / themes for Markdown.

## Using

Copy the assets folder from the layout you want to use.

## Adding new styles

Create a new directory under `./output/themename`.

If a files called `./layouts/themename/header.html` and `./layouts/themename/footer.html` exist, they are used, otherwise the default footer and header in `./layouts/plain/` are used.

The switcher is an old school frameset, you need to add a link in `./output/menu.html`.

To regenerate the pages, you need node:

    git clone ...
    npm install
    node generate.js
