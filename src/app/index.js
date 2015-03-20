'use strict';

angular.module('kkrdashboard', ['ngAnimate', 'ngCookies', 'ngResource', 'ui.router', 'ui.bootstrap', 'smart-table', 'stpa.morris', 'ngGrid', 'ng-fusioncharts'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        controllerAs: 'ctrl'
      })
      .state('snap', {
        url: '/snap',
        templateUrl: 'app/main/sidebar.html',
        controller: 'AccordionDemoCtrl',
        controllerAs: 'ctrl'
      })
      .state('chart', {
        url: '/chart',
        templateUrl: 'app/main/chart.html',
        controller: 'ChartCtrl',
        controllerAs: 'ctrl'
      })
      .state('chartCreate', {
        url: '/chart/create',
        templateUrl: 'app/main/chartCreate.html',
        controller: 'ChartCtrl',
        controllerAs: 'ctrl'
      });

    $urlRouterProvider.otherwise('/');
  })
;
