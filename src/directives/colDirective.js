app.directive('simpleCol', ['$compile', function($compile)
{
    return {
        //E = element, A = attribute, C = class, M = comment
        restrict: 'E',
        require: ['^^simpleCols','^^simpleTable'],
        replace: true,
        transclude: true,
        scope: {
            title: '@',
            key: '&',
            filtro: '&'
        },
        compile: function(tElem, attrs) {
            return function(scope, elem, attrs, Controllers) {

                var thContent,
                    sortReverse = false,
                    ColsController = Controllers.shift(),
                    TableController = Controllers.shift();

                scope.changeOrder = function(key) {
                    sortReverse = (sortReverse!==true);
                    TableController.setOrder(key, sortReverse);
                };

                var nombreColumna = angular.isUndefined(attrs.title) ? attrs.key : attrs.title;

                if (angular.isUndefined(scope.filter)) {
                    thContent = $compile('<a href="" ng-click="changeOrder(key)">'+nombreColumna+'</a>')(scope);
                } else {
                    thContent = nombreColumna;
                }

                elem.append( thContent );

                ColsController.addColumn(attrs.key);
            };
        },
        template: '<th></th>'
    }
}]);