(function(){
  'use strict';
  var homelessapp = angular.module('homelessapp', ['onsen', 'simplePagination']);
  var map = angular.module('SvgMapApp', []);

  angular.module('CombinedModule', ['homelessapp', 'SvgMapApp']);

  homelessapp.controller('HomeController', ['$scope', '$http', function($scope, $http) {
    $http.get('js/data/us-states.json').
      success(function(data){
        $scope.state_data = data;
      });

    $scope.stateShelters = function(state) {
      $scope.ons.navigator.pushPage('state-shelters.html', { state : state });
    }

    $scope.searchShelter = function() {
      $scope.ons.navigator.pushPage('state-shelters.html', { kword : $scope.shelter_keyword });
    }
  }]);

  homelessapp.controller('StateSheltersController', ['$scope', '$http', 'Pagination', function($scope, $http, Pagination) {
    var page = $scope.ons.navigator.getCurrentPage();
    $scope.header = '';
    $scope.kword = '';
    $scope.show = true;
    $scope.show_message = $scope.show_pagination = false;
    $scope.pagination = Pagination.getNew(100);

    if (page.options.kword == '' || page.options.kword == null) {
      $scope.header = page.options.state;

      $http.get('http://homeless.org/homeless_app/data_query.php?state='+page.options.state).
        success(function(data){
          console.log(data);
          $scope.shelters = data;
          $scope.show = false;
          $scope.show_pagination = true;
          $scope.pagination.numPages = Math.ceil($scope.shelters.length/$scope.pagination.perPage);
        });
    }
    else {
      $scope.header = 'Search Results';
      $scope.kword = page.options.kword;

      $http.get('http://homeless.org/homeless_app/data_query.php?kword='+$scope.kword).
        success(function(data){
          $scope.shelters = data;
          $scope.show_message = true;
          $scope.show = false;
          $scope.show_pagination = true;
          $scope.pagination.numPages = Math.ceil($scope.shelters.length/$scope.pagination.perPage);
        });
    }

    $scope.shelterDetails = function(shelter, address1, address2, zip, phone1, phone2, description, website1, website2) {
        var address = address1;
        var phone = phone1;
        var website = website1;

        if (address == '' || address == null || address == 'N/A') {
          address = address2;
        }
        if (phone == '' || phone == null || phone == 'N/A') {
          phone = phone2;
        }
        if (website == '' || website == null || website == 'N/A') {
          website = website2;
        }

        $scope.ons.navigator.pushPage('shelter-details.html', { shelter_name : shelter, shelter_address : address, shelter_zip : zip, shelter_phone : phone, shelter_description : description, shelter_website : website });
      }
  }]);

  homelessapp.controller('ShelterDetailsController', ['$scope', '$sce', function($scope, $sce) {
    var page = $scope.ons.navigator.getCurrentPage();
    $scope.shelter_name = page.options.shelter_name;
    $scope.shelter_address = page.options.shelter_address;
    $scope.shelter_zip = page.options.shelter_zip;
    $scope.shelter_phone = page.options.shelter_phone;
    $scope.shelter_description = page.options.shelter_description;
    $scope.shelter_website = page.options.shelter_website;
    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    }
    $scope.map_url = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyBDtxieKrQwBJ5HSwDH-M55qFw6sJmn_9s&q='+$scope.shelter_address;

    if (page.options.shelter_address == '' || page.options.shelter_address == null || page.options.shelter_address == "N/A") {
      $scope.shelter_address = 'No data available';
    }
    if (page.options.shelter_zip == '' || page.options.shelter_zip == null || page.options.shelter_zip == "N/A") {
      $scope.shelter_zip = 'No data available';
    }
    if (page.options.shelter_phone == '' || page.options.shelter_phone == null || page.options.shelter_phone == "N/A") {
      $scope.shelter_phone = 'No data available';
    }
    if ($scope.shelter_description == '' || $scope.shelter_description == null || $scope.shelter_description == 'N/A') {
        $scope.shelter_description ='No data available';
      }
    if (page.options.shelter_website == '' || page.options.shelter_website == null || page.options.shelter_website == "N/A") {
      $scope.shelter_website = 'No data available';
    }
  }]);
})();