/*! pie-chart - v1.0.0 - 2013-11-01
* https://github.com/n3-charts/pie-chart
* Copyright (c) 2013 n3-charts  Licensed ,  */
'use strict';

/*global window */

describe('n3-piechart', function() {
  var elm, $scope, isolatedScope;

  beforeEach(module('n3-pie-chart'));

  beforeEach(function() {
    this.addMatchers({
      toBeSameStyleAs: function(expected) {
        var actual = this.actual;
        var notText = this.isNot ? " not" : "";

        this.message = function () {
          return "Expected " + actual + notText + " to be same as " + expected;
        };

        var exp = expected.split(/\s*;\s*/g);
        var comp = actual.split(/\s*;\s*/g);

        var colors = ['fill', 'stroke'];

        for (var key in exp) {
          if (comp[key] === undefined) {
            return false;
          }

          if (comp[key] !== exp[key]) {
            var spl = comp[key].split(/\s*:\s*/);
            var expSpl = exp[key].split(/\s*:\s*/);

            if (colors.indexOf(spl[0]) !== -1) {
              if (d3.rgb(spl[1]).toString() !== d3.rgb(expSpl[1]).toString()) {
                return false;
              }
            } else {
              return false;
            }
          }
        }

        return true;
      }
    });
  });

describe('directive', function() {
  
  beforeEach(inject(function($rootScope, $compile) {
    elm = angular.element('<div id="toto">' +
      '<pie-chart data="data" options="options"></pie-chart>' +
      '</div>');

    $scope = $rootScope;
    $compile(elm)($scope);
    $scope.$digest();
  }));
  
  beforeEach(inject(function($utils) {
    spyOn($utils, 'getDefaultMargins').andReturn(
      {top: 20, right: 50, bottom: 30, left: 50}
    );
    
    spyOn($utils, 'draw').andCallThrough();
  }));
  
  it('should call redraw() when data or options change', inject(function($utils) {
    $scope.data = [
      {label: "one", value: 12.2, color: "red"}, 
      {label: "two", value: 45, color: "green"},
      {label: "three", value: 10, color: "blue"},
      {label: "Fourth series", value: 50, color: "yellow"}
    ];
    $scope.$apply();
    expect($utils.draw.callCount).toBe(0);
      
    $scope.options = {thickness: 5};
    $scope.$apply();
    expect($utils.draw.callCount).toBe(1);
    
    $scope.options.thickness = 10;
    $scope.$apply();
    expect($utils.draw.callCount).toBe(2);
    
    $scope.data.shift();
    $scope.$apply();
    expect($utils.draw.callCount).toBe(3);
    
  }));
});
describe("legend", function() {
  
  describe("getLegendLabel", function() {
    
    xit("should normalize label", inject(function($utils) {
      expect($utils.getLegendLabel("Series", 12.25, 20)).toBe(
        "Series ....... 12.25"
      );
    }));
  });
});
describe("options", function() {
  describe("sanitizeOptions", function() {
    xit("should handle thickness", inject(function($utils) {
      expect($utils.sanitizeOptions({})).toEqual({thickness: 20});
      
      expect($utils.sanitizeOptions({thickness: "10"})).toEqual({thickness: 10});
    }));
  });
});
});