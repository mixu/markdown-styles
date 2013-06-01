module.exports = {
  tasks: {
    applyTemplate: require('./file-tasks/apply-template.js'),
    convertMarkdown: require('./file-tasks/convert-markdown.js'),
    annotateBasepath: require('./list-tasks/annotate-basepath.js'),
    annotateStructured: require('./list-tasks/annotate-structured.js'),
    annotateInputOutputPaths: require('./list-tasks/annotate-input-output-paths.js'),
    mkdirOutputStructured: require('./list-tasks/mkdir-output-structured.js'),
    copyAssets: require('./misc-tasks/copy-assets.js'),
    mergeHash: require('./misc-tasks/merge-hash.js')
  },
  ext: {
    ncp: require('ncp').ncp,
    mkdirp: require('mkdirp'),
    marked: require('marked'),
    minitask: require('minitask')
  },
  runner: require('./runner.js')
};
