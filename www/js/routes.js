angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

      // Ionic uses AngularUI Router which uses the concept of states
      // Learn more here: https://github.com/angular-ui/ui-router
      // Set up the various states which the app can be in.
      // Each state's controller can be found in controllers.js
      $stateProvider



    .state('tabsController.newsfeed', {
        url: '/newsfeed',
        views: {
            'tab1': {
                templateUrl: 'templates/newsfeed.html',
                controller: 'newsfeedCtrl'
            }
        }
    })

    .state('tabsController.myMusic', {
        url: '/my-music',
        views: {
            'tab2': {
                templateUrl: 'templates/myMusic.html',
                controller: 'myMusicCtrl'
            }
        }
    })

    .state('tabsController.following', {
        url: '/following',
        views: {
            'tab3': {
                templateUrl: 'templates/following.html',
                controller: 'followingCtrl'
            }
        }
    })

    .state('tabsController', {
        url: '/page1',
        templateUrl: 'templates/tabsController.html',
        abstract:true
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

    .state('tabsController.profile', {
        url: '/profile',
        views: {
            'tab3': {
                templateUrl: 'templates/profile.html',
                controller: 'profileCtrl'
            }
        }
    })

    .state('tabsController.record', {
        url: '/record',
        views: {
            'tab2': {
                templateUrl: 'templates/record.html',
                controller: 'recordCtrl'
            }
        }
    })

    $urlRouterProvider.otherwise('/login')
});