describe("gauge mode", function() {
  beforeEach(inject(function($utils) {
    spyOn($utils, 'getDefaultMargins').andReturn(
      {top: 20, right: 50, bottom: 30, left: 50}
    );
  }));
  
  var elm, elmWithComplement, $scope, isolatedScope;
  beforeEach(inject(function($rootScope, $compile) {
    elm = angular.element('<div id="toto">' +
      '<pie-chart data="data" options="options"></pie-chart>' +
      '</div>');
    elmWithComplement = angular.element('<div id="totoWithComplement">' +
      '<pie-chart data="dataWithComplement" options="options"></pie-chart>' +
      '</div>'
    );

    $scope = $rootScope;
    $compile(elm)($scope);
    $compile(elmWithComplement)($scope);
    $scope.$digest();
  }));
  
  var svg, svgWithComplement, content, contentWithComplement;
  beforeEach(function() {
    $scope.data = [
      {label: "CPU", value: 84, color: "#0a182d"}
    ];
    $scope.dataWithComplement = [
      {label: "CPU", value: 84, color: "#0a182d", complementBrightness: 90}
    ];
    $scope.options = {mode: "gauge", thickness: 5};
    $scope.$apply();

    svg = elm[0].childNodes[0].childNodes[0];
    content = svg.childNodes[0];
    svgWithComplement = elmWithComplement[0].childNodes[0].childNodes[0];
    contentWithComplement = svgWithComplement.childNodes[0];
  });
  
  describe("data array", function() {
    it("should be left untouched", function() {
      expect($scope.data).toEqual([
        {label: "CPU", value: 84, color: "#0a182d"}
      ]);
      expect($scope.dataWithComplement).toEqual([
        {label: "CPU", value: 84, color: "#0a182d", complementBrightness: 90}
      ]);
    });
  });
  
  describe("update", function() {
    beforeEach(inject(function($utils) {
      spyOn($utils, 'draw').andCallThrough();
      spyOn($utils, 'updatePaths').andCallThrough();
    }));
    
    it("should be called instead of redraw if only data changes", inject(function($utils) {
      expect($utils.draw.callCount).toBe(0);
      expect($utils.updatePaths.callCount).toBe(0);
      
      $scope.data = [
        {label: "CPU", value: 34, color: "#0a182d"}
      ];
      $scope.$apply();
      
      expect($utils.draw.callCount).toBe(0);
      expect($utils.updatePaths.callCount).toBe(1);
      
      $scope.data = [
        {label: "CPU", value: 42, color: "#0a182d"}
      ];
      $scope.$apply();
      
      expect($utils.draw.callCount).toBe(0);
      expect($utils.updatePaths.callCount).toBe(2);
    }));
  });
  
  describe("arcs", function() {
    var arcs, arcsWithComplement;
    beforeEach(function() {
      arcs = content.childNodes[0].childNodes;
      arcsWithComplement = contentWithComplement.childNodes[0].childNodes;
    });
    
    it("should be in a single group", function() {
      expect(content.childNodes.length).toBe(2);
      expect(contentWithComplement.childNodes.length).toBe(2);
      expect(content.childNodes[0].getAttribute("id")).toBe("n3-pie-arcs");
      expect(contentWithComplement.childNodes[0].getAttribute("id")).toBe("n3-pie-arcs");
    });
    
    it("should be two", function() {
      expect(arcs.length).toBe(2);
      expect(arcsWithComplement.length).toBe(2);
    });
    
    it("should create arcs paths", function() {
      var arcs = content.childNodes[0];
      var arcsWithComplement = contentWithComplement.childNodes[0];

      var expected = [
        {"class": "arc", "id": "arc_0", "style": "fill: #0a182d; fill-opacity: 0.8;"},
        {"class": "arc", "id": "arc_1", "style": "fill: white; fill-opacity: 0.8;"}
      ];
      var expectedWithComplement = [
        {"class": "arc", "id": "arc_0", "style": "fill: #0a182d; fill-opacity: 0.8;"},
        {"class": "arc", "id": "arc_1", "style": "fill: #e7e8ea; fill-opacity: 0.8;"}
      ];

      expected.forEach(function(d, i) {
        expect(arcs.childNodes[i].nodeName).toBe("path");
        expect(arcs.childNodes[i].getAttribute("class")).toBe(d["class"]);
        expect(arcs.childNodes[i].getAttribute("id")).toBe(d["id"]);
        expect(arcs.childNodes[i].getAttribute("style").trim()).toBeSameStyleAs(d["style"]);
      });

      expectedWithComplement.forEach(function(d, i) {
        expect(arcsWithComplement.childNodes[i].nodeName).toBe("path");
        expect(arcsWithComplement.childNodes[i].getAttribute("class")).toBe(d["class"]);
        expect(arcsWithComplement.childNodes[i].getAttribute("id")).toBe(d["id"]);
        expect(arcsWithComplement.childNodes[i].getAttribute("style").trim()).toBeSameStyleAs(d["style"]);
      });

      expected = [
        "M1.3777276490407723e-14,-225A225,225 0 1,1 -189.97378323795337," +
        "-120.56102887027427L-185.75214361044328,-117.88189489537929A220," +
        "220 0 1,0 1.3471114790620885e-14,-220Z",
        "M-189.97378323795337,-120.56102887027427A225,225 0 0,1 -4.13318" +
        "2947122317e-14,-225L-4.0413344371862656e-14,-220A220,220 0 0,0 -" +
        "185.75214361044328,-117.88189489537929Z"
      ];
      
      waits(500);

      runs(function () {
        expected.forEach(function(d, i) {
          expect(arcs.childNodes[i].getAttribute("d")).toBeSamePathAs(d);
        });
      });
    });
    
    it("should not be sorted", function() {
      $scope.data = [
        {label: "CPU", value: 4, color: "#0a182d"}
      ];
      $scope.$apply();
      
      
      var expected = [
        "M1.3777276490407723e-14,-225A225,225 0 0,1 55.955224612092316," +
        "-217.931211253942L54.71177517626804,-213.08829544829882A220,220" +
        " 0 0,0 1.3471114790620885e-14,-220Z",
        "M55.955224612092316,-217.931211253942A225,225 0 1,1 1.58508314" +
        "961305e-13,-225L1.5498590796216488e-13,-220A220,220 0 1,0 54.71" +
        "177517626804,-213.08829544829882Z"
      ];
      
      // The transition lasts 250ms...
      waits(300);

      svg = elm[0].childNodes[0].childNodes[0];
      content = svg.childNodes[0];
      arcs = content.childNodes[0].childNodes;
      runs(function () {
        expected.forEach(function(d, i) {
          expect(arcs[i].getAttribute("d")).toBeSamePathAs(d);
        });
      });
    });
  });
  
  describe("legend items", function() {
    it("should be in a single legend group", function() {
      expect(content.childNodes.length).toBe(2);
      expect(content.childNodes[1].getAttribute("id")).toBe("n3-pie-legend");
    });
    
    it("should be two : one title and one value", function() {
      var legendItems = content.childNodes[1].childNodes;
      
      expect(legendItems.length).toBe(2);
    });
    
    describe("title", function() {
      var title;
      beforeEach(function() {
        title = content.childNodes[1].childNodes[0];
      });
      
      it("should be a stylized text", function() {
        expect(title.nodeName).toBe("text");
        expect(title.getAttribute("text-anchor")).toBe("middle");
        expect(title.getAttribute("style").trim()).toBeSameStyleAs(
          "font-size: 55px; fill: #0a182d; fill-opacity: 0.8;"
        );
      });
      
      it("should be classed as legend-title", function() {
        expect(title.getAttribute("class")).toBe("legend-title");
      });
      
      it("should contain the series label", function() {
        expect(title.textContent).toBe("CPU");
      });
    });
    
    describe("value", function() {
      var value;
      beforeEach(function() {
        value = content.childNodes[1].childNodes[1];
      });
      
      it("should be a stylized text", function() {
        expect(value.nodeName).toBe("text");
        expect(value.getAttribute("text-anchor")).toBe("middle");
        expect(value.getAttribute("style").trim()).toBeSameStyleAs(
          "font-size: 110px; fill: #0a182d; fill-opacity: 0.8;"
        );
      });
      
      it("should be classed as legend-value", function() {
        expect(value.getAttribute("class")).toBe("legend-value");
      });
      
      it("should contain the series label", function() {
        expect(value.textContent).toBe("84");
      });
      
      it("should be updated", function() {
        $scope.data = [
          {label: "CPU", value: 34, color: "#0a182d"}
        ];
        $scope.$apply();
        
        expect(content.childNodes[1].childNodes[1].textContent).toBe("34");
      });
      
      it("should be allow suffix", function() {
        $scope.data = [
          {label: "RAM", value: 34, suffix: "%", color: "#0a182d"}
        ];
        $scope.$apply();
        
        expect(content.childNodes[1].childNodes[1].textContent).toBe("34%");
      });
      
    });
    
  });
  
  
  
});