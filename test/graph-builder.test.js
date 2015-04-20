var GraphBuilder = require('../lib/graph-builder');

var graphBuilder,
    builderData;

var modulesStub = [{
    title: 'module1',
    dependencies: []
}, {
    title: 'module2',
    dependencies: ['module1']
}, {
    title: 'module3',
    dependencies: ['module1', 'module2']
}, {
    title: 'module4',
    dependencies: ['module1', 'module2', 'module3']
}, {
    title: 'module5',
    dependencies: ['module1', 'module2']
}];

describe('Modules graph builder', function() {
  beforeEach(function() {
        graphBuilder = new GraphBuilder();
        builderData = graphBuilder.build({
            modules: modulesStub,
            dot: 'ng-graph.dot',
        });
    });

    it('should return .dot file and graph object in graphviz format', function() {
    	expect(builderData.dotFile).toBeDefined();
		expect(builderData.graph).toBeDefined();
    	expect(builderData.graph.nodes.length).toBeGreaterThan(0);
    });

	it('should build correct .dot file', function() {
    	var dotFileContent = builderData.dotFile.contents.toString();
    	expect(dotFileContent.indexOf('digraph ngGraph')).toBeGreaterThan(-1);
    	expect(dotFileContent.indexOf('"module2" -> "module1"')).toBeGreaterThan(-1);
    	expect(dotFileContent.indexOf('"module3" -> "module1"')).toBeGreaterThan(-1);
    	expect(dotFileContent.indexOf('"module3" -> "module2"')).toBeGreaterThan(-1);
    	expect(dotFileContent.indexOf('"module3" -> "module4"')).toBe(-1);
    	expect(dotFileContent.indexOf('"module3" -> "module5"')).toBe(-1);
    	expect(dotFileContent.indexOf('"module4" -> "module1"')).toBeGreaterThan(-1);
    	expect(dotFileContent.indexOf('"module4" -> "module2"')).toBeGreaterThan(-1);
    	expect(dotFileContent.indexOf('"module4" -> "module3"')).toBeGreaterThan(-1);
    	expect(dotFileContent.indexOf('"module4" -> "module5"')).toBe(-1);
	});

    it('should return graph with 5 nodes', function() {
    	expect(builderData.graph.nodes.length).toBe(5);
    });

    it('should return graph with 8 edges', function() {
    	expect(builderData.graph.edges.length).toBe(8);
    });
});
