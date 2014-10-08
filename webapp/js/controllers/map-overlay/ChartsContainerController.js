/**
 * @class: ChartsContainerController
 * @description template class
 *
 * @param parentController
 * @param svgContainer
 */
function ChartsContainerController(parentController, svgContainer) {
    // Call the base class constructor
    ViewController.call(this, parentController);

    // PRIVATE ATTRIBUTES
    var self = this;

    var _svgContainer = svgContainer;
    var _viewBoxWidth = 3200;
    var _viewBoxHeight = 1000;


    // PUBLIC METHODS


    // PRIVATE METHODS
    var draw = function() {

    };

    var init = function() {
        _svgContainer
            .attr("viewBox", "0 0 " + _viewBoxWidth + " " + _viewBoxHeight);
        draw();
    } ();
}

// Inheritance
Utils.extend(ChartsContainerController, ViewController);