angular.module('demo.examples', ["apojop"])

.controller('ExamplesCtrl', function($scope) {
  //mixpanel.track("Examples");
  
  var colors = d3.scale.category10();
  
  $scope.examples = [
    {
      label: "Donut chart",
      description: "The classic donut chart, with adaptative legend.",
      data: [
        {label: "One", value: 11, color: colors(0)},
        {label: "Two", value: 22, color: colors(1)},
        {label: "Three", value: 33, color: colors(2)}
      ],
      options: {thickness: 10}
    },
    {
      label: "Gauge",
      description: "",
      data: [
        {label: "CPU", value: 78, color: colors(3), suffix: "%"}
      ],
      options: {thickness: 10, mode: "gauge", total: 100}
    }
  ];
});
