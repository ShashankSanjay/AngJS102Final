'use strict';

angular.module('kkrdashboard')

  .controller('AccordionDemoCtrl', function () {
    var self = this;

    self.oneAtATime = true;

    self.groups = [
      {
        title: 'Dynamic Group Header - 1',
        content: 'Dynamic Group Body - 1'
      },
      {
        title: 'Dynamic Group Header - 2',
        content: 'Dynamic Group Body - 2'
      }
    ];

    self.items = ['Item 1', 'Item 2', 'Item 3'];

    self.addItem = function() {
      var newItemNo = self.items.length + 1;
      self.items.push('Item ' + newItemNo);
    };

    self.status = {
      isFirstOpen: true,
      isFirstDisabled: false
    };
  });