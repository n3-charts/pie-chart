describe('directive', function() {
  
  beforeEach(inject(function($utils) {
    spyOn($utils, 'getDefaultMargins').andReturn(
      {top: 20, right: 50, bottom: 30, left: 50}
    );
  }));
  
  it('should draw camemberts parts', function() {
    
  });
});