/*! pie-chart - v1.0.0 - 2013-11-02
* https://github.com/n3-charts/pie-chart
* Copyright (c) 2013 n3-charts  Licensed ,  */
'use strict';

/*global window */

describe('n3-piechart', function() {
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
  
  var elm, $scope, isolatedScope;
  
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
  
  describe("content generation", function() {
    var svg, content;
    
    beforeEach(function() {
      $scope.data = [
        {label: "one", value: 12.2, color: "red"}, 
        {label: "two", value: 45, color: "rgb(10, 24, 45)"},
        {label: "three", value: 10, color: "rgba(10, 24, 45, 0.7)"},
        {label: "Fourth series", value: 50, color: "#123456"}
      ];   
      $scope.options = {thickness: 5};
      $scope.$apply();
      
      svg = elm[0].childNodes[0].childNodes[0];
      content = svg.childNodes[0];
    });
    
    it('should create the svg and the main group', function() {
      expect(svg.nodeName).toBe("svg");
      expect(svg.childNodes.length).toBe(1);
      expect(content.nodeName).toBe("g");
    });
    
    it("should create two groups : arcs and legend items", function() {
      expect(content.childNodes.length).toBe(2);
      
      expect(content.childNodes[0].getAttribute("id")).toBe("n3-pie-arcs");
      expect(content.childNodes[1].getAttribute("id")).toBe("n3-pie-legend");
    });
    
    it("should create arcs groups", function() {
      var arcs = content.childNodes[0];
      
      var expected = [
        {"class": "arc", "id": "arc_0"},
        {"class": "arc", "id": "arc_1"},
        {"class": "arc", "id": "arc_2"},
        {"class": "arc", "id": "arc_3"}
      ];
      
      expected.forEach(function(d, i) {
        expect(arcs.childNodes[i].getAttribute("class")).toBe(d["class"]);
        expect(arcs.childNodes[i].getAttribute("id")).toBe(d["id"]);
        expect(arcs.childNodes[i].getAttribute("style")).toBe(null);
      });
    });
    
    it("should create a path in each arc group with proper style", function() {
      var arcs = content.childNodes[0];
      
      var expected = [
        {"type": "path", "style": "fill: red; fill-opacity: 0.8;"},
        {"type": "path", "style": "fill: rgb(10, 24, 45); fill-opacity: 0.8;"},
        {"type": "path", "style": "fill: rgba(10, 24, 45, 0.7); fill-opacity: 0.8;"},
        {"type": "path", "style": "fill: #123456; fill-opacity: 0.8;"}
      ];
      
      var p = function(i) {return arcs.childNodes[i].childNodes[0];};
      expected.forEach(function(d, i) {
        expect(p(i).nodeName).toBe(d.type);
        expect(p(i).getAttribute("style").trim()).toBeSameStyleAs(d.style);
      });
    });
    
    it("should create a path in each arc group with proper data", function() {
      var arcs = content.childNodes[0];
      
      var expected = [
        "M-222.82279198005287,-89.16279142228608A240,240 0 0,1 -122.59052896853278,-206.32877212646648L-120.03655961502169,-202.03025604049841A235,235 0 0,0 -218.18065048046842,-87.30523326765511Z",
        "M106.77390401186753,214.9403019958437A240,240 0 0,1 -222.82279198005287,-89.16279142228608L-218.18065048046842,-87.30523326765511A235,235 0 0,0 104.54944767828695,210.46237903759697Z",
        "M-122.59052896853278,-206.32877212646648A240,240 0 0,1 -4.408728476930471e-14,-240L-4.3168799669944197e-14,-235A235,235 0 0,0 -120.03655961502169,-202.03025604049841Z",
        "M1.469576158976824e-14,-240A240,240 0 0,1 106.77390401186753,214.9403019958437L104.54944767828695,210.46237903759697A235,235 0 0,0 1.43895998899814e-14,-235Z"
      ];
      
      var p = function(i) {return arcs.childNodes[i].childNodes[0];};
      expected.forEach(function(d, i) {
        expect(p(i).getAttribute("d").trim()).toBe(d);
      });
    });
  });
});
describe("legend", function() {
  
  describe("getLegendLabel", function() {
    it("should normalize label", inject(function($utils) {
      expect($utils.getLegendLabel("Series", 12.25, 20)).toBe(
        "Series ....... 12.25"
      );
    }));
  });
  
  describe("getLegendLabelFunction", function() {
    it("should return nothing if chart too small", inject(function($utils) {
      var fakeData = {label: "My series", value: 42};
      
      var f = $utils.getLegendLabelFunction(39);
      expect(f(fakeData)).toBe("");
      
      f = $utils.getLegendLabelFunction(99);
      expect(f(fakeData)).toBe("My series");
      
      f = $utils.getLegendLabelFunction(100);
      expect(f(fakeData)).toBe("My series ....... 42");
    }));
  });
  
  describe("items", function() {
    beforeEach(inject(function($utils) {
      spyOn($utils, 'getDefaultMargins').andReturn(
        {top: 20, right: 50, bottom: 30, left: 50}
      );
    }));
    
    var elm, $scope, isolatedScope;
    beforeEach(inject(function($rootScope, $compile) {
      elm = angular.element('<div id="toto">' +
        '<pie-chart data="data" options="options"></pie-chart>' +
        '</div>');

      $scope = $rootScope;
      $compile(elm)($scope);
      $scope.$digest();
    }));
    
    var svg, content;
    beforeEach(function() {
      $scope.data = [
        {label: "one", value: 12.2, color: "red"}, 
        {label: "two", value: 45, color: "rgb(10, 24, 45)"},
        {label: "three", value: 10, color: "rgba(10, 24, 45, 0.7)"},
        {label: "Fourth series", value: 50, color: "#123456"}
      ];   
      $scope.options = {thickness: 5};
      $scope.$apply();
      
      svg = elm[0].childNodes[0].childNodes[0];
      content = svg.childNodes[0];
    });
    
    it("should be in a single legend group", function() {
      expect(content.childNodes.length).toBe(2);
      expect(content.childNodes[1].getAttribute("id")).toBe("n3-pie-legend");
    });
    
    it("should be four", function() {
      var legendItems = content.childNodes[1].childNodes;
      
      expect(legendItems.length).toBe(4);
    });
    
    it("should be colored", function() {
      var legendItems = content.childNodes[1].childNodes;
      
      var expected = [
        {transform: "translate(0, -30)", style: "fill: #123456; fill-opacity: 0.8;"},
        {transform: "translate(0, -15)", style: "fill: #0a182d; fill-opacity: 0.8;"},
        {transform: "translate(0, 0)", style: "fill: #ff0000; fill-opacity: 0.8;"},
        {transform: "translate(0, 15)", style: "fill: rgba(10, 24, 45, 0.70196); fill-opacity: 0.8;"}
      ];
      
      expected.forEach(function(d, i) {
        expect(legendItems[i].nodeName).toBe("g");
        expect(legendItems[i].getAttribute("transform")).toBe(d.transform);
        expect(legendItems[i].getAttribute("style").trim()).toBeSameStyleAs(d.style);
      });
    });
    
    it("should own text elements", function() {
      var legendItems = content.childNodes[1].childNodes;
      
      var expected = [
        {x: "0px", y: "15px", "text-anchor": "middle", content: "Fourth series ... 50", style: "font-family: monospace;"},
        {x: "0px", y: "15px", "text-anchor": "middle", content: "two ............. 45", style: "font-family: monospace;"},
        {x: "0px", y: "15px", "text-anchor": "middle", content: "one ........... 12.2", style: "font-family: monospace;"},
        {x: "0px", y: "15px", "text-anchor": "middle", content: "three ........... 10", style: "font-family: monospace;"}
      ];
      
      var p = function(i) {return legendItems[i].childNodes[0];};
      expected.forEach(function(d, i) {
        expect(p(i).nodeName).toBe("text");
        expect(p(i).getAttribute("x")).toBe(d.x);
        expect(p(i).getAttribute("y")).toBe(d.y);
        expect(p(i).textContent).toBe(d.content);
        expect(p(i).getAttribute("text-anchor")).toBe(d["text-anchor"]);
        expect(p(i).getAttribute("style").trim()).toBeSameStyleAs(d.style);
      });
    });

    it("should call mouseover", inject(function($utils) {
      var legendItems = content.childNodes[1].childNodes;
      
      var expected = [
        "fill: #123456; fill-opacity: 0.8; opacity: 0.4;",
        "fill: #0a182d; fill-opacity: 0.8; opacity: 1;",
        "fill: #ff0000; fill-opacity: 0.8; opacity: 0.4;",
        "fill: rgba(10, 24, 45, 0.70196); fill-opacity: 0.8; opacity: 0.4;"
      ];
      
      runs(function () {
        var e = document.createEvent("MouseEvents");
        e.initMouseEvent("mouseover");
        legendItems[1].dispatchEvent(e);
      });
      
      // There is a transition we have to wait for.
      // BTW : Jasmine is awesome.
      waits(50);

      runs(function () {
        expected.forEach(function(d, i) {
          expect(legendItems[i].getAttribute("style").trim()).toBeSameStyleAs(d);
        });
      });
    }));
    
    it("should call mouseout", inject(function($utils) {
      var legendItems = content.childNodes[1].childNodes;
      
      var expected = [
        "fill: #123456; fill-opacity: 0.8; opacity: 1;",
        "fill: #0a182d; fill-opacity: 0.8; opacity: 1;",
        "fill: #ff0000; fill-opacity: 0.8; opacity: 1;",
        "fill: rgba(10, 24, 45, 0.70196); fill-opacity: 0.8; opacity: 1;"
      ];
      
      runs(function () {
        var e = document.createEvent("MouseEvents");
        e.initMouseEvent("mouseout");
        legendItems[1].dispatchEvent(e);
      });
      
      waits(50);

      runs(function () {
        expected.forEach(function(d, i) {
          expect(legendItems[i].getAttribute("style").trim()).toBeSameStyleAs(d);
        });
      });
    }));
  })
});
describe("options", function() {
  describe("sanitizeOptions", function() {
    it("should handle thickness", inject(function($utils) {
      expect($utils.sanitizeOptions({})).toEqual({thickness: 20});
      
      expect($utils.sanitizeOptions({thickness: "10"})).toEqual({thickness: 10});
    }));
  });
});
describe('size', function() {
  beforeEach(inject(function($utils) {
    spyOn($utils, 'getDefaultMargins').andReturn(
      {top: 20, right: 50, bottom: 30, left: 50}
    );
    
    spyOn($utils, 'draw').andCallThrough();
  }));
  
  var elm, $scope, isolatedScope;
  beforeEach(inject(function($rootScope, $compile) {
    elm = angular.element('<div id="toto">' +
      '<pie-chart data="data" options="options"></pie-chart>' +
      '</div>');

    $scope = $rootScope;
    $compile(elm)($scope);
    $scope.$digest();
  }));

  it('should update when $window resize', inject(function($window, $utils) {
    $scope.data = [
      {label: "one", value: 12.2, color: "red"}, 
      {label: "two", value: 45, color: "green"},
      {label: "three", value: 10, color: "blue"},
      {label: "Fourth series", value: 50, color: "yellow"}
    ];
      
    $scope.options = {thickness: 5};
    $scope.$apply();
    expect($utils.draw.callCount).toBe(2);
    
    var e = document.createEvent('HTMLEvents');
    e.initEvent('resize', true, false);
    $window.dispatchEvent(e);
    expect($utils.draw.callCount).toBe(3);
  }));
});
});