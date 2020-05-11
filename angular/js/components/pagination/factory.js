
'use strict';

angular.module('myApp')
.factory('pagination',function(){
    var pagination={
        maxSize:10,
        bigTotalItems:100,
        bigCurrentPage:1,
        setPage:function(){
            console.log('page changed by input',_scope.tempBigCurrentPage);
            _scope.tempBigCurrentPage=Math.floor(Number(_scope.tempBigCurrentPage));
            if(_scope.tempBigCurrentPage<=_scope.numPages && _scope.tempBigCurrentPage>=1){
                console.log('page changed level2',_scope.tempBigCurrentPage);
                _scope.bigCurrentPage=_scope.tempBigCurrentPage;
            }
            _scope.tempBigCurrentPage='';
        }
    };
    var _scope;
    return{
        init:function(scope,bigTotalItems,bigCurrentPage){
            pagination.bigTotalItems=bigTotalItems||pagination.bigTotalItems;
            pagination.bigCurrentPage=bigCurrentPage||pagination.bigCurrentPage;
            pagination.numPages=Math.ceil(pagination.bigTotalItems/pagination.maxSize);
            _scope=scope;
            return _.extend(scope,pagination);
        },
    };
})
