(function() {
  //declare app name
  var app = angular.module('myCalculator', []);

  //create controller for the app
  //use the $scope directive to share variables in the html
  app.controller('CalculatorController',['$scope',function($scope){

    //declare $scope variables
    $scope.lumen_options = [375, 600, 900, 1125, 1600];
    $scope.current_lumens = 600;
    $scope.current_cost = 12;
    $scope.current_hours = 3;
    $scope.total_days = 365;

    $scope.inc_conversion = 0.0625;
    $scope.hal_conversion = 0.0450;
    $scope.cfl_conversion = 0.0146;
    $scope.led_conversion = 0.0125;

    //create a function that can be called from the html
    $scope.calculate = function() {

      //calculate the wattage needed depending on how much brightness is needed
      $scope.inc_wattage = ($scope.current_lumens * $scope.inc_conversion).toFixed(1);
      $scope.hal_wattage = ($scope.current_lumens * $scope.hal_conversion).toFixed(1);
      $scope.cfl_wattage = ($scope.current_lumens * $scope.cfl_conversion).toFixed(1);
      $scope.led_wattage = ($scope.current_lumens * $scope.led_conversion).toFixed(1);

      //if the user enters more than 24 hours
      if($scope.current_hours > 24) {
        //set it back to 24
        $scope.current_hours = 24;
      }

      //calculate the number of hours in a year
      var total_hours = $scope.total_days * $scope.current_hours;
      //calculate the cost in cents per kilowatt-hour
      var cost = $scope.current_cost / 100;

      //calculate the amount of money spent per year on each bulb
      $scope.inc_cost = ((($scope.inc_wattage * total_hours) / 1000) * cost).toFixed(2);
      $scope.hal_cost = ((($scope.hal_wattage * total_hours) / 1000) * cost).toFixed(2);
      $scope.cfl_cost = ((($scope.cfl_wattage * total_hours) / 1000) * cost).toFixed(2);
      $scope.led_cost = ((($scope.led_wattage * total_hours) / 1000) * cost).toFixed(2);

    };

    //call the calculate function
    $scope.calculate();

  }]);
})();
