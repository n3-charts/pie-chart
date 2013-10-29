angular.module('n3-pie-chart', ['n3-pie-utils'])

.directive('pieChart', ['$utils', '$window', function($utils, $window) {
  var link  = function(scope, element, attrs, ctrl) {
    var dim = $utils.getDefaultMargins();

    scope.updateDimensions = function(dimensions) {
      dimensions.width = element[0].parentElement.offsetWidth || 900;
      dimensions.height = element[0].parentElement.offsetHeight || 500;
    };

    scope.update = function() {
      scope.updateDimensions(dim);
      scope.redraw(dim);
    };

    scope.redraw = function(dimensions) {
      var data = scope.data;
      var options = scope.options;

      $utils.clean(element[0]);

      if (!data || !options) {
        return;
      }

      var svg = $utils.bootstrap(element[0], dimensions);

      $utils.draw(svg, data, dimensions);
    };

    $window.onresize = function() {
      scope.update();
    };

    scope.$watch('data', scope.update);
    scope.$watch('options', scope.update, true);
  };

  return {
    replace: true,
    restrict: 'E',
    scope: {data: '=', options: '='},
    template: '<div></div>',
    link: link
  };
}]);