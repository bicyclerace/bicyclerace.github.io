/**
 * @class PlayDayToolController
 * @description
 *
 * @param parentController
 * @param svgContainer
 * @constructor
 */
function PlayDayToolController(parentController, svgContainer) {
    ViewController.call(this, parentController);
    // PRIVATE ATTRIBUTES
    var self = this;

    // UI
    var _svgContainer = svgContainer;
    var _viewBoxWidth = 380;
    var _viewBoxHeight = 180;

    // PUBLIC METHODS

    // PRIVATE METHODS
    var draw = function() {
        _svgContainer.append("rect")
            .classed("background", true)
            .attr("width", _viewBoxWidth)
            .attr("height", _viewBoxHeight);
    };

    var init = function() {
        _svgContainer
            .attr("viewBox", "0 0 " + _viewBoxWidth + " " + _viewBoxHeight)
            .attr("preserveAspectRatio", "xMidYMid meet");
        draw();
    } ();
}

// Inheritance
Utils.extend(PlayDayToolController, ViewController);