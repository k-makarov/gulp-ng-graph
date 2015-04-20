/**
 * @module graph builder
 * @author k-makarov
 */
var Vinyl = require('vinyl'),
	graphviz = require('graphviz');

var GraphBuilder = module.exports = function() {};	

var addDependencies = function(module, graph) {
	for (var i = module.dependencies.length - 1; i >= 0; i--) {
		graph.addEdge(module.node, module.dependencies[i]);
	}
};

/**
 * build graph object in graphviz format and render .dot file
 * @param  {Object} options 
 * @return {Object}         returns dotFile as Vinyl object and graph object in graphviz format
 */
GraphBuilder.prototype.build = function(options) {
	options = options || {};
	var graph = graphviz.digraph('ngGraph');
	for (var i = options.modules.length - 1; i >= 0; i--) {
		options.modules[i].node = graph.addNode(options.modules[i].title);
	}
	for (i = options.modules.length - 1; i >= 0; i--) {
		addDependencies(options.modules[i], graph);
	}
	var data = {
		dotFile: new Vinyl({
			path: options.dot,
			contents: new Buffer(graph.to_dot())
		}),
		graph: graph
	};
	return data;
};
