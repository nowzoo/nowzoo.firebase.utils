angular.module('nowzoo.firebase.utils')
    .factory('firebaseUtilities', function($window, $firebaseAuth, $firebaseObject, $firebaseArray){
        'use strict';
        var _appReference = null;
        var _appAuth = null;

        var setApplicationReference = function(url){
            _appReference = new $window.Firebase(url);
            return _appReference;
        };

        var getApplicationReference = function(){
            return _appReference;
        };

        var getApplicationAuth = function(){
            if (! _appAuth){
                _appAuth = $firebaseAuth(getApplicationReference());
            }
            return _appAuth;
        };

        var onError = function(err){
            this.__securityError = true;
            if ($window.log_firebase){
                console.log(err, this.$ref().toString());
            }
        };


        var ObjectFactory = $firebaseObject.$extend({$$error: onError});

        var ArrayFactory = $firebaseArray.$extend({$$error: onError});

        /**
         * Returns the a child firebase reference based on an array of paths
         * @param paths
         * @returns {{}}
         */
        var childReference = function(){
            var args = Array.prototype.slice.call(arguments);

            var child = getApplicationReference();
            angular.forEach(args, function(val){
                if (angular.isArray(val)){
                    angular.forEach(val, function(str){
                        var s = str.toString();
                        child = child.child(s);
                    });
                } else {
                    var s = val.toString();
                    child = child.child(s);
                }
            });
            return child;
        };

        /**
         * Returns a $firebaseObject based on an array of paths
         * @param paths
         * @returns {Function}
         */
        var getObject = function(){
            var ref = childReference.apply(null, arguments);
            /*jshint newcap: false */
            return new ObjectFactory(ref);
        };
        /**
         * Returns a $firebaseObject based on a firebase ref
         * @param ref
         * @returns {Function}
         */
        var getRefObject = function(ref){
            return new ObjectFactory(ref);
        };

        /**
         * Returns a $firebaseArray based on an array of paths
         * @param paths
         * @returns {Function}
         */
        var getArray = function(){
            var ref = childReference.apply(null, arguments);
            /*jshint newcap: false */
            return new ArrayFactory(ref);
        };
        /**
         * Returns a $firebaseArray based on a firebase ref
         * @param ref
         * @returns {Function}
         */
        var getRefArray = function(ref){
            return new ArrayFactory(ref);
        };


        return {
            getApplicationReference: getApplicationReference,
            setApplicationReference: setApplicationReference,
            getApplicationAuth: getApplicationAuth,
            childReference: childReference,
            getObject: getObject,
            getArray: getArray,
            getRefArray: getRefArray,
            getRefObject: getRefObject
        };

    });
