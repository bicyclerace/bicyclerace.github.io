/**
 * @class ToolTileViewController
 * @description
 *
 * @param parentController
 * @param svgContainer
 * @constructor
 */
function ToolTileViewController(parentController, svgContainer) {
    ViewController.call(this, parentController);

    // PRIVATE ATTRIBUTES
    var self = this;

    // UI
    var _svgContainer = svgContainer;
    var _viewBox = {width: 500, height:500};

    var _svgContent;


    var _padding = {top: 10, left: 10, bottom: 10, right: 10};

    // PUBLIC METHODS
    /**
     *
     * @param top
     * @param bottom
     * @param left
     * @param right
     */
    this.setPadding = function(top, bottom, left, right) {
        _padding.top = top;
        _padding.bottom = bottom;
        _padding.left = left;
        _padding.right = right;
        update();
    };

    /**
     *
     * @param width
     * @param height
     */
    this.setViewBox = function(width, height) {
        _viewBox.width = width;
        _viewBox.height = height;
        update();
    };

    /**
     *
     * @returns {{width: number, height: number}}
     */
    this.getViewBox = function() {
        return _viewBox;
    };

    /**
     *
     * @returns {*}
     */
    this.getContentBox = function() {
        return _svgContent;
    };


    // PRIVATE METHODS
    var update = function() {
        _svgContainer
            .attr("viewBox", "0 0 " + _viewBox.width + " " + _viewBox.height);

        _svgContent
            .attr("x", _padding.left)
            .attr("y", _padding.right)
            .attr("width", _viewBox.width - _padding.left - _padding.right)
            .attr("height", _viewBox.height - _padding.top - _padding.bottom);
    };

    var draw = function() {
        _svgContainer.classed("tool-tile-view-controller", true);

        _svgContainer.append("rect")
            .classed("background", true)
            .attr("width", "100%")
            .attr("height", "100%");

        _svgContent =
            _svgContainer.append("svg")
                .classed("content", true)
                .attr("x", _padding.left)
                .attr("y", _padding.right)
                .attr("width", _viewBox.width - _padding.left - _padding.right)
                .attr("height", _viewBox.height - _padding.top - _padding.bottom);
    };


    var init = function() {
        _svgContainer
            .attr("viewBox", "0 0 " + _viewBox.width + " " + _viewBox.height)
            .attr("preserveAspectRatio", "xMidYMid meet");
        draw();
    } ();
}

// Inheritance
Utils.extend(ToolTileViewController, ViewController);