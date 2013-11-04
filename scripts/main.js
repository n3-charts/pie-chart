angular.module('demo.main', ['n3-pie-chart'])

.config(['$routeProvider', function config($routeProvider) {
  $routeProvider
  .when('/examples', {controller: 'ExamplesCtrl', templateUrl: 'views/examples.html'})
  .when('/', {controller: 'HomeCtrl', templateUrl: 'views/home.html'})
  .otherwise({redirectTo: '/'});
}])

.controller('HomeCtrl', function($scope) {
  // mixpanel.track("Home");
  
  var colors = d3.scale.category10();
  $scope.data = [
    {label: "one", value: 12.2, color: colors(0)}, 
    {label: "two", value: 45, color: colors(1)},
    {label: "three", value: 10, color: colors(2)},
    {label: "Fourth series", value: 50, color: colors(3)}
  ];

  $scope.options = {thickness: 10};
  
  $scope.gauge_data = [
    {label: "CPU", value: 75, color: "steelblue"}
  ];
  $scope.gauge_options = {thickness: 5, mode: "gauge", total: 100};
  
  setInterval(function() {
    $scope.gauge_data[0].value = parseInt(Math.random()*100);
    $scope.$apply();
  }, 2000);
  
  $scope.pie_options = {thickness: 100};
})

;
