
(function () {

    var run = function () {    };
    var mod = angular.module('activities', []);
    mod.directive("activities", function () {
        return {
            restrict: "A"//E for element
            , replace: false
            , templateUrl: GlobalContext.getTemplateUrl('Activities/Templates/sheduler.html')
            , link: function (scope, element, attrs) {
                var e = element[0];
                var ASheduler = new ActivitySheduler('activities_scheduler', new Date(), 'week', 'angular');
                ASheduler.Init();
            }
        };
    });
//    mod.config(configuration).run([run]);
})();
//но зачем это нужно в window? :C
function EnterGo(e, fun) {
    if (e.keyCode == "13") {
        if (fun != undefined) {
            fun();
        }
        //scheduler.ShearchActivity();
    }
}