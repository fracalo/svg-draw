'use strict';



describe('svgFiddle App', function() {

  describe('draw path directive', function() {

    beforeEach(function() {
      browser.get('app/index.html');
    });

      it('should have title SVG', function() {

       expect(browser.getTitle()).toEqual('SVG')


    });
    /*it('should add a a value to $scope.points every click() on svg.artboard', function() {

       var svgDomEl = element(by.id('artboard'));
       svgDomEl.click();
      
      expect(element.all(by.repeater('p in points')).count().toBe(1));

    });*/
  });
});



