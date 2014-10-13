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
    var _viewBoxWidth = 2000;
    var _viewBoxHeight = 880;

    var _padding = {top: 5, left: 5, bottom: 5, right: 5};

    // Layout
    var _currentLayout;
    var _layoutFactory;
    var _svgLayoutContainer;


    // PUBLIC METHODS
    /**
     *
     */
    this.visualizationTypeChanged = function() {
        cleanLayout();
        var currentVisualizationType = self.getModel().getVisualizationTypeModel().getCurrentVisualizationType();
        var layoutClass = _layoutFactory.getLayoutClass(currentVisualizationType);

        _currentLayout = new layoutClass(parentController, _svgLayoutContainer);

        // Setup frame
        var layoutWidth = _viewBoxWidth - _padding.left - _padding.right;
        var layoutHeight = _viewBoxHeight - _padding.top - _padding.bottom;
        _currentLayout.getView().setFrame(_padding.left, _padding.top, layoutWidth, layoutHeight);
        _currentLayout.getView().setViewBox(0, 0, layoutWidth, layoutHeight);
        _currentLayout.getView().appendTo(_svgContainer);
        _currentLayout.updateView();
    };


    // PRIVATE METHODS
    var cleanLayout = function() {
        //_svgLayoutContainer.html("");
        _svgContainer.html("");
    };

    var draw = function() {
        _svgLayoutContainer =
            _svgContainer.append("svg");

        var currentVisualizationType = self.getModel().getVisualizationTypeModel().getCurrentVisualizationType();
        var layoutClass = _layoutFactory.getLayoutClass(currentVisualizationType);
        _currentLayout = new layoutClass(parentController, _svgLayoutContainer);
        _svgLayoutContainer
            .attr("x", _padding.left)
            .attr("y", _padding.top)
            .attr("width", _viewBoxWidth - _padding.left - _padding.right)
            .attr("height", _viewBoxHeight - _padding.top - _padding.bottom);
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