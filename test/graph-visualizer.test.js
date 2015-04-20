var GraphVisualizer = require('../lib/graph-visualizer');

var graphVisualizer,
	htmlResult;

var graphStub = {
    nodes: [{
        name: 'module5'
    }, {
        name: 'module4'
    }, {
        name: 'module3'
    }, {
        name: 'module2'
    }, {
        name: 'module1'
    }],
    links: [{
        source: 0,
        target: 3
    }, {
        source: 0,
        target: 4
    }, {
        source: 1,
        target: 2
    }, {
        source: 1,
        target: 3
    }, {
        source: 1,
        target: 4
    }, {
        source: 2,
        target: 3
    }, {
        source: 2,
        target: 4
    }, {
        source: 3,
        target: 4
    }]
};

describe('Graph visualizer', function() {
	beforeEach(function() {
		graphVisualizer = new GraphVisualizer();
        htmlResult = graphVisualizer.render({
            graph: graphStub,
            html: 'ng-graph.html',
        });
	});

	it('should render html file', function() {
		expect(htmlResult).toBeDefined();
		var htmlContent = htmlResult.contents.toString();
		expect(htmlContent.indexOf('<html>')).toBeGreaterThan(-1);
	});

});
