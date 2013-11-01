sanitizeOptions: function(options) {
  if (options.thickness === undefined) {
    options.thickness = 20;
  }
  
  options.thickness = parseInt(options.thickness);
  
  return options;
}