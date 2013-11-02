angular.module('n3-pie-chart', ['n3-pie-utils'])

.directive('pieChart', ['$utils', '$window', function($utils, $window) {
  var link  = function($scope, element, attrs, ctrl) {
    var dim = $utils.getDefaultMargins();

    var updateDimensions = function(dimensions) {
      dimensions.width = element[0].parentElement.offsetWidth || 900;
      dimensions.height = element[0].parentElement.offsetHeight || 500;
    };

    var update = function() {
      $utils.clean(element[0]);
      updateDimensions(dim);
      redraw(dim);
    };

    var redraw = function(dimensions) {
      var data = $scope.data;
      var options = $scope.options;

      if (!data || !options) {
        return;
      }

      options = $utils.sanitizeOptions(options);
      data = data.concat(); // this avoids calling again the $watchers since
                            // data is changed by the pie layout...

      var svg = $utils.bootstrap(element[0], dimensions);

      $utils
        .draw(svg, data, dimensions, options)
        .addLegend(svg, data, dimensions, options);
    };

    $window.onresize = function() {
      update();
    };

    $scope.$watch('data', update, true);
    $scope.$watch('options', update, true);
  };

  return {
    replace: true,
    restrict: 'E',
    scope: {data: '=', options: '='},
    template: '<div></div>',
    link: link
  };
}]);