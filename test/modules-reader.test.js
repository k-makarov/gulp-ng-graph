var ModulesReader = require('../lib/modules-reader'),
    path = require('path'),
	fs = require('fs'),
	_ = require('underscore');

var reader,
	readerBuffer;

describe('Angular modules reader', function() {
	beforeEach(function() {
		reader = new ModulesReader();
		testData = fs.readFileSync(path.join(__dirname, 'modules-reader.test.data.js'), {
			encoding: 'utf-8'
		});
		readerBuffer = new Buffer(testData);
		reader.read(readerBuffer, 'utf-8');
	});

	it('must read all defined modules from buffer', function() {
		var modules = reader.getModules();
		expect(modules.length).toBe(5);
	});

	it('must read module1 with no dependencies', function() {
		var modules = reader.getModules();
		var module = _.find(modules, function(module) {
			return module.title === 'module1';
		});
		expect(module.dependencies.length).toBe(0);
	});

	it('must read module2 with 1 dependencies: module1', function() {
		var modules = reader.getModules();
		var module = _.find(modules, function(module) {
			return module.title === 'module2';
		});
		expect(module.dependencies.length).toBe(1);
		expect(module.dependencies[0]).toBe('module1');
	});

	it('must read module3 with 2 dependencies: module1, module2', function() {
		var modules = reader.getModules();
		var module = _.find(modules, function(module) {
			return module.title === 'module3';
		});
		expect(module.dependencies.length).toBe(2);
		expect(module.dependencies[0]).toBe('module1');
		expect(module.dependencies[1]).toBe('module2');
	});

	it('must read module4 with 3 dependencies: module1, module2, module3', function() {
		var modules = reader.getModules();
		var module = _.find(modules, function(module) {
			return module.title === 'module4';
		});
		expect(module.dependencies.length).toBe(3);
		expect(module.dependencies[0]).toBe('module1');
		expect(module.dependencies[1]).toBe('module2');
		expect(module.dependencies[2]).toBe('module3');
	});

	it('must no read bad-defined modules', function() {
		var modules = reader.getModules();
		expect(_.find(modules, function(module) {
			return module.title === 'notIncludedModule1';
		})).toBeUndefined();
		expect(_.find(modules, function(module) {
			return module.title === 'notIncludedModule2';
		})).toBeUndefined();
		expect(_.find(modules, function(module) {
			return module.title === 'notIncludedModule3';
		})).toBeUndefined();
		expect(_.find(modules, function(module) {
			return module.title === 'notIncludedModule4';
		})).toBeUndefined();
	});

});
