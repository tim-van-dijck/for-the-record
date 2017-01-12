angular.module('app.controllers', ['ionic.cloud'])

  .controller('settingsCtrl', function (SpotifyService, TwitterService) {
    var settings = this;

    settings.spotify = function () {
      SpotifyService.login().then(function (res) {
        console.log(res);
      }, function (err) {
        console.log(err);
      });
    }
    settings.twitter = function () {
      TwitterService.login().then(function (res) {
        console.log(res);
      }, function (err) {
        console.log(err);
      });
    }
  })

  .controller('tabsCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams, UserService, TwitterService) {

    }])

  .controller('newsfeedCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams, $ionicPush) {


    }])

  .controller('myMusicCtrl', ['$scope', '$stateParams', '$http', 'UserService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams, $http, UserService) {
      var music = this;
      var fb_token = UserService.getFbToken();
      $http.get('http://188.226.129.26/api/my-music?fb_token=' + fb_token).then(function (records) {
        music.records = records;
      });
    }])

  .controller('profileCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams) {


    }])

  .controller('recordCtrl', ['$scope', '$stateParams', '$http',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams, $http) {


    }])

  .controller('loginCtrl', function ($scope, $state, $q, UserService, $ionicLoading, $http, $ionicPush) {
    // This is the success callback from the login method
    if (UserService.isLoggedIn()) {
      $state.go('tabdController.newsfeed');
    }
    var fbLoginSuccess = function (response) {
      $ionicLoading.hide();

      if (!response.authResponse) {
        fbLoginError("Cannot find the authResponse");
        return;
      }

      var authResponse = response.authResponse;

      getFacebookProfileInfo(authResponse)
        .then(function (profileInfo) {
          // For the purpose of this example I will store user data on local storage
          UserService.setUser({
            authResponse: authResponse,
            userID: profileInfo.id,
            name: profileInfo.name,
            email: profileInfo.email,
            picture: "http://graph.facebook.com/" + authResponse.userID + "/picture?type=large"
          });

          $ionicPush.register().then(function (t) {
            return $ionicPush.saveToken(t);
          }).then(function (t) {
            console.log('Push token saved: ' + t.token);
            UserService.setDeviceToken(t.token);
          });

          var user = UserService.getUser();

          // Store user in DB
          $http.post('http://188.226.129.26/api/register', {
            firstname: profileInfo.first_name,
            lastname: profileInfo.last_name,
            email: profileInfo.email,
            token: user.facebook.authResponse.accessToken,
            api_user_id: user.facebook.userID,
            device_token: user.device_token,
          }).then(function (response) {
            console.log(response);
            console.log('login token', accessToken);
          });

          $ionicLoading.hide();
          $state.go('tabs.newsfeed');
        }, function (fail) {
          // Fail get profile info
          console.log('profile info fail', fail);
        });
    };

    var token = '';

    // This is the fail callback from the login method
    var fbLoginError = function (error) {
      console.log('fbLoginError', error);
      $ionicLoading.hide();
    };

    // This method is to get the user profile info from the facebook api
    var getFacebookProfileInfo = function (authResponse) {
      var info = $q.defer();
      accessToken = authResponse.accessToken

      facebookConnectPlugin.api('/me?fields=email,first_name,last_name&access_token=' + accessToken, null,
        function (response) {
          console.log(response);
          info.resolve(response);
        },
        function (response) {
          console.log(response);
          info.reject(response);
        }
      );
      return info.promise;
    };

    //This method is executed when the user press the "Login with facebook" button
    $scope.facebookSignIn = function () {
      facebookConnectPlugin.getLoginStatus(function (success) {
        if (success.status === 'connected') {
          // The user is logged in and has authenticated our app, and response.authResponse supplies
          // the user's ID, a valid access token, a signed request, and the time the access token
          // and signed request each expire

          // Check if we have our user saved
          var user = UserService.getUser('facebook');
          console.log(user);

          if (!user.facebook.userID) {
            getFacebookProfileInfo(success.authResponse)
              .then(function (profileInfo) {

                // Store user data on local storage
                UserService.setUser({
                  authResponse: success.authResponse,
                  userID: profileInfo.id,
                  name: profileInfo.name,
                  email: profileInfo.email,
                  picture: "http://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large"
                });

                var user = UserService.getUser();

                // Store user in DB
                $http.post('http://188.226.129.26/api/register', {
                  firstname: profileInfo.first_name,
                  lastname: profileInfo.last_name,
                  email: profileInfo.email,
                  token: user.facebook.authResponse.accessToken,
                  device_token: user.device_token,
                  api_user_id: user.facebook.userID
                }).then(function (response) {
                  console.log(response.status);
                });

                $state.go('tabs.newsfeed');
              }, function (fail) {
                // Fail get profile info
                console.log('profile info fail', fail);
              });
          } else {
            $state.go('tabs.newsfeed');
          }
        } else {
          // If (success.status === 'not_authorized') the user is logged in to Facebook,
          // but has not authenticated your app
          // Else the person is not logged into Facebook,
          // so we're not sure if they are logged into this app or not.

          console.log('getLoginStatus', success.status);

          $ionicLoading.show({
            template: 'Logging in...'
          }).then(function () {
            facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
          });
        }
      });
    }
  })


  .controller('logoutCtrl', function ($scope, UserService, $ionicActionSheet, $state) {
    $scope.user = UserService.getUser();

    facebookConnectPlugin.logout(function () {
      console.log('Logging out...');
    });
    UserService.logout();
    $state.go('tabs.newsfeed');
  })
