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