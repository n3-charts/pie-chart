describe("misc", function() {
  describe("looksLikeSameSeries", function() {
    it("should be false when different amount of series", inject(function($utils) {
      var newData = [];
      var oldData = [{label: "foo", value: 42, color: "red"}];
      
      expect($utils.looksLikeSameSeries(newData, oldData)).toBeFalsy();
    }));
    
    it("should be true when only the value changed", inject(function($utils) {
      var oldData = [{label: "foo", value: 42, color: "red"}];
      var newData = [{label: "foo", value: 37, color: "red"}];
      
      expect($utils.looksLikeSameSeries(newData, oldData)).toBeTruthy();
    }));
    
    it("should be false when a label has changed", inject(function($utils) {
      var oldData = [{label: "foo", value: 42, color: "red"}];
      var newData = [{label: "bar", value: 42, color: "red"}];
      
      expect($utils.looksLikeSameSeries(newData, oldData)).toBeFalsy();
    }));
    
    it("should be false when a color has changed", inject(function($utils) {
      var oldData = [{label: "bar", value: 42, color: "blue"}];
      var newData = [{label: "bar", value: 42, color: "red"}];
      
      expect($utils.looksLikeSameSeries(newData, oldData)).toBeFalsy();
    }));
  });
});