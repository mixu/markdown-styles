
## Improvements in v2.x

- `generate-md` now supports table of contents generation
- individual markdown files can now have their own metadata headers (JSON, YAML etc.)

### Table of contents generation

Default markup.

Overriding with a different template.

### File metadata headers

Header format: `---\n`, followed by the header content, followed by `---\n`.

JSON support.

Overriding the header format.

### Custom templating engine

Pretty much every templating engine you might want to use is supported via [consolidate.js](https://github.com/visionmedia/consolidate.js), which provides a uniform interface into different templating engines.

First, install the templating engine you want to use:

    npm install --save jade

Next, add the `--template engine` option:

    generate-md --template engine jade ...

### Archive page generation

### Index page generation


