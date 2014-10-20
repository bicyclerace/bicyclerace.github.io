
/**
 * @class: VisualizationModuleController
 * @description template class
 *
 * @param htmlContainer = a d3 selection of the html container inside which the MapContainerController should
 * render its view.
 */
function VisualizationModuleController(htmlContainer) {
    // Call the base class constructor
    ViewController.call(this, null);

    // PRIVATE ATTRIBUTES
    var self = this;

    var _model;

    var _htmlContainer = htmlContainer;

    // Children controllers
    var _mapViewController;
    var _mapOverlayController;

    var _mapOverlaySvg, _mapViewDiv;


    // PUBLIC METHODS

    this.remove = function() {
        _mapViewController.dispose();
        _mapOverlayController.dispose();
        _mapOverlaySvg.remove();
        _mapViewDiv.remove();
        _htmlContainer.remove();

        self.getModel().getColorModel().unbindIdentificationColor(self.getModel().getId());


    };


    /**
     * @override
     * @returns {NotificationCenter}
     */
    this.getNotificationCenter = function() {
        return _model.getNotificationCenter();
    };

    /**
     * @override
     * @returns {Model}
     */
    this.getModel = function() {
        return _model;
    };

    /**
     *
     */
    this.resize = function(numberOfMaps) {
        var width = 3200 / numberOfMaps;

        _mapOverlayController.setWidth(width);

    };


    // PRIVATE METHODS
    var draw = function() {
        // Draw map view container
        _mapViewDiv = _htmlContainer.append("div").classed("map-view-controller", true);
        _mapViewController = new MapViewController(self, _mapViewDiv);

        _mapOverlaySvg = _htmlContainer.append("svg")
                                .classed("map-overlay-controller", true);
        _mapOverlayController = new MapOverlayController(self, _mapOverlaySvg);
    };

    var init = function() {
        _model = new Model();


        draw();
    } ();
}


Utils.extend(VisualizationModuleController, ViewController);


























