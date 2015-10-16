## Changes in 3.1.2

- `v3.1.2` adds default classes that allow you to style headings in the table of contents.

## Changes in 3.1.1

- Minor patch

## Changes in 3.1

- Updated dependencies in package.json.

## Changes in 3.0

- `v3.0` changes how the optional `meta.json` file works, adding support for setting per-directory and global metadata values (see the section further down). It also adds responsive markup tweaks to the github, markedapp-byword, mixu-book, mixu-page, mixu-radar and witex layouts and adds the responsive meta tag to all layouts.

## Changes in 2.4

- Better handling for when the same header text is used multiple times in the same file.

## Changes in 2.3.1

- Fixed a bug where the `render` function would not wait until all the assets were copied, thanks @joebain!

## Changes in 2.3:

- `v2.3` adds one new feature: header hover anchor links. When you hover over a header, a hover anchor link appears to the side of the header. Clicking on that link or copying its URL produces a link to that specific location on the page. All built-in layouts support this feature by default.
- Added the `--no-header-links` flag.

## Changes in 2.2:

- Added support for Windows, thanks @AaronJan

## Changes in 2.1:

- Better single file handling, previously the output path was a bit wonky if you only had one file as the `--input` target.

## Changes in 2.0:

- `v2.0` is a major rewrite, with significant usability improvements; the core has been rewritten to use object mode streams via [pipe-iterators](https://github.com/mixu/pipe-iterators).
- Deprecated `--command`, `{{styles}}`, `--template`, `--asset-dir`, `--partials`, `--helpers`, `--runner`. Most of this functionality can be easily replicated much more cleanly with the new features.
- Improved highlighter support. Every built in layout now includes a default highlight.js CSS stylesheet and you no longer need to add extra CLI options to enable highlighting.
- Layout partials and helpers have been renamed: `{{content}}` -> `{{> content}}`, `{{toc}}` -> `{{> toc}}`, `{{assetsRelative}}` -> `{{asset 'path'}}`
- The default layout is now `github`, which looks a lot like Github readmes.
