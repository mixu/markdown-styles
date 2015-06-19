## Changes in 2.3.1

- Fixed a bug where the `render` function would not wait until all the assets were copied, thanks @joebain!

## Changes in 2.3:

- Added the new header hover links feature, along with the relevant CSS for each built in layout.
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
