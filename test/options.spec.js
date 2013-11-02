describe("options", function() {
  describe("sanitizeOptions", function() {
    it("should handle thickness", inject(function($utils) {
      expect($utils.sanitizeOptions({})).toEqual({thickness: 20});
      
      expect($utils.sanitizeOptions({thickness: "10"})).toEqual({thickness: 10});
    }));
  });
});