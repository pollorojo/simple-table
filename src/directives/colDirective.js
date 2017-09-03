app.directive('simpleCol', ['$compile', function($compile)
{
    return {
        //E = element, A = attribute, C = class, M = comment
        restrict: 'E',
        require: '^^simpleTable',
        replace: true,
        transclude: true,
        scope: {
            title: '@',
            key: '@',
            sort: '=?sort',
            filtro: '&'
        },
        compile: function(tElem, attrs) {
            return function(scope, elem, attrs, IndexController) {

                if (scope.$parent.$parent.ngSimpleProvider.useDefaultClasses()) {
                    scope.tcolumnClass = scope.$parent.$parent.ngSimpleProvider.getClassNameTableElement("table.thead.tr.th");
                }

                scope.sort = (angular.isUndefined(scope.sort)) ? true : scope.sort;

                var sortReverse = false;

                scope.changeOrder = function(key) {
                    sortReverse = (sortReverse!==true);
                    IndexController.setOrder(key, sortReverse);
                };

                scope.nombreColumna = angular.isUndefined(attrs.title) ? attrs.key : attrs.title;

                IndexController.addBodyColumn(attrs.key);
            };
        },
        template: '<th class="{{tcolumnClass}}">' +
            '<a href="" ng-if="(sort==true)" ng-click="changeOrder(key)">{{nombreColumna}}</a>' +
            '<span ng-if="(sort==false)">{{nombreColumna}}</span>' +
        '</th>'
    }
}]);