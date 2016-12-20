angular.module('app.services', [])

.service('UserService', function() {
    // For the purpose of this example I will store user data on ionic local storage but you should save it on a database
    var setUser = function(user_data) {
        window.localStorage.starter_facebook_user = JSON.stringify(user_data);
    };

    var getUser = function(){
        return JSON.parse(window.localStorage.starter_facebook_user || '{}');
    };

    return {
        getUser: getUser,
        setUser: setUser
    };
})

.service('LoginService', function($ionicPlatform, $state) {
    var isLoggedIn = function() {
        console.log($state.current.name);
        $ionicPlatform.ready(function() {
            facebookConnectPlugin.getLoginStatus(function (response) {
                console.log(response.status);
                if (response.status != 'connected' && $state.current.name != 'login' && $state.current.name != '') {
                    console.log('Not logged in');
                    $state.go('login');
                } else {
                    if (response.status == 'connected') {
                        console.log('Logged in');
                    }
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