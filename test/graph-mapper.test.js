var GraphMapper = require('../lib/graph-mapper'),
	GraphBuilder = require('../lib/graph-builder');

var graphMapper,
	graphBuilder,
	graph,
	mapResult;

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

describe('Graph mapper', function() {
	beforeEach(function() {
		graphMapper = new GraphMapper();
		graphBuilder = new GraphBuilder();
        var builderData = graphBuilder.build({
            modules: modulesStub,
            dot: 'ng-graph.dot',
        });
		mapResult = graphMapper.map(builderData.graph);
	});

	it('should map graph from graphviz fromat to d3.js friendly format', function() {
		expect(mapResult).toBeDefined();
	});

	it('should return graph with 5 nodes', function() {
		expect(mapResult.nodes.length).toBe(5);
	});

	it('should return graph with 8 links', function() {
		expect(mapResult.links.length).toBe(8);
	});
})