/**
 * @class PlayDayToolController
 * @description
 *
 * @param parentController
 * @param svgContainer
 * @constructor
 */
function PlayDayToolController(parentController, svgContainer) {
    ToolTileViewController.call(this, parentController, svgContainer);
    // PRIVATE ATTRIBUTES
    var self = this;

    // UI
    var _viewBoxWidth = 200;
    var _viewBoxHeight = 100;

    // PUBLIC METHODS
    this.getAspectRatio = function() {
        return _viewBoxWidth / _viewBoxHeight;
    };

    // PRIVATE METHODS
    var draw = function() {
        self.getContentBox()
            .append("rect")
                .classed("background", true)
                .attr("width", "100%")
                .attr("height", "100%");
    };

    var init = function() {
        self.setViewBox(_viewBoxWidth, _viewBoxHeight);
        draw();
    } ();
}

// Inheritance
Utils.extend(PlayDayToolController, ToolTileViewController);