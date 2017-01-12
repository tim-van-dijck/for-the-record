angular.module('app.services', [])

  .service('UserService', function () {
    // For the purpose of this example I will store user data on ionic local storage but you should save it on a database
    var setUser = function (user_data) {
      var facebook = '{"facebook":' + JSON.stringify(user_data) + '}';
      window.localStorage.user = facebook;
    };

    var setSpotify = function (spotify_data) {
        var user = JSON.parse(window.localStorage.user);
        user.spotify = spotify_data;
        window.localStorage.user = JSON.stringify(user);
    };

    var setDeviceToken = function(token) {
        var user = JSON.parse(window.localStorage.user);
        user.device_token = token;
        window.localStorage.user = JSON.stringify(user);
    };

    var getUser = function () {
      return JSON.parse(window.localStorage.user || '{"facebook": {}}');
    };

    var getFbToken = function () {
        return JSON.parse(window.localStorage.user).facebook.authResponse.accessToken;
    }

    var isLoggedIn = function () {
        return window.localStorage.getItem('user') != null;
    }

    var logout = function () { window.localStorage.removeItem('user'); }

    return {
        getUser: getUser,
        setUser: setUser,
        getFbToken: getFbToken,
        isLoggedIn: isLoggedIn,
        logout: logout,
        setSpotify: setSpotify,
        setDeviceToken: setDeviceToken,
        logout: logout
    };
  })

  .service('TwitterService', function ($cordovaOauth, TWITTER_KEY, TWITTER_SECRET, $http, SERVER_URL, UserService) {
    var service = this;

    service.login = function () {
      return $cordovaOauth.twitter(TWITTER_KEY, TWITTER_SECRET).then(function (result) {
        console.log(result);

        var token = result.oauth_token,
          token_secret = result.oauth_token_secret,
          user = UserService.getUser(),
          api_user_id = result.user_id;

        return $http.post(SERVER_URL + 'twitter/link', {
          token: token,
          token_secret: token_secret,
          fb_token: user.facebook.authResponse.accessToken,
          api_user_id: api_user_id
        }).then(function (res) {
          console.log(res);
        }, function (err) {
          console.log(err);
        })

      })
    }
  })

  .service('SpotifyService', function ($cordovaOauth, SPOTIFY_ID, Spotify, $http, SERVER_URL, UserService) {
    var service = this;

    service.login = function () {
        return $cordovaOauth.spotify(SPOTIFY_ID, ['user-read-private', 'playlist-read-private', 'playlist-modify-public', 'user-library-read', 'user-library-modify'], {response_type: 'code'}).then(function (result) {
            console.log(result);
            var token = result.code;
            var user = UserService.getUser();
            var spotify_id = result.id;

        Spotify.setAuthToken(token);
        console.log(token);
        return $http.post(SERVER_URL + 'spotify/link', {
          fb_token: user.facebook.authResponse.accessToken,
          token: token,
          api_user_id: spotify_id,

        }).then(function (res) {
          console.log(res);
        }, function (err) {
          console.log(err);
        })
      })
    }
  })

/*
.service('TwitterService', function ($cordovaOauth, TWITTER_ID, Twitter, $http, SERVER_URL, UserService) {
    var service = this;

    service.login = function () {
        return $cordovaOauth.spotify(TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET_KEY).then(function (result) {
            console.log(result);
            var token = result.access_token;
            var user = UserService.getUser();
            var twitter_id = result.id;

            Twitter.setAuthToken(token);
            console.log(token);
            /!*return $http.post(SERVER_URL + 'twitter/link', {
                fb_token: user.facebook.authResponse.accessToken,
                token: token,
                api_user_id: twitter_id,

            }).then(function (res) {
                console.log(res);
            }, function (err) {
                console.log(err);
            })*!/
        })
    }
})
*/

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
