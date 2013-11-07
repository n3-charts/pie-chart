angular.module('demo.examples', ["apojop"])

.controller('ExamplesCtrl', function($scope) {
  mixpanel.track("Examples");
  
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
      description: "A beautiful gauge that takes a single data and shows it regarding a given total.",
      data: [
        {label: "CPU", value: 78, color: colors(3), suffix: "%"}
      ],
      options: {thickness: 10, mode: "gauge", total: 100}
    },
    {
      label: "Pie",
      description: "The classic pie chart. No legend but this is deliberate.",
      data: [
        {label: "Four", value: 44, color: colors(3)},
        {label: "Five", value: 55, color: colors(4)},
        {label: "Six", value: 66, color: colors(5)}
      ],
      options: {thickness: 200}
    }
  ];
  
  $scope.miniExamples = [
    {
      data: [{label: "RAM", value: 23, color: colors(0), suffix: "%"}],
      options: {thickness: 1, mode: "gauge", total: 100}
    },
    {
      data: [{label: "CPU", value: 57, color: colors(0), suffix: "%"}],
      options: {thickness: 1, mode: "gauge", total: 100}
    },
    {
      data: [{label: "Up", value: 57, color: colors(2), suffix: "Ko/s"}],
      options: {thickness: 1, mode: "gauge", total: 1000}
    },
    {
      data: [{label: "Down", value: 57, color: colors(3), suffix: "Ko/s"}],
      options: {thickness: 1, mode: "gauge", total: 1000}
    }
  ];
  
  setInterval(function() {
    $scope.miniExamples[0].data[0].value = parseInt(Math.random()*100);
    $scope.miniExamples[1].data[0].value = parseInt(Math.random()*100);
    $scope.miniExamples[2].data[0].value = parseInt(Math.random()*200);
    $scope.miniExamples[3].data[0].value = parseInt(Math.random()*200);
    $scope.$apply();
  }, 1000)
});
