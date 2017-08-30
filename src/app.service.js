app.service('Simplero', ['orderByFilter', function(orderBy) {
    var self = this,
        originalCollection,
        temporalCollection,
        config = {
            paginaInicio: 1,
            itemsPorPagina: 5
        },
        paginaActual = null,
        listener;

    this.filtro = function(filter)
    {
        temporalCollection = (filter)(originalCollection);

        var paginas = this.obtenerCantidadPaginas(temporalCollection);

        paginaCorrecta = (this.obtenerPaginaActual() > paginas) ? 1 : this.obtenerPaginaActual();

        var collection = this.irPagina(paginaCorrecta);

        listener.$broadcast('paginado', paginas, paginaCorrecta);
        listener.$broadcast('filtrado', collection);
    };

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
        return paginaActual = (paginaActual === null) ? config.paginaInicio : paginaActual;
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

    this.registrarEscucha = function (scope)
    {
        listener = scope;
    };

    this.resetear = function()
    {
        temporalCollection = originalCollection;

        var paginas = this.obtenerCantidadPaginas(temporalCollection);
        paginaActual = 1;

        var collection = this.irPagina(paginaActual);

        listener.$broadcast('paginado', paginas, paginaActual);
        listener.$broadcast('filtrado', collection);
    };

    return function(params){
        if (params.hasOwnProperty('collection')) {
            temporalCollection = originalCollection =  params.collection;
        }

        if (params.hasOwnProperty('config')) {
            config = angular.extend(config, params.config);
        }

        return self;
    };
}]);