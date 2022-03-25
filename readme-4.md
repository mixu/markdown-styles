# markdown-styles

Converts Markdown files to HTML, with over a dozen builtin themes.

## What's new in V4?

The goal has changed the same - to provide a batteries-included static website generator that takes in markdown and generates static HTML output that can be hosted on S3.

If you didn't apply any customization on top of markdown-styles, v4 should works just the same as V3.

The main changes are around building custom layouts and extending existing layouts. I wanted to make it easier to build static sites that are enhanced with React / Preact since that's what everyone works with these days.

Here are the main changes:

- v4 drops support for Handlebars
- v4 adds a watcher that takes markdown files and converts them into JSON files




## How it works



### Stage 1: discover all files

- All non-markdown files - copied over
- All markdown files go to stage 2

### Stage 2: markdown -> JSON

- Each markdown file is moved under `./output/json/files/`, preserving the relative path under `./input`, e.g. `./input/foo/bar.md` -> `./output/json/files/foo/bar.json`

convertFileToJSON


## Page metadata

```json
{
  "title": "Page title (from metadata or first heading)",
  "contents": ["... array of parsed nodes"],
  "headings": ["... flat array of heading nodes"],
}
```

Useful extras:

- page title
- page URL (relative to root -- omits file extension)


- headings as a structured hash for rendering a TOC

```md
# h1
## First h2
### h3
## Second h2
```

```json
{
  "id": "root",
  "text": "root",
  "depth": 0,
  "children": [
    {
      "id": "h1",
      "text": "h1",
      "depth": 1,
      "children": [
        {
          "id": "First-h2",
          "text": "First h2",
          "depth": 2,
          "children": [
            {
              "id": "h3",
              "text": "h3",
              "depth": 3,
            }

          ],
        }
      ],
    },
    {
      "id": "Second-h2",
      "text": "Second h2",
      "depth": 2,
      "children": [],
    }
  ],
}
```





### Stage 3: JSON -> HTML

Every markdown file needs to have a corresponding .html file as well, since we to allow people to open any page on our website without any server-side code (just static asset delivery).



  - One possible renderer is the one supplied by marked.

JSONtoHTML





Metadata

- build level metadata
  - full directory paths
  - all files
    - all contents
- file level
  - all headings
  - all content

