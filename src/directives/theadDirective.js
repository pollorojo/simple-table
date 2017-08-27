app.directive('simpleCols', [function()
{
    var rawCols = '';

    return {
        //E = element, A = attribute, C = class, M = comment
        restrict: 'E',
        require: '^^simpleTable',
        replace: true,
        transclude: true,
        controller: [function ColumnsController()
        {
            this.addColumn = function(key)
            {
                rawCols += '<td>{{item.'+key+'}}</td>';
            }
        }],
        compile: function(tElem, attrs) {
            return function(scope, elem, attrs, TableCtrl) {
                TableCtrl.render(rawCols);
            };
        },
        template: '<thead><tr ng-transclude></tr></thead>'
    }
}]);