/**
 * @class: MapOverlayController
 * @description template class
 *
 * @param parentController
 * @param svgContainer
 */
function MapOverlayController(parentController, svgContainer) {
    // Call the base class constructor
    ViewController.call(this, parentController);

    // PRIVATE ATTRIBUTES
    var self = this;

    var _svgContainer = svgContainer;
    var _viewBoxWidth = 3200;
    var _viewBoxHeight = 1000;

    // Bar height
    var _toolsWidth = 2000;
    var _bottomBarHeight = 100;

    // Children controllers
    var _toolContainerController;
    var _chartsContainerController;
    var _bottomBarController;


    // PUBLIC METHODS


    // PRIVATE METHODS
    var draw = function() {
        /*
        _svgContainer
            .append("button")
            .text("I am a station")
            .on('click', function() {
                // This dispatch has to be in the model
                self.getNotificationCenter().dispatch(Notifications.mapController.STATION_HAS_BEEN_SELECTED);
            });*/

        var toolsSvg = _svgContainer.append("svg")
            .attr("width", _toolsWidth)
            .attr("height", _viewBoxHeight - _bottomBarHeight)
            .classed("tools-container-controller", true);

        var chartsSvg = _svgContainer.append("svg")
            .attr("x", _toolsWidth)
            .attr("width", _viewBoxWidth - _toolsWidth)
            .attr("height", _viewBoxHeight - _bottomBarHeight)
            .classed("charts-container-controller", true);

        var barSvg = _svgContainer.append("svg")
            .attr("y", _viewBoxHeight - _bottomBarHeight)
            .attr("width", _viewBoxWidth)
            .attr("height", _bottomBarHeight)
            .classed("bottom-bar-controller", true);

        _toolContainerController = new ToolsContainerController(self, toolsSvg);
        _chartsContainerController = new ChartsContainerController(self, chartsSvg);
        _bottomBarController = new BottomBarController(self, barSvg);
    };

    var init = function() {
        _svgContainer
            .attr("viewBox", "0 0 " + _viewBoxWidth + " " + _viewBoxHeight);
        draw();
    } ();
}

// Inheritance
Utils.extend(MapOverlayController, ViewController);