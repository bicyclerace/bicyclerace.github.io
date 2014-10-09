/**
 * @class ToolTileViewController
 * @description
 *
 * @param parentController
 * @param svgContainer
 * @param viewBoxWidth
 * @param viewBoxHeight
 * @param toolClass
 * @constructor
 */
function ToolTileViewController(parentController, svgContainer, viewBoxWidth, viewBoxHeight, ToolClass) {
    ViewController.call(this, parentController);

    // PRIVATE ATTRIBUTES
    var self = this;

    // UI
    var _svgContainer = svgContainer;
    var _viewBoxWidth = viewBoxWidth;
    var _viewBoxHeight = viewBoxHeight;

    // Tool
    var _tool;

    var _padding = {top: 10, left: 10, bottom: 10, right: 10};

    // PUBLIC METHODS


    // PRIVATE METHODS
    var draw = function() {
        _svgContainer.classed("tool-tile-view-controller", true);
        _svgContainer.append("rect")
            .classed("background", true)
            .attr("width", "100%")
            .attr("height", "100%");

        var contentSvg =
            _svgContainer.append("svg")
                .classed("content", true)
                .attr("x", _padding.left)
                .attr("y", _padding.right)
                .attr("width", _viewBoxWidth - _padding.left - _padding.right)
                .attr("height", _viewBoxHeight - _padding.top - _padding.bottom);
        _tool = new ToolClass(self, contentSvg);
    };


    var init = function() {
        _svgContainer
            .attr("viewBox", "0 0 " + _viewBoxWidth + " " + _viewBoxHeight)
            .attr("preserveAspectRatio", "none");
        draw();
    } ();
}

// Inheritance
Utils.extend(ToolTileViewController, ViewController);