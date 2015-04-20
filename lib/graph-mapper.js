/**
 * @module mapper for graph object
 * @author k-makarov
 */
var _ = require('underscore');

var GraphMapper = module.exports = function() {};

var mapNodes = function(source) {
	var nodes = [];
	for(var key in source.items) {
		if (!source.items.hasOwnProperty(key)) {
			return;
		}
		nodes.push({
			name: key
		});
	}
	return nodes;
};

var mapLinks = function(source, nodes) {
	var links = [];
	_.each(source, function(sourceLink) {
		var sourceIndex = _.findIndex(nodes, { name: sourceLink.nodeOne.id });
		var targetIndex = _.findIndex(nodes, { name: sourceLink.nodeTwo.id });
		links.push({
			source: sourceIndex,
			target: targetIndex,
		});
	});
	return links;
};

/**
 * maps graph from graphviz format to d3.js force-friendly graph
 * @param  {Graphviz} source graph in graphviz format
 * @return {Object}          d3.js force-friendly graph
 */
GraphMapper.prototype.map = function(source) {
	var nodes = mapNodes(source.nodes);
	var links = mapLinks(source.edges, nodes);
	var graph = {
		nodes: nodes,
		links: links
	};
	return graph;
};
