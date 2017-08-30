app.provider('ngSimpleTable', [function(){
    this.$get = ['Simplero', function(Simplero){
        return Simplero;
    }];
}]);