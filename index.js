var through = require('through2'),
    gutil = require('gulp-util'),
    ModulesReader = require('./lib/modules-reader'),
    GraphBuilder = require('./lib/graph-builder'),
    GraphVisualizer = require('./lib/graph-visualizer');

module.exports = function(options) {
    var modulesReader;
    var graphBuilder;
    var graphVisualizer;

    options = options || {};
    if (!modulesReader) {
        modulesReader = new ModulesReader();
    }
    if (!graphBuilder) {
        graphBuilder = new GraphBuilder();
    }
    if (!graphVisualizer) {
        graphVisualizer = new GraphVisualizer();
    }

    function bufferContents(file, enc, callback) {
        if (file.isStream()) {
            this.emit('error', new gutil.PluginError('gulp-ng-graph', 'Streams are not supported!'));
            return callback();
        }
        if (file.isBuffer()) {
            modulesReader.read(file.contents, enc);
        }
        callback();
    }

    function endStream(callback) {
        var modules = modulesReader.getModules();
        if (!modules || !modules.length) {
            return;
        }
        var builderData = graphBuilder.build({
            modules: modules,
            dot: options.dot || 'ng-graph.dot',
        });
        var htmlFile = graphVisualizer.render({
            graph: builderData.graph,
            html: options.html || 'ng-graph.html',
        });
        this.push(builderData.dotFile);
        this.push(htmlFile);
        callback();
    }

    return through.obj(bufferContents, endStream);
};