/**
 * @class PlayADayToolsLayoutController
 * @description
 *
 * @param parentController
 * @param svgContainer
 * @constructor
 */
function PlayADayToolsLayoutController(parentController, svgContainer) {
    ViewController.call(this, parentController);
    // PRIVATE ATTRIBUTES
    var self = this;

    // UI
    var _svgContainer = svgContainer;
    var _viewBox = {width: 3200, height: 1000};

    // Tools
    var _playDayBox = {x: 10, y: 10, height: 200};
    var _playToolController;

    // PUBLIC METHODS

    // PRIVATE METHODS
    var draw = function() {
        // Adding play a day tool
        var playDaySvg =
            _svgContainer.append("svg")
                .classed("play-day-tool-controller", true);

        _playToolController = new PlayDayToolController(self, playDaySvg);
        playDaySvg

            .attr("width", _playToolController.getAspectRatio() * _playDayBox.height)
            .attr("height", _playDayBox.height);

        // Add calendar
    };

    var init = function() {
        _svgContainer
            .classed("overall-statistics-tool-layout-controller", true)
            .attr("viewBox", "0 0 " + _viewBox.width + " " + _viewBox.height)
            .attr("preserveAspectRatio", "xMinYMin meet");
        draw();
    } ();
}

Utils.extend(PlayADayToolsLayoutController, ViewController);