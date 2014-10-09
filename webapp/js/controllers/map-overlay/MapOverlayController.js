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

    //svg elements
    var _topLineRect;

    //svg elements dimensions
    var _topLineHeight = 20;


    // PUBLIC METHODS


    // PRIVATE METHODS
    var draw = function() {

        //TODO TEMP Background
        _svgContainer.append("rect")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill","#CCCCEE");


        /*
        _svgContainer
            .append("button")
            .text("I am a station")
            .on('click', function() {
                // This dispatch has to be in the model
                self.getNotificationCenter().dispatch(Notifications.mapController.STATION_HAS_BEEN_SELECTED);
            });*/

        var toolsSvg = _svgContainer.append("svg")
            .classed("tools-container-controller", true)
            .attr("y", _topLineHeight)
            .attr("width", _toolsWidth)
            .attr("height", _viewBoxHeight - _bottomBarHeight - _topLineHeight


        );

        var chartsSvg = _svgContainer.append("svg")
            .classed("charts-container-controller", true)
            .attr("x", _toolsWidth)
            .attr("width", _viewBoxWidth - _toolsWidth)
            .attr("height", _viewBoxHeight - _bottomBarHeight);

        var barSvg = _svgContainer.append("svg")
            .classed("bottom-bar-controller", true)
            .attr("y", _viewBoxHeight - _bottomBarHeight)
            .attr("width", _viewBoxWidth)
            .attr("height", _bottomBarHeight);

        _toolContainerController = new ToolsContainerController(self, toolsSvg);
        _chartsContainerController = new ChartsContainerController(self, chartsSvg);
        _bottomBarController = new BottomBarController(self, barSvg);


        //Draw Top Line
        _topLineRect = _svgContainer.append("rect")
            .attr("width", _viewBoxWidth)
            .attr("height", _topLineHeight)
            .attr("fill", self.getModel().getColorModel().getIdentificationColor())
            .classed("top-line-rect", true);
    };

    var init = function() {
        _svgContainer
            .attr("viewBox", "0 0 " + _viewBoxWidth + " " + _viewBoxHeight)
            .attr("preserveAspectRatio", "xMinYMin meet");
        draw();
    } ();
}

// Inheritance
Utils.extend(MapOverlayController, ViewController);