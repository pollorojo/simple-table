/*
 * Simple Table
 * https://github.com/pollorojo/simple-table
 * @license MIT
 * vundefined
 */
(function (window, angular, undefined) {
'use strict';

var app = angular.module('ngSimpleTable', []);
app.provider('ngSimpleTable', [function(){
    this.$get = ['Simplero', function(Simplero){
        return Simplero;
    }];
}]);
app.service('Simplero', ['orderByFilter', function(orderBy) {
    var self = this,
        originalCollection = [],
        temporalCollection = [],
        config = {
            paginaInicio: 1,
            itemsPorPagina: 10,
            defaultClasses: true
        },
        classes = {
            "table": "ng-simple-table",
            "table.thead": "ng-simple-head",
            "table.thead.tr": "ng-simple-row",
            "table.thead.tr.th": "ng-simple-column",
            "table.tbody": "ng-simple-body",
            "table.tbody.tr": "ng-simple-row",
            "table.tbody.tr.td": "ng-simple-cell"
        },
        paginaActual = null,
        listener;

    /**
     *
     * @param filter
     */
    this.filtro = function(filter)
    {
        temporalCollection = (filter)(originalCollection);

        actualizar(temporalCollection);
    };

    function actualizar(paramCollection)
    {
        var paginas = self.obtenerCantidadPaginas(paramCollection);

        var paginaCorrecta = (self.obtenerPaginaActual() > paginas) ? 1 : self.obtenerPaginaActual();

        var collection = self.irPagina(paginaCorrecta);

        if (angular.isUndefined(listener) === false) {
            listener.$broadcast('paginado', paginas, paginaCorrecta);
            listener.$broadcast('filtrado', collection);
        }
    }

    /**
     *
     * @returns {string}
     */
    this.getServiceName = function() {
        return 'Simplero';
    };

    /**
     *
     * @returns {number}
     */
    this.obtenerCantidadPaginas = function(customCollection) {
        var collection;

        if (!angular.isUndefined(customCollection)) {
            collection = customCollection;
        } else {
            collection = originalCollection;
        }

        return Math.ceil((collection.length / config.itemsPorPagina));
    };

    /**
     *
     * @param key
     * @param reverse
     */
    this.obtenerListaOrdenada = function(key, reverse) {
        temporalCollection = orderBy(temporalCollection, key, reverse);
        return this.irPagina(this.obtenerPaginaActual());
    };

    /**
     *
     * @returns {number}
     */
    this.obtenerPaginaActual = function()
    {
        paginaActual = (paginaActual === null) ? config.paginaInicio : paginaActual;
        var paginasTotales = this.obtenerCantidadPaginas();

        return (paginaActual > paginasTotales) ? 1 : paginaActual;
    };

    /**
     *
     * @returns {Array.<T>|string|Blob|ArrayBuffer}
     */
    this.obtenerPaginaInicio = function() {
        var desde = (this.obtenerPaginaActual() - 1) * config.itemsPorPagina,
            hasta = desde + config.itemsPorPagina;

        return temporalCollection.slice(desde, hasta);
    };

    /**
     *
     * @param page
     * @returns {Array.<T>|string|Blob|ArrayBuffer}
     */
    this.irPagina = function(page)
    {
        paginaActual = page;
        var desde = (page===1) ? 0 : (page - 1) * config.itemsPorPagina,
            hasta = (desde + config.itemsPorPagina);

        return temporalCollection.slice(desde, hasta);
    };

    /**
     *
     * @param scope
     */
    this.registrarEscucha = function (scope)
    {
        listener = scope;
    };

    /**
     *
     */
    this.resetear = function()
    {
        temporalCollection = originalCollection;

        var paginas = this.obtenerCantidadPaginas(temporalCollection);
        paginaActual = 1;

        var collection = this.irPagina(paginaActual);

        listener.$broadcast('paginado', paginas, paginaActual);
        listener.$broadcast('filtrado', collection);
    };

    this.isValidCollection = function(collection) {
        return angular.isArray(collection);
    };

    this.setCollection = function(collection)
    {
        var result = false;

        if (this.isValidCollection(collection)) {
            temporalCollection = originalCollection = collection;
            actualizar(temporalCollection);
            result = true;
        }

        return result;
    };

    /**
     *
     * @param elementName
     * @returns {string}
     */
    this.getClassNameTableElement = function(elementName)
    {
        var value = null;

        if (classes.hasOwnProperty(elementName)) {
            value = classes[elementName];
        }

        return value;
    };

    /**
     *
     * @returns {boolean}
     */
    this.useDefaultClasses = function ()
    {
        return config.defaultClasses;
    };

    /**
     *
     */
    return function(params)
    {
        self.setCollection(params.collection);

        if (params.hasOwnProperty('config')) {
            //Uso de clases por defecto.
            if (params.config.hasOwnProperty('defaultClasses')) {
                if (typeof params.config.defaultClasses !== 'boolean') {
                    params.config.defaultClasses = config.defaultClasses;
                }
            }

            config = angular.extend(config, params.config);
        }

        if (params.hasOwnProperty('classes')) {
            classes = angular.extend(classes, params.classes);
        }

        return self;
    };
}]);
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
app.directive('simpleBody', ['$compile',function($compile)
{
    return {
        //E = element, A = attribute, C = class, M = comment
        restrict: 'A',
        require: '^^simpleTable',
        replace: false,
        scope: {},
        link: function(scope, element){
            element.html( '<tr ng-repeat="item in collection" class="{{trowClass}}">'+scope.$parent.htmlTbodyColumns+'</tr>' );
            $compile(element.contents())(scope.$parent);
        }
    }
}]);

})(window, angular);