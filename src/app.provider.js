app.provider('ngSimpleTable', [function(){
    console.log('Provider simpletable!');

    this.$get = ['Simplero', function(Simplero){
        console.log("Provider FN");
        return Simplero;
    }];
}]);