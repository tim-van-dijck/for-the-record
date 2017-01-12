angular.module('app.routes', [])

  .config(function ($stateProvider, $urlRouterProvider) {


    $stateProvider
      .state('tabs', {
        url: '/tabs',
        templateUrl: 'templates/tabsController.html',
        abstract: true,
        onEnter: function($state, UserService){
            if(!UserService.isLoggedIn()){
                console.log('boink!');
                $state.go('login');
            }
        }
      })

      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl',
        mustBeLoggedIn: false
      })

      .state('tabs.settings', {
        url: '/settings',
        mustBeLoggedIn: true,
          views: {
              'tab3': {
                  templateUrl: 'templates/settings.html',
                  controller: 'settingsCtrl as settings'
              }
          }
      })

      .state('tabs.record', {
        url: '/record',
        mustBeLoggedIn: true,
        views: {
          'tab2': {
            templateUrl: 'templates/record.html',
            controller: 'recordCtrl'
          }
        }
      })

      .state('tabs.newsfeed', {
        url: '/newsfeed',
        mustBeLoggedIn: true,
        views: {
          'tab1': {
            templateUrl: 'templates/newsfeed.html',
            controller: 'newsfeedCtrl'
          }
        }
      })

      .state('tabs.myMusic', {
        url: '/my-music',
        mustBeLoggedIn: true,
        views: {
          'tab2': {
            templateUrl: 'templates/myMusic.html',
            controller: 'myMusicCtrl as music'
          }
        }
      })

    $urlRouterProvider.otherwise(function($injector, $location) {
      var $state = $injector.get('$state');
      $state.go("tabs.myMusic");
    });
  });
