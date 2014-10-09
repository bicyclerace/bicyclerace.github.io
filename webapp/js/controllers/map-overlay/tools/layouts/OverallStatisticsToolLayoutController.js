/**
 * @class OverallStatisticsToolLayoutController
 * @description
 *
 * @param parentController
 * @param svgContainer
 * @constructor
 */
function OverallStatisticsToolLayoutController(parentController, svgContainer) {
    ViewController.call(this, parentController);
    // PRIVATE ATTRIBUTES
    var self = this;

    // UI
    var _svgContainer = svgContainer;
    var _viewBox = {width: 3200, height: 1000};

    // PUBLIC METHODS

    // PRIVATE METHODS
    var draw = function() {
        _svgContainer.append("text").text("I am OVERALL!!");
    };

    var init = function() {
        _svgContainer
            .attr("viewBox", "0 0 " + _viewBox.width + " " + _viewBox.height)
            .attr("preserveAspectRatio", "xMinYMin meet");
    } ();
}

Utils.extend(OverallStatisticsToolLayoutController, ViewController);