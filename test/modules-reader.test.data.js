angular.module('module1', []);
angular.module('module2', ['module1']);
angular.module('module1').directive();
angular.module('module3', ['module1', 'module2']);

angular.module('module4', [
		'module1',
		'module2',
		'module3'
	]);

angular.module('module5', 
	[
		'module1',
		'module2'
	]);

angular.module('notIncludedModule1').controller();
angular.module('notIncludedModule2', [);
angular.module('notIncludedModule3', ]);
angular.module('notIncludedModule4', [
		'module1',
		'module2'
	);