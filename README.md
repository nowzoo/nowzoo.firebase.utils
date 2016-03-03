#  NowZoo Firebase Utilities

This module exposes several utilities for using Firebase with angularfire.

Usage:

```
//declare the dependency...
angular.module('my.app', ['nowzoo.firebase.utils']);
```

```
//set the application reference with a URL...
angular.module('my.app')
    .run(function(firebaseUtilities){
        firebaseUtilities.setApplicationReference('https://<YOUR-FIREBASE>.firebaseio.com/')
    });
```


```
angular.module('my.app')
    .controller('MyController', function($scope, firebaseUtilities){
        $scope.options = firebaseUtilities.getObject('options');
    });
```    

## firebaseUtilities

```
//Set the application reference with a url...
firebaseUtilities.setApplicationReference(url);

//Get the application reference...
firebaseUtilities.getApplicationReference ();

//Get a $firebaseAuth object...
firebaseUtilities.getApplicationAuth();

//Get a child firebase reference from the arguments
firebaseUtilities.childReference(path1, ...);

//Get a $firebaseObject from the arguments
firebaseUtilities.getObject(path1, ...);

//Get a $firebaseObject from a firebase ref
firebaseUtilities.getRefObject(ref);

//Get a $firebaseArray from the args
firebaseUtilities.getArray(path1, ...);

//Get a $firebaseArray from a firebase ref...
firebaseUtilities.getRefArray(ref);

```
