(function () {
    angular.module('routes', [])
        .service('RoutesService', function () {

            var Debug = window;
            var serverUrls = getServerUrls();
            var serverMvcUrls = getServerMvcUrls();

            var createParam = function (name, value) {
                if (_.isArray(value)) {
                    return createArrayParam(name, value);
                }
                return name + '=' + value;
            };

            var createArrayParam = function (name, value) {
                return _.map(value, function (item) {
                    return name + '=' + item;
                }).join('&');
            };

            var createProcessFunction = function (controller, action) {
                var prefix, route;
                if (controller.RoutePrefix) {
                    prefix = controller.RoutePrefix;
                }
                if (action.Routes.length) {
                    route = action.Routes[0].Route;
                } else {
                    route = action.Name;
                }
                var url;
                if (route.charAt(0) === '~') {
                    url = route.substring(1);
                } else if (prefix) {
                    url = "/" + prefix + "/" + route;
                } else {
                    url = '/' + route;
                }
                return function (params) {
                    var innerUrl = url;
                    var message = "Creating url by controller " + controller.Name + " and action " + action.Name + " by template url " + innerUrl + ". ";
                    var resultUrl = process(innerUrl, params);
                    message += "Resulted url " + resultUrl;
                    //Debug.console.info(message);
                    resultUrl = addRootUrl(resultUrl);
                    return { url: resultUrl, method: action.Method };
                };
            };

            var addRootUrl = function(url) {
                if (url.charAt(0) === '/') {
                    url = url.substring(1);
                }
                return GlobalContext.getRootUrl() + url;
            };

            var process = function (url, params) {
                var innerUrl = url;
                var notFoundParams = [];
                for (var key in params) {
                    var value = params[key];
                    var regextText = "({" + key + "})|({" + key + ":[^}]*})";
                    var regexp = new RegExp(regextText, "g");
                    var inUrl = regexp.exec(url);
                    if (!inUrl) {
                        notFoundParams.push({ key: key, value: value });
                        continue;
                    }
                    innerUrl = innerUrl.replace(regexp, value);
                }
                if (notFoundParams.length) {
                    innerUrl += "?";
                }
                var urlParams = [];
                for (var i = 0; i < notFoundParams.length; i++) {
                    var param = notFoundParams[i];
                    urlParams.push(createParam(param.key, param.value));
                    Debug.console.warn("Transmitted parameter '" + param.key + "' with value '" + param.value + "', but it is missing in the definition url: " + url);
                }
                innerUrl += urlParams.join("&");

                var validateRegexpWithoutParameters = new RegExp("{([^}}]*)}", "g");
                var currentRes;
                while ((currentRes = validateRegexpWithoutParameters.exec(innerUrl)) !== null) {
                    Debug.console.warn("Expected parameter '" + currentRes[1] + "' in the definition url: " + url);
                }
                return innerUrl;
            };
            var createRoutes = function (urls) {
                var controllers = {};
                for (var i = 0; i < urls.length; i++) {
                    var controller = urls[i];
                    controllers[controller.Name] = {};
                    for (var j = 0; j < controller.Actions.length; j++) {
                        var action = controller.Actions[j];
                        controllers[controller.Name][action.Name] = {
                            createUrl: createProcessFunction(controller, action)
                        };
                    }
                    controllers[controller.Name].root = '/' + controller.RoutePrefix;
                }
                return controllers;
            };
            var inner = createRoutes(serverUrls);
            var innerMvc = createRoutes(serverMvcUrls);

            var routeCreateContext = function (routes) {
                return function (controller, action, params) {
                    if (!routes[controller]) {
                        console.error('Controller ' + controller + ' does not exist');
                        return null;
                    }
                    if (!routes[controller][action]) {
                        console.error('Action ' + action + ' not found in ' + controller + ' controller');
                        return null;
                    }
                    return routes[controller][action].createUrl(params);
                }
            }

            this.create = routeCreateContext(inner);

            this.createMvc = routeCreateContext(innerMvc);

            this.process = process;

            this.routes = inner;
            this.mvcRoutes = innerMvc;
        });
})();