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

    // Layout
    var _currentLayout;
    var _layoutFactory;
    var _svgLayoutContainer;

    // Tools
    //var _playDayTool;
    //var _playDayToolHeight = 200;


    // PUBLIC METHODS
    /**
     *
     */
    this.visualizationTypeChanged = function() {
        clearLayout();
        var currentVisualizationType = self.getModel().getVisualizationTypeModel().getCurrentVisualizationType();
        var layoutClass = _layoutFactory.getLayoutClass(currentVisualizationType);
        _currentLayout = new layoutClass(parentController, _svgLayoutContainer);
    };


    // PRIVATE METHODS
    var clearLayout = function() {
        _svgLayoutContainer.html("");
    };

    var draw = function() {
        _svgLayoutContainer =
            _svgContainer.append("svg")
                .attr("x", _padding.left)
                .attr("y", _padding.top)
                .attr("width", _viewBoxWidth - _padding.left - _padding.right)
                .attr("height", _viewBoxHeight - _padding.top - _padding.bottom);
        var currentVisualizationType = self.getModel().getVisualizationTypeModel().getCurrentVisualizationType();
        var layoutClass = _layoutFactory.getLayoutClass(currentVisualizationType);
        _currentLayout = new layoutClass(parentController, _svgLayoutContainer);
        /*
        var gToolsGroup = _svgContainer.append("g");
        gToolsGroup.attr("transform", function() {
            var x = _padding.left;
            var y = _padding.top;
            return "translate(" + x + "," + y + ")";
        });

        var playDaySvg =
            gToolsGroup.append("svg")
                .classed("play-day-tool-controller", true);

        _playDayTool = new PlayDayToolController(self, playDaySvg);
        playDaySvg
            .attr("width", _playDayTool.getAspectRatio() * _playDayToolHeight)
            .attr("height", _playDayToolHeight);*/
    };

    var init = function() {
        _svgContainer
            .attr("viewBox", "0 0 " + _viewBoxWidth + " " + _viewBoxHeight)
            .attr("preserveAspectRatio", "xMinYMin meet");
        _layoutFactory = new LayoutFactory();
        draw();

        self.getNotificationCenter()
            .subscribe(self, self.visualizationTypeChanged, Notifications.visualizationTypeStatus.VISUALIZATION_TYPE_CHANGED);
    } ();
}

// Inheritance
Utils.extend(ToolsContainerController, ViewController);