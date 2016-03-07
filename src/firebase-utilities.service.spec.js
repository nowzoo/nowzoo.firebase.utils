describe('firebaseUtilitesService', function(){

    var $rootScope;
    var $window;
    var firebaseUtilities;
    var resolved;
    var rejected;
    var resolveFunc;
    var rejectFunc;
    var appRef;


    MockFirebase.override();

    beforeEach(module('nowzoo.firebase.utils'));
    beforeEach(inject(function ( _$rootScope_,  _firebaseUtilities_, _$window_) {
        $rootScope = _$rootScope_;
        $window = _$window_;
        firebaseUtilities = _firebaseUtilities_;
        appRef = firebaseUtilities.setApplicationReference('https://localhost.firebaseio.test');
        appRef.autoFlush();
    }));

    describe('setApplicationReference()', function(){
        it ('should return a firebase reference', function(){
            var ref = firebaseUtilities.setApplicationReference('https://localhost.firebaseio.test');
            expect(angular.isObject(ref)).toBe(true);
        });

    });
    describe('getApplicationReference()', function(){
        it ('should return a firebase reference', function(){
            var ref = firebaseUtilities.setApplicationReference('https://localhost.firebaseio.test');
            var ref2 = firebaseUtilities.getApplicationReference();
            expect(angular.isObject(ref2)).toBe(true);
            expect(ref2).toBe(ref);
        });

    });
    describe('getApplicationAuth()', function(){
        it ('should return a firebase auth', function(){
            firebaseUtilities.setApplicationReference('https://localhost.firebaseio.test');
            var auth = firebaseUtilities.getApplicationAuth();
            expect(angular.isObject(auth)).toBe(true);
        });
        it ('should return a singleton', function(){
            firebaseUtilities.setApplicationReference('https://localhost.firebaseio.test');
            var auth = firebaseUtilities.getApplicationAuth();
            var auth2 = firebaseUtilities.getApplicationAuth();
            expect(auth).toBe(auth2);
        });

    });

    describe('childReference()', function(){

        it('should exist and be a function', function() {
            expect(angular.isFunction(firebaseUtilities.childReference)).toEqual(true);
        });

        it('should return a firebase reference if passed an array of length 1', function() {
            var ref = firebaseUtilities.childReference(['options']);
            expect(ref.toString()).toEqual('https://localhost.firebaseio.test/options')
        });
        it('should return a firebase reference if passed an array of length 3', function() {
            var ref = firebaseUtilities.childReference(['options', 'foo', 'bar']);
            expect(ref.toString()).toEqual('https://localhost.firebaseio.test/options/foo/bar')
        });

        it('should return a firebase reference if passed args of length 3', function() {
            var ref = firebaseUtilities.childReference('options', 'foo', 'bar');
            expect(ref.toString()).toEqual('https://localhost.firebaseio.test/options/foo/bar')
        });


    });
    describe('getObject()', function(){

        it('should exist and be a function', function() {
            expect(angular.isFunction(firebaseUtilities.getObject)).toEqual(true);
        });


        it('should return an object with a $loaded property that returns a promise', function() {

            var object = firebaseUtilities.getObject(['options']);
            expect(angular.isFunction(object.$loaded)).toEqual(true);
            expect(angular.isFunction(object.$loaded().then)).toEqual(true);
        });
        it('should populate the object if the data is set', function(){
            var ref = firebaseUtilities.childReference('options');
            var object = firebaseUtilities.getObject('options', 'foo');
            ref.set({foo: 'bar'});
            $rootScope.$digest();
            expect(object.$value).toEqual('bar');
        });

        it('should populate the object if the data is set and we pass an array', function(){
            var ref = firebaseUtilities.childReference('options');
            var object = firebaseUtilities.getObject(['options', 'foo']);
            ref.set({foo: 'bar'});
            $rootScope.$digest();
            expect(object.$value).toEqual('bar');
        });

        it('object._error should be set if there is a security error', function(){
            var result;
            var ref = firebaseUtilities.childReference(['options']);
            var object = firebaseUtilities.getObject(['options']);
            ref.set({foo: 'bar'});


            ref.forceCancel(new Error('security error'));
            object.$loaded().then(function(r){
                result = r;
            });
            $rootScope.$digest();


            expect(angular.isObject(result)).toEqual(true);
            expect(result.__securityError).toEqual(true);
        });




    });

    describe('getRefObject()', function(){

        it('should exist and be a function', function() {
            expect(angular.isFunction(firebaseUtilities.getRefObject)).toEqual(true);
        });
        it('should throw if not passed a reference', function() {
            var test = function(){
                var o = firebaseUtilities.getRefObject(null);
            };
            expect(test).toThrow();
        });

        it('should return an object with a $loaded property that returns a promise', function() {

            var object = firebaseUtilities.getRefObject(firebaseUtilities.childReference(['options']));
            expect(angular.isFunction(object.$loaded)).toEqual(true);
            expect(angular.isFunction(object.$loaded().then)).toEqual(true);
        });

    });

    describe('getArray()', function(){

        it('should exist and be a function', function() {
            expect(angular.isFunction(firebaseUtilities.getArray)).toEqual(true);
        });

        it('should return an object with a $loaded property that returns a promise', function() {

            var object = firebaseUtilities.getArray(['list']);
            expect(angular.isFunction(object.$loaded)).toEqual(true);
            expect(angular.isFunction(object.$loaded().then)).toEqual(true);
        });
        it('should populated if the data is set', function(){
            var ref = firebaseUtilities.childReference(['list']);
            var object = firebaseUtilities.getArray(['list']);
            ref.set({foo: 'bar', baz: 'boo'});
            $rootScope.$digest();
            expect(object.$getRecord('foo').$value).toEqual('bar');
        });



    });

    describe('getRefArray()', function(){

        it('should exist and be a function', function() {
            expect(angular.isFunction(firebaseUtilities.getRefArray)).toEqual(true);
        });
        it('should throw if not passed a reference', function() {
            var test = function(){
                var o = firebaseUtilities.getRefArray(null);
            };
            expect(test).toThrow();
        });

        it('should return an object with a $loaded property that returns a promise', function() {

            var object = firebaseUtilities.getRefArray(firebaseUtilities.childReference(['users']));
            expect(angular.isFunction(object.$loaded)).toEqual(true);
            expect(angular.isFunction(object.$loaded().then)).toEqual(true);
        });

    });

    describe('Factory.onError()', function(){
        it('should log errors if $window.log_firebase', function(){
            var consoleMsg = null;
            var users = firebaseUtilities.getObject(['users']);
            var ref = firebaseUtilities.childReference(['users']);
            spyOn($window.console, 'log').and.callFake(function(m){
                consoleMsg = m;
            });
            ref.autoFlush();
            ref.set({a: 1, b:2});

            $window.log_firebase = true;
            $rootScope.$digest();
            ref.forceCancel(new Error());
            $rootScope.$digest();
            expect(consoleMsg).not.toBe(null);
        });
        it('should not log errors if not $window.log_firebase', function(){
            var consoleMsg = null;
            var users = firebaseUtilities.getObject(['users']);
            var ref = firebaseUtilities.childReference(['users']);
            spyOn($window.console, 'log').and.callFake(function(m){
                consoleMsg = m;
            });
            ref.autoFlush();
            ref.set({a: 1, b:2});

            $window.log_firebase = false;
            $rootScope.$digest();
            ref.forceCancel(new Error());
            $rootScope.$digest();
            expect(consoleMsg).toBe(null);
        })

    });


});

