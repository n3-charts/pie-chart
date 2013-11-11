describe('standard mode', function() {
  
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
    
    // $scope.data.shift();
    // $scope.$apply();
    // expect($utils.draw.callCount).toBe(3);
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
    
    it("should create paths with proper style", function() {
      var arcs = content.childNodes[0];
      
      var expected = [
        {"id": "arc_0", "style": "fill: #ff0000; fill-opacity: 0.8;"},
        {"id": "arc_1", "style": "fill: #0a182d; fill-opacity: 0.8;"},
        {"id": "arc_2", "style": "fill: rgba(10, 24, 45, 0.70196); fill-opacity: 0.8;"},
        {"id": "arc_3", "style": "fill: #123456; fill-opacity: 0.8;"}
      ];
      
      expected.forEach(function(d, i) {
        expect(arcs.childNodes[i].getAttribute("class")).toBe("arc");
        expect(arcs.childNodes[i].getAttribute("id")).toBe(d.id);
        expect(arcs.childNodes[i].getAttribute("style").trim()).toBe(d.style);
      });
    });
    
    it("should create paths with proper data", function() {
      var arcs = content.childNodes[0];
      
      var expected = [
        "M-222.82279198005287,-89.16279142228608A240,240 0 0,1 -122.59052896853278,-206.32877212646648L-120.03655961502169,-202.03025604049841A235,235 0 0,0 -218.18065048046842,-87.30523326765511Z",
        "M106.77390401186753,214.9403019958437A240,240 0 0,1 -222.82279198005287,-89.16279142228608L-218.18065048046842,-87.30523326765511A235,235 0 0,0 104.54944767828695,210.46237903759697Z",
        "M-122.59052896853278,-206.32877212646648A240,240 0 0,1 -4.408728476930471e-14,-240L-4.3168799669944197e-14,-235A235,235 0 0,0 -120.03655961502169,-202.03025604049841Z",
        "M1.469576158976824e-14,-240A240,240 0 0,1 106.77390401186753,214.9403019958437L104.54944767828695,210.46237903759697A235,235 0 0,0 1.43895998899814e-14,-235Z"
      ];
      
      // The transition lasts 300ms...
      waits(300);

      runs(function () {
        expected.forEach(function(d, i) {
          expect(arcs.childNodes[i].nodeName).toBe("path");
          expect(arcs.childNodes[i].getAttribute("d")).toBeSamePathAs(d);
        });
      });
    });
  });
});