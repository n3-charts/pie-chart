angular.module('n3-pie-chart', ['n3-pie-utils'])

.directive('pieChart', ['$utils', function($utils) {
  var link  = function($scope, element, attrs, ctrl) {
    var svg;
    var dim = $utils.getDefaultMargins();

    var updateDimensions = function(dimensions) {
      dimensions.width = element[0].parentElement.offsetWidth || 900;
      dimensions.height = element[0].parentElement.offsetHeight || 500;
    };

    var update = function() {
      $utils
        .updatePaths(svg, $scope.data, dim, $scope.options)
        .updateLegend(svg, $scope.data, dim, $scope.options)
      ;
    };

    var hard_update = function() {
      $utils.clean(element[0]);
      updateDimensions(dim);
      draw(dim);
    };

    var draw = function(dimensions) {
      var data = $scope.data;
      var options = $scope.options;

      if (!data || !options) {
        return;
      }

      options = $utils.sanitizeOptions(options);
      data = data.concat(); // this avoids calling again the $watchers since
                            // data is changed by the pie layout...


      svg = $utils.bootstrap(element[0], dimensions);

      $utils
        .draw(svg)
        .updatePaths(svg, data, dimensions, options)
        .addLegend(svg)
        .updateLegend(svg, data, dimensions, options)
      ;
    };

    $scope.$watch('data', function(newValue, oldValue) {
      $utils.addDataForGauge(newValue, $scope.options);

      if (svg) {
        update();
      } else {
        hard_update();
      }
    }, true);
    $scope.$watch('options', hard_update, true);
  };

  return {
    replace: true,
    restrict: 'E',
    scope: {data: '=', options: '='},
    template: '<div></div>',
    link: link
  };
}]);