/**
 *
 * @param cantidadPaginas
 * @param selected
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
                    '<table class="{{tableClass}}">' +
                        '<thead><tr ng-transclude></tr></thead>' +
                        '<tbody simple-body="htmlTbodyColumns"></tbody>' +
                    '</table>' +
                  '</div>',
        controller: ['$scope', '$element', function TableController($scope, $element)
        {
            $scope.collection = $scope.ngSimpleProvider.obtenerPaginaInicio();

            var cantidadPaginas = $scope.ngSimpleProvider.obtenerCantidadPaginas(),
            paginaInicio = $scope.ngSimpleProvider.obtenerPaginaActual();
            $element.append($compile(renderPagination(cantidadPaginas, paginaInicio))($scope));

            //Eventos
            $scope.ngSimpleProvider.registrarEscucha($scope);

            $scope.$on("filtrado", function (ev, collection) {
                $scope.collection = collection;
            });

            $scope.$on("paginado", function (ev, paginas, selected) {
                $element.children()[1].remove();
                $element.append($compile(renderPagination(paginas, selected))($scope));
            });

            /**
             * Cambiar de pagina
             *
             * @param page
             */
            $scope.paginate = function(page){
                $scope.collection = $scope.ngSimpleProvider.irPagina(page);

                var nav = $element.children()[1];
                angular.element(nav.querySelector('li.active')).removeClass('active');

                var li = $element.find('li')[page-1];
                angular.element(li).addClass('active');
            };

            $scope.htmlTbodyColumns = '';
            /**
             *
             * @param key
             */
            this.addBodyColumn = function(key) {
                $scope.htmlTbodyColumns += '<td>{{item.'+key+'}}</td>';
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
        }]
    }
}]);