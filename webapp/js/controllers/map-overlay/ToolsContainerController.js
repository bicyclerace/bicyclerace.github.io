/**
 * @class: ToolsContainerController
 * @description template class
 *
 * @param parentController
 * @param svgContainer
 */
function ToolsContainerController(parentController, svgContainer) {
    // Call the base class constructor
    ViewController.call(this, parentController);

    // PRIVATE ATTRIBUTES
    var self = this;

    var _svgContainer = svgContainer;
    var _viewBoxWidth = 3200;
    var _viewBoxHeight = 1000;

    var _padding = {top: 10, left: 10, bottom: 10, right: 10};

    // Tools
    var _playDayTool;
    var _playDayToolWidth = 400;
    var _playDayToolHeight = 200;


    // PUBLIC METHODS


    // PRIVATE METHODS
    var draw = function() {
        var gToolsGroup = _svgContainer.append("g");
        gToolsGroup.attr("transform", function() {
            var x = _padding.left;
            var y = _padding.top;
            return "translate(" + x + "," + y + ")";
        });

        var playDaySvg =
            gToolsGroup.append("svg")
                .classed("play-day-tool-controller", true)
                .attr("width", _playDayToolWidth)
                .attr("height", _playDayToolHeight);
        _playDayTool = new ToolTileViewController(self, playDaySvg, _playDayToolWidth, _playDayToolHeight, PlayDayToolController);
    };

    var init = function() {
        _svgContainer
            .attr("viewBox", "0 0 " + _viewBoxWidth + " " + _viewBoxHeight)
            .attr("preserveAspectRatio", "xMinYMin meet");
        draw();
    } ();
}

// Inheritance
Utils.extend(ToolsContainerController, ViewController);