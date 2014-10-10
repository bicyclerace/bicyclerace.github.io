/**
 * @class OverallStatisticsToolsLayoutController
 * @description implements
 *
 * @param parentController
 * @param svgContainer
 * @constructor
 */
function OverallStatisticsToolsLayoutController(parentController, svgContainer) {
    ViewController.call(this, parentController);
    // PRIVATE ATTRIBUTES
    var self = this;

    // UI
    var _svgContainer = svgContainer;
    var _viewBox = {width: 3200, height: 1000};

    // PUBLIC METHODS

    // PRIVATE METHODS
    var draw = function() {
        //_svgContainer.append("rect").attr("width", "100%").attr("height", "100%");

    };

    var init = function() {
        _svgContainer
            .classed("overall-statistics-tool-layout-controller", true)
            .attr("viewBox", "0 0 " + _viewBox.width + " " + _viewBox.height)
            .attr("preserveAspectRatio", "xMinYMin meet");
        draw();
    } ();
}

Utils.extend(OverallStatisticsToolsLayoutController, ViewController);