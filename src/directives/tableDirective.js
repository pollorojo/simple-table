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
            'class': '@',
            'source': '=',
            'ngSimpleProvider': '='
        },
        template: '<div>' +
                    '<table class="{{tableClass}}">' +
                        '<thead class="{{theadClass}}"><tr ng-transclude class="{{theadRowClass}}"></tr></thead>' +
                        '<tbody class="{{tbodyClass}}" simple-body="htmlTbodyColumns"></tbody>' +
                    '</table>' +
                  '</div>',
        controller: ['$scope', '$element', function TableController($scope, $element)
        {
            var vm = this;

            $element[0].className = '';

            //Clases de tabla
            if (angular.isDefined($scope.class) && $scope.ngSimpleProvider.useDefaultClasses() === false) {
                if ($scope.class.length > 0) {
                    $scope.tableClass = $scope.class;
                }
            } else {
                $scope.tableClass    = getClassName("table");
                $scope.theadClass    = getClassName("table.thead");
                $scope.theadRowClass = getClassName("table.thead.tr");
                $scope.tbodyClass    = getClassName("table.tbody");
                $scope.trowClass     = getClassName("table.tbody.tr");
                $scope.tbodyTdClass  = getClassName("table.tbody.tr.td");
            }

            /**
             *
             * @param name
             * @returns {string}
             */
            function getClassName(name) {
                return $scope.ngSimpleProvider.getClassNameTableElement(name);
            }


            //Eventos
            $scope.ngSimpleProvider.registrarEscucha($scope);

            $scope.collection = $scope.ngSimpleProvider.obtenerPaginaInicio();

            var cantidadPaginas = $scope.ngSimpleProvider.obtenerCantidadPaginas(),
            paginaInicio = $scope.ngSimpleProvider.obtenerPaginaActual();
            $element.append($compile(renderPagination(cantidadPaginas, paginaInicio))($scope));

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
                $scope.htmlTbodyColumns += '<td class="{{tbodyTdClass}}">{{item.'+key+'}}</td>';
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