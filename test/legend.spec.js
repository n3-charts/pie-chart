describe("legend", function() {
  
  describe("getLegendLabel", function() {
    
    xit("should normalize label", inject(function($utils) {
      expect($utils.getLegendLabel("Series", 12.25, 20)).toBe(
        "Series ....... 12.25"
      );
    }));
  });
});