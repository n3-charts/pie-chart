describe("options", function() {
  describe("sanitizeOptions", function() {
    it("should handle thickness", inject(function($utils) {
      expect($utils.sanitizeOptions({})).toEqual({thickness: 20});
      
      expect($utils.sanitizeOptions({thickness: "10"})).toEqual({thickness: 10});
    }));
    
    it("should handle gauge mode - default total to 100", inject(function($utils) {
      expect($utils.sanitizeOptions({mode: "gauge"})).toEqual({
        mode: "gauge",
        thickness: 20,
        total: 100
      });
      
      expect($utils.sanitizeOptions({mode: "gauge", total: "80"})).toEqual({
        mode: "gauge",
        thickness: 20,
        total: 80
      });
    }));
  });
});