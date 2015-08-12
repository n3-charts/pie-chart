(function() {
    'use strict';

    angular
      .module('n3-pie-chart', ['n3-pie-utils'])
      .directive('pieChart', PieChart);

    PieChart.$inject = ['$utils', '$timeout', '$window'];

    function PieChart($utils, $timeout, $window) {

      var directive = {
        replace: true,
        restrict: 'E',
        scope: {data: '=', options: '='},
        template: '<div></div>',
        link: link
      };

      return directive;

      function link($scope, element, attrs, ctrl) {
        var dim = $utils.getDefaultMargins();
        var svg;
        var promise;

        var updateDimensions = function(dimensions) {
          dimensions.width = element[0].parentElement.offsetWidth || 900;
          dimensions.height = element[0].parentElement.offsetHeight || 500;
        };

        var update = function(data, options) {
          $utils
            .updatePaths(svg, data, dim, options)
            .updateLegend(svg, data, dim, options);
        };

        var forceUpdate = function(data, options) {
          $utils.clean(element[0]);
          updateDimensions(dim);
          draw(data, options, dim);
        };

        var draw = function(data, options, dimensions) {
          if (!data || !options) {
            return;
          }

          options = $utils.sanitizeOptions(options);

          svg = $utils.bootstrap(element[0], dimensions);

          $utils
            .draw(svg)
            .updatePaths(svg, data, dimensions, options)
            .addLegend(svg)
            .updateLegend(svg, data, dimensions, options);
        };

        var redraw = function(){
          var redrawData = $utils.addDataForGauge($scope.data, $scope.options);

          $utils.clean(element[0]);
          updateDimensions(dim);
          svg = $utils.bootstrap(element[0], dim);

          $utils
            .draw(svg)
            .updatePaths(svg, redrawData, dim, $scope.options)
            .addLegend(svg)
            .updateLegend(svg, redrawData, dim, $scope.options);

        };

        var resizeWindow = function(){
          if (promise) {
            $timeout.cancel(promise);
          }

          promise = $timeout(redraw, 1);

          return promise;
        };

        $window.addEventListener('resize', resizeWindow);

        $scope.$watch('data', function(newValue, oldValue) {
          newValue = $utils.addDataForGauge(newValue, $scope.options);

          if (svg) {
            update(newValue, $scope.options);
          } else {
            forceUpdate(newValue, $scope.options);
          }
        }, true);

        $scope.$watch('options', function(newValue) {
          var data = $utils.addDataForGauge($scope.data, newValue);
          forceUpdate(data, newValue);
        }, true);

      }
    }
  }
)();
