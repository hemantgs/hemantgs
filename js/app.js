/**
 * Created by GS on 2/18/2017.
 */
var azaleaaRoot = angular.module('azaleaaRoot', ['ngRoute','ui.router','ngStorage','ngAnimate','ui.bootstrap']);


/*azaleaaRoot.config(function($routeProvider){
    $routeProvider
        .when('/home',{
            templateUrl:'pages/home.html',
            controller:'authController'
        })

        .when('/login',{
            templateUrl:'pages/landing.html.bak',
            controller:'authController'
        })
});*/

azaleaaRoot.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/landing');
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'pages/home.html',
            controller: 'homeController',
            authFlag: true,
            abstract:true
        })

        .state('landing',{
            url:'/landing',
            templateUrl:'pages/landing.html',
            controller:'authController'
        })

        .state('home.modal', {
            url: '',
            onEnter: ['$stateParams', '$state', '$uibModal',
                function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'pages/reg-modal.html',
                        controller: 'homeController',
                        windowClass: 'app-modal-window',
                        backdrop  : 'static',
                        keyboard  : false
                    })
                        .result.then(function () {
                        // change route after clicking OK button
                        //$state.transitionTo('home');
                    }, function () {
                        // change route after clicking Cancel button or clicking background
                      //  $state.transitionTo('home');
                    });
                }]
        });

});

/*azaleaaRoot.run(function ($rootScope, $state, AuthService) {
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
        if (toState.authFlag && !AuthService.isAuthenticated()){
            $state.transitionTo("login");
            event.preventDefault();
        }
    });
});*/

azaleaaRoot.run(['$rootScope', '$uibModalStack',
    function($rootScope, $uibModalStack) {
        $rootScope.$on('$stateChangeStart', function() {
            var top = $uibModalStack.getTop();
            if (top) {
                $uibModalStack.dismiss(top.key);
            }
        });
    }
]);


azaleaaRoot.service('AuthService', function($q, $http,$localStorage) {
    var self= this;
    this.user ={};
    this.isAuth = undefined;

            this.setUser =function(_user){
                self.user.username = _user.username;
                self.user.email = _user.email;
                self.isAuth=true;
            },
            this.getUser = function getUser()
            {
                return self.user;
            }
            this.isAuthorized = function isAuthorized(){
                return self.isAuth;
            }


});


azaleaaRoot.controller('authController', ['$scope','$filter','$http','$location','$state','$rootScope','AuthService',contollerFunct]);
azaleaaRoot.controller('homeController', ['$scope','$filter','$http','$location','$state','$rootScope','AuthService',homeControllerFunct]);
azaleaaRoot.controller('baseController', ['$scope','$filter','$http','$location','$state','$rootScope','$route','AuthService',baseControllerFunct]);


function baseControllerFunct($scope,$filter,$http,$location,$state,$rootScope,$route,AuthService) {
    $rootScope.gmail = {
        username: 'Guest',
        email: '',
        isAuth: false
    }

    $scope.signOut = function(){

        gapi.auth.signOut();

        FB.getLoginStatus(function(response){
            if(response.status === 'connected'){
                console.log('inside sign out');
                FB.logout();
            }
            else if (response.status === 'not_authorised'){

            }
            else {

            }
        });
        $rootScope.gmail = {
            username: 'Guest',
            email: '',
            isAuth: false
        }
        $route.reload();
    }


}
function contollerFunct($scope,$filter,$http,$location,$state,$rootScope,AuthService){

    $scope.googleLogin = function(){
        var params ={
            'clientid':'557541505759-si4vmvm7fqa9asso75kankggqf01i4l7.apps.googleusercontent.com',
            'cookiepolicy':'single_host_origin',
            'callback':$scope.googleSigin,
            'approvalprompt':'force',
            'scope':'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.profile.emails.read'

        }
       var result = gapi.auth.signIn(params);
    }

    $scope.googleSigin = function(result){
        if(result['status']['signed_in']) {
            var request = gapi.client.plus.people.get(
                {
                    'userId': 'me'
                }
            );
            request.execute(function(resp){
                var user = {};
                user.username = resp.displayName;
                user.email = resp.emails[0].value;
                console.log(user);
               AuthService.setUser(user);
               $state.go('home.modal');
            });

        }
    }

$scope.fbLogin = function(){
    FB.login(function(response){
       if(response.authResponse){
           FB.api('/me','GET',{fields:'email,first_name,name'},function(result){
               var user = {};
               user.username = result.name;
               //user.email = result.emails[0].value;
               console.log(user);
               AuthService.setUser(user);
               $state.go('home.modal');
           })
       }
    });
}

}
function homeControllerFunct($scope,$filter,$http,$location,$state,$rootScope,AuthService){
        console.log(AuthService.getUser());
        $rootScope.gmail.username = AuthService.getUser().username;
        $rootScope.gmail.email = AuthService.getUser().email;
        $rootScope.gmail.isAuth = AuthService.isAuthorized();

    $scope.cancel = function() {
        $scope.$dismiss();
    };
    // close modal after clicking OK button
    $scope.ok = function() {
        $scope.$close(true);
    }

}


$(window).scroll(function() {
    if ($(document).scrollTop() > 50) {
        $('nav').addClass('transparent');
    } else {
        $('nav').removeClass('transparent');
    }
});