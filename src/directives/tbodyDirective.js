app.directive('simpleBody', ['$compile',function($compile)
{
    return {
        //E = element, A = attribute, C = class, M = comment
        restrict: 'A',
        require: '^^simpleTable',
        replace: false,
        scope: {},
        link: function(scope, element){
            element.html( '<tr ng-repeat="item in collection">'+scope.$parent.htmlTbodyColumns+'</tr>' );
            $compile(element.contents())(scope.$parent);
        }
    }
}]);