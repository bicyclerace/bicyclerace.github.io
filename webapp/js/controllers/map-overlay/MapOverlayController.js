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
    var _chartsWidth = 1400;
    var _minToolsWith = 1800;
    var _bottomBarHeight = 100;

    // Children controllers
    var _toolContainerController;
    var _chartsContainerController;
    var _bottomBarController;

    //Svgs
    var _chartsSvg,
        _toolsSvg,
        _barSvg;

    //svg elements
    var _topLineRect;

    //svg elements dimensions
    var _topLineHeight = 20;


    // PUBLIC METHODS
    this.setWidth = function(width){
        _viewBoxWidth = width;
        _chartsSvg.attr("x", width - _chartsWidth);

        //Overlapping or resizing tools layout
        if(width - _chartsWidth < _minToolsWith) {
            _toolContainerController.setWidth(width);
            _toolContainerController.updateView();
        } else {
            _toolContainerController.setWidth(_viewBoxWidth - _chartsWidth);
            _toolContainerController.updateView();
        }

    };

    // PRIVATE METHODS
    var draw = function() {

        _toolsSvg = _svgContainer.append("svg")
            .classed("tools-container-controller", true)
            .attr("y", _topLineHeight)
            .attr("width", _viewBoxWidth - _chartsWidth)
            .attr("height", _viewBoxHeight - _bottomBarHeight - _topLineHeight


        );

        _chartsSvg = _svgContainer.append("svg")
            .classed("charts-container-controller", true)
            .attr("x", _viewBoxWidth - _chartsWidth)
            .attr("width", _chartsWidth)
            .attr("height", _viewBoxHeight - _bottomBarHeight);

        _barSvg = _svgContainer.append("svg")
            .classed("bottom-bar-controller", true)
            .attr("y", _viewBoxHeight - _bottomBarHeight)
            .attr("width", _viewBoxWidth)
            .attr("height", _bottomBarHeight);

        _toolContainerController = new ToolsContainerController(self, _toolsSvg);
        _chartsContainerController = new ChartsContainerController(self, _chartsSvg);
        _bottomBarController = new BottomBarController(self, _barSvg);


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
            .attr("preserveAspectRatio", "xMinYMin slice");
        draw();
    } ();
}

// Inheritance
Utils.extend(MapOverlayController, ViewController);