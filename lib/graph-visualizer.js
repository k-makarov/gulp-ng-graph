/**
 * @module visualize graph in html format
 * @author k-makarov
 */
var Vinyl = require('vinyl'),
    jade = require('jade'),
    path = require('path'),
    fs = require('fs'),
    GraphMapper = require('./graph-mapper');

var graphMapper;

var Graphvisualualizer = module.exports = function() {
    graphMapper = new GraphMapper();
};

/**
 * renders html file from input graph
 * @param  {Object} options :
*          {Graphviz} graph rendered by graphviz package
*          {String}   html name of html file
 * @return {Vinyl}         html file as Vinyl object
 */
Graphvisualualizer.prototype.render = function(options) {
    options = options || {};
    var graph = graphMapper.map(options.graph);
    var template = fs.readFileSync(path.join(__dirname, 'graph.jade')).toString();
    var html = jade.render(template, {
    	model: {
			graph: JSON.stringify(graph),
    	}
    });
    var htmlFile = new Vinyl({
        path: options.html,
        contents: new Buffer(html)
    });
    return htmlFile;
};
