var fs = require('fs'),
    pi = require('pipe-iterators'),
    md = require('markdown-stream-utils'),
    setOutputPath = require('./set-output-path'),
    mergeMeta = require('./merge-meta'),
    writeAsJson = require('./write-as-json');

module.exports = function(argv) {
  if (!argv.meta) {
    // load the metadata file if it exists
    argv.meta = fs.existsSync(argv.input + '/meta.json') ? require(argv.input + '/meta.json') : {};
  }

  return pi.pipeline([
      md.parseHeader(),
      md.parseMd(),
      md.annotateMdHeadings(),
      md.highlight(function(code, lang) {
        if (argv.highlight && typeof argv.highlight[lang] === 'function') {
          return argv.highlight[lang](code, lang);
        }
        return false;
      }),

      // map paths
      setOutputPath({
        input: argv.input,
        output: argv.output,
        isSingleFile: argv.isSingleFile,
        'asset-path': argv['asset-path']
      }),

      // merge metadata now that relative is set
      mergeMeta(argv.meta),

      // write as JSON
      writeAsJson()
  ]);
};
