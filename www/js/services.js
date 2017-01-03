angular.module('app.services', [])

  .service('UserService', function () {
    // For the purpose of this example I will store user data on ionic local storage but you should save it on a database
    var setUser = function (user_data) {
      window.localStorage.starter_facebook_user = JSON.stringify(user_data);
    };

    var getUser = function () {
      return JSON.parse(window.localStorage.starter_facebook_user || '{}');
    };

    return {
      getUser: getUser,
      setUser: setUser
    };
  })

  .service('SpotifyService', function($cordovaOauth, SPOTIFY_ID, Spotify, $http, SERVER_URL) {
    var service = this;

    service.login = function () {
      return $cordovaOauth.spotify(SPOTIFY_ID, ['user-read-private', 'playlist-read-private', 'playlist-modify-public', 'user-library-read', 'user-library-modify']).then(function(result) {
        var token = result.access_token;
        Spotify.setAuthToken(token);
        console.log(token);
        // return $http.post(SERVER_URL + 'spotify/token', {
        //   token:token
        // }).then(function(res) {
        //   console.log(res);
        // }, function (err) {
        //   console.log(err);
        // })
      })
    }
  })

  .service('LoginService', function ($ionicPlatform, $state) {
    var isLoggedIn = function () {
      $ionicPlatform.ready(function () {
        facebookConnectPlugin.getLoginStatus(function (response) {
            if (response.status != 'connected') {
              console.log('Not logged in');
              $state.go('login');
            } else if (response.status == 'connected') {
              console.log('Logged in');
            }
          },
          function () {
            console.error('something went wrong');
          });
      });
    }

    return {
      isLoggedIn: isLoggedIn
    }
  });
