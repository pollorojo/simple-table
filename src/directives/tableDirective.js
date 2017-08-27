/**
 *
 * @param cantidadPaginas
 * @returns {*|Object}
 */
function renderPagination(cantidadPaginas, selected) {
    var paginator = angular.element('<nav aria-label="Page navigation">' +
        '<ul class="pagination"></ul>' +
        '</nav>');

    for (var i=1; i<=cantidadPaginas; i++) {
        paginator.children('ul').append( '<li ng-class="{ active: ('+i+'==='+selected+') }"><a href="#" ng-click="paginate('+i+')">'+i+'</a></li>' );
    }

    return paginator;
}

app.directive('simpleTable', ['$compile', function($compile) {
    return {
        replace: true,
        restrict: 'E',
        transclude: true,
        scope: {
            'tableClass': '@',
            'source': '=',
            'ngSimpleProvider': '='
        },
        template: '<div>' +
                    '<table class="{{tableClass}}" ng-transclude>' +
                    '</table>' +
                  '</div>',
        controller: ['$scope', '$element', function TableController($scope, $element)
        {
            $scope.collection = $scope.ngSimpleProvider.obtenerPaginaInicio();

            //Eventos
            $scope.ngSimpleProvider.registrarEscucha($scope);

            $scope.$on("filtrado", function (ev, collection) {
                $scope.collection = collection;
            });

            $scope.$on("paginado", function (ev, paginas, selected) {
                $element.next('nav').remove();
                $element.after($compile(renderPagination(paginas, selected))($scope));
            });

            /**
             * Cambiar de pagina
             *
             * @param page
             */
            $scope.paginate = function(page){
                $scope.collection = $scope.ngSimpleProvider.irPagina(page);

                $element.next('nav').children('ul').children('li.active').removeClass('active');
                var li = $element.next('nav').children('ul').children('li')[page-1];
                angular.element(li).addClass('active');
            };

            /**
             * Cambiar orden de columnas
             *
             * @param key
             * @param reverse
             */
            this.setOrder = function(key, reverse) {
                $scope.collection = $scope.ngSimpleProvider.obtenerListaOrdenada(key, reverse);
            };

            this.render = function(tContent)
            {
                var paginacion = renderPagination($scope.ngSimpleProvider.obtenerCantidadPaginas(), 1),
                    tBody      = $compile('<tbody><tr ng-repeat="item in collection">'+tContent+'</tr></tbody>')($scope);

                $element.children('table').append(tBody);
                $element.after( $compile(paginacion)($scope) );
            };
        }]
    }
}]);