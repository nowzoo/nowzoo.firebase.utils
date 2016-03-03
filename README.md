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
