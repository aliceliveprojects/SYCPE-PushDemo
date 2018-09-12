console.log("main.module.js invoked");
(function() {
  'use strict';

  angular
    .module('main', [
//      'ionic'
    ])
    .config(function($stateProvider){
      $stateProvider
        .state('main', {
          url: '/main',
          resolve: {
          },
          templateUrl: 'scripts/main/main.html',
          controller: 'mainCtrl as vm'
        });
    });
})();
