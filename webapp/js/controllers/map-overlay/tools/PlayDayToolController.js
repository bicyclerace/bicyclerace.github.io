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

    // PRIVATE METHODS
    var draw = function() {
        self.getContentBox()
            .append("rect")
                .classed("background", true)
                .attr("width", "100%")
                .attr("height", "100%")
            .on("click", function(){self.getModel().getTimeModel().setPlayState(AnimationState.PLAY);});
    };

    var init = function() {
        self.setViewBox(_viewBoxWidth, _viewBoxHeight);
        svgContainer.classed("play-day-tool-controller", true);
        draw();
    } ();
}

// Inheritance
Utils.extend(PlayDayToolController, ToolTileViewController);