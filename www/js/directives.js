angular.module('SvgMapApp').directive('svgMap', ['$compile', function ($compile) {
    return {
        restrict: 'A',
        templateUrl: 'js/map/Labelled_US_map.svg',
        link: function (scope, element, attrs) {
            var regions = element[0].querySelectorAll('.state');
            angular.forEach(regions, function (path, key) {
                var regionElement = angular.element(path);
                regionElement.attr("region", "");
                $compile(regionElement)(scope);
            })
        }
    }
}]);

angular.module('SvgMapApp').directive('region', ['$compile', function ($compile) {
    return {
        restrict: 'A',
        scope: true,
        link: function (scope, element, attrs) {
            scope.elementId = element.attr("id");
            scope.regionClick = function () {
                scope.ons.navigator.pushPage('state-shelters.html', { state : scope.elementId });
            };

            var color = ['#229E58', 'blue', 'yellow', 'orange', 'pink'];
            var i = Math.floor(5*Math.random());

            element.attr("ng-click", "regionClick()");
            element.attr("fill", color[i]);
            element.removeAttr("region");
            $compile(element)(scope);
        }
    }
}]);