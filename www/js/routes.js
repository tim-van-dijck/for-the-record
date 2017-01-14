angular.module('app.routes', [])

  .config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider


      .state('tabs.newsfeed', {
        url: '/newsfeed',
        views: {
          'tab1': {
            templateUrl: 'templates/newsfeed.html',
            controller: 'newsfeedCtrl'
          }
        }
      })

      .state('tabs.myMusic', {
        url: '/my-music',
        views: {
          'tab2': {
            templateUrl: 'templates/myMusic.html',
            controller: 'myMusicCtrl as music'
          }
        }
      })

      .state('tabs.following', {
        url: '/following',
        views: {
          'tab3': {
            templateUrl: 'templates/following.html',
            controller: 'followingCtrl'
          }
        }
      })

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
        controller: 'loginCtrl'
      })

      .state('logout', {
        url: '/logout',
        controller: 'logoutCtrl'
      })

      .state('tabs.settings', {
        url: '/settings',
          views: {
              'tab3': {
                  templateUrl: 'templates/settings.html',
                  controller: 'settingsCtrl as settings'
              }
          }
      })

      .state('tabs.profile', {
        url: '/profile',
        views: {
          'tab3': {
            templateUrl: 'templates/profile.html',
            controller: 'profileCtrl'
          }
        }
      })

      .state('tabs.record', {
        url: '/record/:id',
        views: {
          'tab2': {
            templateUrl: 'templates/record.html',
            controller: 'recordCtrl as record'
          }
        }
      })

    $urlRouterProvider.otherwise('/tabs/newsfeed')
  });
