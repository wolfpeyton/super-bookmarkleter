'use strict';

var angular = require('angular');
var bookmarkleter = require('./bookmarkleter');

var app = angular.module('bookmarkleter', []);

var defaultName = 'My Bookmarklet';

app.config(['$compileProvider', function ($compileProvider) {
  $compileProvider.aHrefSanitizationWhitelist(/./);
}]);

app.controller('appController', ['$scope', function ($scope) {

  $scope.options = {
    urlencode: true,
    iife: true,
    mangleVars: true,
    transpile: false,
    jQuery: false,
    preserveSiteSearch: false
  };

  $scope.name = $scope.displayName = defaultName;

  $scope.error = null;

  var previousBlobUrl = null;

  $scope.updateBookmarklet = function (options) {

    var code = $scope.input;
    var name = $scope.name;

    if (name.trim().length === 0) {
      name = defaultName;
    }

    $scope.displayName = name;

    if (!code) {
      $scope.output = '';
      $scope.error = null;
      return;
    }

    // Make a bookmarklet and show to user. Capture parse errors.
    try {
      $scope.output = bookmarkleter(code, options);
      $scope.error = null;
    } catch (err) {
      $scope.error = err.message;
      $scope.output = null;
      return;
    }

    if (options.preserveSiteSearch) {
      var blob = new Blob([$scope.output], { type: 'text/plain' });
      var url = URL.createObjectURL(blob);
      var downloadLink = document.getElementById('DownloadHref');
      downloadLink.href = url;

      // Revoke the previous Blob URL to free up memory
      if (previousBlobUrl) {
        URL.revokeObjectURL(previousBlobUrl);
      }
      previousBlobUrl = url;
    }

  };

}]);
