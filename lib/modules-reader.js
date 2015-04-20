/**
 * @module reader for all angular.module('', []) definitions 
 *         with its dependencies from input buffer
 * @author k-makarov
 */
var _ = require('underscore');

var MODULES_REGEX = /angular\s*[.]module\s*[(]\s*'(.+)'\s*,\s*\[\s*([^(\[\])]*)\s*\]\s*[)]/g;

var ModulesReader = module.exports = function() {
	this._modules = [];
};

var parseModuleDependencies = function(str) {
	var dependencies = str.split(',');
	for (var i = dependencies.length - 1; i >= 0; i--) {
		dependencies[i] = dependencies[i].replace(/[']+/g, '').trim();
		if (!dependencies[i]) {
			dependencies.splice(i, 1);
			--i;
		}
	}
	return dependencies;
};

var getModuleWithSameTitle = function(module) {
	return _.find(this._modules, function(item) {
			return item.title == module.title;	
	});
};

/**
 * reader
 * @param  {Buffer} buffer   input buffer
 * @param  {String} encoding 
 * @return {Array}           array of all finded modules 
 */
ModulesReader.prototype.read = function(buffer, encoding) {
	encoding = encoding || 'utf-8';
	var content = buffer.toString(encoding);
	while (!!(match = MODULES_REGEX.exec(content))) {
		var module = {
			title: match[1]
		};
		if (!getModuleWithSameTitle(module)) {
			module.dependencies = parseModuleDependencies(match[2]);
			this._modules.push(module);
		}
	}
};

ModulesReader.prototype.getModules = function() {
	return this._modules;
};
