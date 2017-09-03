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